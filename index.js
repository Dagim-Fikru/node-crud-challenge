//import perssons from store.js
const persons = require('./store')
const {postValidation,putValidation} = require('./utils/validation')
const express = require('express')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // allow access to any client
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // which headers to accept
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // which methods to accept
        return res.status(200).json({});
    }
    next();
});

app.set('db', persons)
//TODO: Implement crud of persons
app.get('/person', (req, res) => {
    const db = app.get('db')
    res.send(db)
})

app.get('/person/:id', (req, res) => {
    const db = app.get('db')
    const person = db.find(person => person.id === req.params.id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).send(
            'Person not found or invalid id'
        )
    }
})

app.post('/person', (req, res) => {
    const { error } = postValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    req.body.id = uuidv4();
    const db = app.get('db');
    db.push(req.body);
    res.status(200).send('Person added successfully');
});

app.put('/person/:id', (req, res) => {
    const { error } = putValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const db = app.get('db')
    const person = db.find(person => person.id === req.params.id)
    if (person) {
        Object.assign(person, req.body)
        res.status(200).send(
            'Person updated successfully'
        )
    } else {
        res.status(404).send(
            'Person not found or invalid id'
        )
    }
})

app.delete('/person/:id', (req, res) => {
    const db = app.get('db')
    const index = db.findIndex(person => person.id === req.params.id)
    if (index !== -1) {
        db.splice(index, 1)
        res.status(200).send(
            'Person deleted successfully'
        )
    } else {
        res.status(404).send(
            'Person not found or invalid id'
        )
    }
})
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


if (require.main === module) {
    app.listen(3000)
}
module.exports = app;