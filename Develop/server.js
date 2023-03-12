const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// the port the app will run on
const PORT = process.env.PORT || 3001;
// use express functionality
const app = express();

app.use(express.static("./public"));

// path to db.json
// const savedNotes = require("./db/db.json");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// returns the index.html page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// returns the notes.html page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//api route that reads the db.json file and returns saved notes as json
app.get("/api/notes", (req, res) => {
  readFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  res.json(`${req.method} request received`);

  console.info(req.rawHeaders);

  console.info(`${req.method} request received`);
});

// message that displays when server is started
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
