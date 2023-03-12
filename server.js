// importing necessary packages and modules
const express = require("./Develop/node_modules/express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// the port the app will run on
const PORT = process.env.PORT || 3001;
// use express functionality
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gives access to static files in the public folder
app.use(express.static("Develop/public"));

// simplifying some asynchronous functions to use later
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// returns the index.html page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "Develop/public/index.html"))
);

// returns the notes.html page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"))
);

// every wildcard i make breaks the code, not sure what I'm doing wrong
// gives a <!DOCTYPE> is not proper JSON error
// app.get('/*', (req, res, err) => {
//   if(err){
//     res.sendFile(path.join(__dirname, '/public/index.html'));
//   }});

//api route that reads the db.json file and returns saved notes as json
app.get("/api/notes", (req, res) => {
  readFile("Develop/db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  // destructures the req.body to help define a new note object
  const { title, text } = req.body;
  // function to create a unique id for each new note
  newId = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  // defines a new note object if title and text are present
  if (title && text) {
    const note = {
      title,
      text,
      // unique id is created using newId function
      id: newId(),
    };

    // reads the db.json file
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
      // logs error if error
      if (err) {
        console.error(err);
        // if no error, parse the db.json data
      } else {
        // parse the data into array/object form
        const parsedData = JSON.parse(data);
        // add new note to db.json data
        parsedData.push(note);
        // overwrite db.json file with string containing old and new data
        writeFile("Develop/db/db.json", JSON.stringify(parsedData));
        res.json(note);
      }
    });
  }
});

// function to delete a note
app.delete("/api/notes/:id", (req, res) => {
  // variable to hold the id of the note that is being deleted
  const badNote = req.params.id;

  // reads the db.json file
  readFile("Develop/db/db.json").then((data) => {
    // parses the data so it's in array/object form
    const parsedData = JSON.parse(data);
    // filter the parsed data and remove any object whose id matches the one we want to delete
    const newData = parsedData.filter((data) => data.id !== badNote);
    // //log the filtered array to make sure the right note has been deleted
    // console.log(newData);
    // overwrite db.json with the filtered data
    writeFile("Develop/db/db.json", JSON.stringify(newData));
    // visually remove the deleted data from the page
    res.json(newData);
  });
});

// message that displays when server is started
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
