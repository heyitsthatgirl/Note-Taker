const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const e = require("express");

// the port the app will run on
const PORT = process.env.PORT || 3001;
// use express functionality
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  //reads the db.json file and returns the data in a format that can be displayed
  readFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// function to add a new note
app.post("/api/notes", (req, res) => {
  // destructures the req.body to help define a new note object
  const { title, text } = req.body;

  // defines a new note object
  if (title && text) {
    const note = {
      title,
      text,
    };

    // reads the db.json file
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      // logs error if error
      if (err) {
        console.error(err);
        // if no error, parse the db.json data
      } else {
        const parsedData = JSON.parse(data);
        // add new note to db.json data
        parsedData.push(note);
        // overwrite db.json file with string containing old and new data
        writeFile("./db/db.json", JSON.stringify(parsedData));
      }
    });
  }
});

// message that displays when server is started
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
