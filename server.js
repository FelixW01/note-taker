const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;


//middleware
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
app.use(express.static('public'));

//HTML routes 
//Workflow #1
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));;
});
//#2
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/api/notes', function(req, res) {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        const parsedData = JSON.parse(data)  
        res.json(parsedData);
        console.log(parsedData);
    })
})

//reads and appends to db.json
//#4
const readAndAppendToDb = (content, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const jsonData = JSON.parse(data);
            jsonData.push(content)
            WriteNewNoteToDb(file, jsonData)
        }
    });
};

//writes new note to db.json
//#5
const WriteNewNoteToDb = (file, content) => {
    fs.writeFile(file, JSON.stringify(content, null, 4), (error) =>
    error
    ? console.error('There was an error writing the file: ', error)
    : console.log(`Information recorded at ${file}`)
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

//wild card catches any path that aren't hard coded
app.get('*', (req, res) => {
    res.send(path.join(__dirname, './public/index.html'));
});

    //server listening on port 3000
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}!`)
    });