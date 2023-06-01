const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env || 3001;


//middleware
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
app.use(express.static('public'));

//HTML routes 
//Workflow #1
//landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));;
});
//#2
///notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//returns the db.json info to the user in JSON form
app.get('/api/notes', function(req, res) {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        const parsedData = JSON.parse(data)  
        res.json(parsedData);
        console.log(parsedData);
    })
})

//reads and appends to db.json
//#4
const readAndAppendToDb = (newNote, db) => {
    fs.readFile(db, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const jsonData = JSON.parse(data);
            jsonData.push(newNote)
            WriteNewNoteToDb(db, jsonData)
        }
    });
};

//writes new note to db.json
//#5
const WriteNewNoteToDb = (db, content) => {
    fs.writeFile(db, JSON.stringify(content, null, 4), (error) =>
    error
    ? console.error('There was an error writing the file: ', error)
    : console.log(`Information recorded at ${db}`)
    )};
    
//gets the req.body via post req from user
//#3
app.post('/api/notes', (req, res) => {
     if (req.body.title && req.body.text) {
          let newNote = {
               title: req.body.title,
               text: req.body.text,
               id: uuidv4(),
        };
     readAndAppendToDb(newNote, 'db/db.json');
     } else {
        res.json('Error')
     }
})   

//handles deleteNote when the delete button is pressed
function deleteNote(id, db) {
    fs.readFile(db, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const jsonData = JSON.parse(data);
            //filters the jsonData for notes that doesnt contain the note.id
            const newJsonData = jsonData.filter((note) => note.id !== id);
            //runs the writeNotetoDB with the newJsonData without the note that contains the selected id
            WriteNewNoteToDb(db, newJsonData)
        }
    }); 
}

//delete request that takes in the id of the clicked note
app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    deleteNote(id, 'db/db.json')
    
})

//wild card catches any path that aren't hard coded
app.get('*', (req, res) => {
    res.send(path.join(__dirname, './public/index.html'));
});

//server listening on port 3000
app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}!`)
});