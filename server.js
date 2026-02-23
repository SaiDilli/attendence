const express = require("express");
const app = express();

// store current user
let currentUser = "";

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


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


// 👉 dashboard page (styled)
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


// 👉 attendance success page
app.post("/attendance", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>Success</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div class="card">
      <h2>Attendance Marked ✅</h2>
      <a href="/dashboard">Go Back</a>
    </div>
  </body>
  </html>
  `);
});


// start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});