import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import imageType from "image-type";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PgSession = connectPgSimple(session);

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5433, // ubah sesuai dengan port database
});

const createTableSQL = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'session') THEN
        CREATE TABLE session (
            sid VARCHAR NOT NULL COLLATE "default",
            sess JSON NOT NULL,
            expire TIMESTAMPTZ NOT NULL,
            PRIMARY KEY (sid)
        );
        CREATE INDEX "IDX_session_expire" ON session(expire);
    END IF;
END $$;
`;

pool.connect().then((client) => {
  return client
    .query(createTableSQL)
    .then(() => {
      console.log("Session table created successfully or already exists");
      client.release();
    })
    .catch((err) => {
      console.error("Error creating session table:", err);
      client.release();
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

const port = 3000;

app.get("/jobs/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const userIdInt = parseInt(userID);

    const appliedResult = await pool.query(
      "SELECT * FROM job_applied WHERE user_id = $1",
      [userIdInt]
    );

    if (appliedResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "You haven't applied for any job!" });
    }

    const appliedJobIds = appliedResult.rows.map((row) => row.job_id);

    const jobResults = await pool.query(
      "SELECT * FROM jobs WHERE id = ANY($1)",
      [appliedJobIds]
    );

    const jobs = jobResults.rows.map((job) => {
      if (job.company_logo) {
        const buffer = Buffer.from(job.company_logo);
        const base64Image = buffer.toString("base64");
        job.company_logo = `data:image/jpeg;base64,${base64Image}`;
      }
      return job;
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/courses/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const enrolledResult = await pool.query(
      "SELECT * FROM course_enrolled WHERE user_id = $1",
      [parseInt(userID)]
    );

    if (enrolledResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "You haven't enrolled in any courses!" });
    }

    const courses = [];

    for (const row of enrolledResult.rows) {
      const courseResult = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [row.course_id]
      );

      if (courseResult.rows.length > 0) {
        if (courseResult.rows[0].course_thumbnail) {
          const buffer = Buffer.from(courseResult.rows[0].course_thumbnail);
          const base64Image = buffer.toString("base64");
          courseResult.rows[0].course_thumbnail = `data:image/jpeg;base64,${base64Image}`;
        }

        courses.push(courseResult.rows[0]);
      } else {
        console.log(`No course found for course_id: ${row.course_id}`);
      }
    }

    res.status(200).json(courses);
  } catch (err) {
    console.log("Error response details:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/push/email", async (req, res) => {
  const email = req.body.data;

  console.log("email: ", email);
  try {
    const result = await pool.query(
      "INSERT INTO email_info (email) VALUES ($1)",
      [email]
    );
    res.status(200).json({ message: "Email is successfully pushed!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/register", async (req, res) => {
  const data = req.body;
  if (data) console.log("Received data:", data);
  try {
    const findUser = await pool.query(
      "SELECT * FROM users WHERE fullname = $1",
      [data.fullname]
    );

    if (findUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      await pool.query(
        "INSERT INTO users (fullname, email, password, disabilitytype) VALUES ($1, $2, $3, $4)",
        [data.fullname, data.email, hashedPassword, data.type]
      );

      return res.status(200).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/enrolled/:userID/:courseID", async (req, res) => {
  const { userID, courseID } = req.params;
  console.log(courseID);
  console.log(userID);

  try {
    await pool.query(
      "INSERT INTO course_enrolled (course_id, user_id) VALUES($1, $2) ON CONFLICT DO NOTHING",
      [parseInt(courseID), parseInt(userID)]
    );

    await pool.query(
      "UPDATE courses SET enrolled = enrolled + 1 WHERE id = $1",
      [parseInt(courseID)]
    );

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/applied/:userID/:jobID", async (req, res) => {
  const { userID, jobID } = req.params;

  try {
    await pool.query(
      "INSERT INTO  job_applied (job_id, user_id) VALUES($1, $2) ON CONFLICT DO NOTHING",
      [parseInt(jobID), parseInt(userID)]
    );
    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/job/applied/:userID/:jobID", async (req, res) => {
  const { userID, jobID } = req.params;
  console.log(userID);
  console.log(jobID);
  try {
    const result = await pool.query(
      "SELECT * FROM job_applied WHERE job_id = $1 AND user_id = $2",
      [jobID, userID]
    );

    if (result.rows.length != 0) {
      res.status(200).json({ message: "Enrolled!" });
    } else {
      res.status(404).json({ message: "Not Enrolled" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/course/enrolled/:userID/:courseID", async (req, res) => {
  const { userID, courseID } = req.params;
  console.log(courseID);
  console.log(userID);

  try {
    const result = await pool.query(
      "SELECT * FROM course_enrolled WHERE course_id = $1 AND user_id = $2",
      [courseID, userID]
    );

    if (result.rows.length != 0) {
      res.status(200).json({ message: "Enrolled!" });
    } else {
      res.status(404).json({ message: "Not Enrolled" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const data = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE fullname = $1", [
      data.fullname,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      } else {
        req.session.userId = user.id;
        return res.status(200).json(user);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/get/courses", async (req, res) => {
  const { filter, search } = req.query;

  let query = "SELECT * FROM courses";
  const params = [];

  if (filter && search) {
    query += " WHERE coursetype = $1 AND name ILIKE $2";
    params.push(filter, `%${search}%`);
  } else if (filter) {
    query += " WHERE coursetype = $1";
    params.push(filter);
  } else if (search) {
    query += " WHERE name ILIKE $1";
    params.push(`%${search}%`);
  }

  try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs");

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No jobs available" });
    }

    const jobs = result.rows.map((job) => {
      if (job.company_logo) {
        const buffer = Buffer.from(job.company_logo);

        const type = imageType(buffer);
        const mimeType = type ? type.mime : "image/jpeg";

        const base64Image = buffer.toString("base64");
        job.company_logo = `data:${mimeType};base64,${base64Image}`;
      }
      return job;
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get/course/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = result.rows[0];

    if (course.course_thumbnail) {
      const buffer = Buffer.from(course.course_thumbnail);

      const type = imageType(buffer);
      const mimeType = type ? type.mime : "image/jpeg";

      const base64Image = buffer.toString("base64");
      course.course_thumbnail = `data:${mimeType};base64,${base64Image}`;
    }

    res.status(200).json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/get/job/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = result.rows[0];

    if (job.company_logo) {
      const buffer = Buffer.from(job.company_logo);

      const type = imageType(buffer);
      const mimeType = type ? type.mime : "image/jpeg";

      const base64Image = buffer.toString("base64");
      job.company_logo = `data:${mimeType};base64,${base64Image}`;
    }

    res.status(200).json(job);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
