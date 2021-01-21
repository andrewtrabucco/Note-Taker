// Dependencies
let express = require("express");
let path = require("path");
var fs = require("fs");


// Sets up Express 
let app = express();
let PORT = process.env.PORT || 3000;
let db = require("./db/db.json");

// Create a unique ID
function createID() {
    let time = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

// Sets up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});


// Read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    res.json(db)
});


// Receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    let newNote = {
        id: createID(),
        title: req.body.title,
        text: req.body.text,
    }

    db.push(newNote)

    console.log(db)
    fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
        if (err) throw err
        res.json(db)
    })
});


// Receive a query parameter containing the id of a note to delete. 
app.delete("/api/notes/:id", function (req, res) {
    console.log(req.params.id)
    for (var i = 0; i < db.length; i++) {
        if (db[i].id === req.params.id) {
            db.splice(i, 1)
        }
    }

    fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
        if (err) throw err
        res.json(db)
    })
});


// Server Listener 
app.listen(PORT, function () {
    console.log("App Listening " + PORT)
});

