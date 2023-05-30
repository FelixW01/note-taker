const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;



//middleware
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
app.use(express.static('public'));

//HTML routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));;
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.send(path.join(__dirname, './public/index.html'));
});


app.get('/api/notes', function(req, res) {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        notes = [].concat(JSON.parse(data))  
        res.json(notes);
        console.log(data);
    })
})




//server listening on port 3000
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`)
});