const express = require("express");
const { Pool } = require("pg");

const app = express();

// store current user
let currentUser = "";

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ===============================
   PostgreSQL Connection (Render)
================================ */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


pool.query(`
  CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)
.then(() => console.log("Attendance table ready"))
.catch(err => console.error("Table creation error:", err));


/* ===============================
   ROUTES
================================ */

// 👉 open login page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});


// 👉 login route
app.post("/login", (req, res) => {
  currentUser = req.body.username;
  console.log("Login:", currentUser);
  res.redirect("/dashboard");
});


// 👉 dashboard page
app.get("/dashboard", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="card">
      <h2>Welcome ${currentUser} 👋</h2>

      <form action="/attendance" method="POST">
        <button type="submit">Mark Attendance</button>
      </form>

      <br>
      <a href="/">Logout</a>
    </div>
  </body>
  </html>
  `);
});


// 👉 SAVE attendance into PostgreSQL
app.post("/attendance", async (req, res) => {
  console.log("Attendance route triggered");
  try {

    await pool.query(
      "INSERT INTO attendance (username) VALUES ($1)",
      [currentUser]
    );

    res.send(`
    <html>
    <head>
      <title>Success</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <div class="card">
        <h2>Attendance Marked & Saved ✅</h2>
        <a href="/dashboard">Go Back</a>
      </div>
    </body>
    </html>
    `);

  } catch (err) {
    console.error(err);
    res.send("Database Error ❌");
  }
});


// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});