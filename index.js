const express = require('express');
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan');
const app = express();
app.use(express.json());
const Phonebook = require('./models/phonebook.js');
const phonebook = require('./models/phonebook.js');
morgan.token('test', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :status :res[content-length] - :response-time ms :test'))
app.use(cors())
app.use(express.static('build'))


// Homepage
app.get('/', (request, response) => {
    response.send('<h1>Welcome to the Persons DataBase</h1>');
})

// Get all Persons
app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(entries => {
        response.json({status: 200, message: "successful", data: entries})
    })
})

// Get Info
app.get('/info', (request, response, next) => {
    const date = new Date();
    Phonebook.find({})
        .then(entries => {
            response.send(
                `<p>Phonebook has info for ${entries.length} entries</p>
                <p>${date}</p>`
            );
        })
        .catch(err => next(err))
})

// Get a Person
app.get('/api/persons/:id', (request, response, next) => {
    let id = request.params.id;
    Phonebook.findById(id)
        .then(entry => {
            if (entry) {
                response.json({status: 200, message: "successful", data: entry})
            } else {
                response.statusMessage = "Resource Not Found";
                response.status(404).json({status: 404, message: 'Resource Not Found'})
            }
        })
        .catch(err => next(err))

})

// Delete a Person
app.delete('/api/persons/:id', (request, response, next) => {
    let id = request.params.id;

    Phonebook.findByIdAndRemove(id)
        .then(deletedNote => {
            console.log(deletedNote);
            if (deletedNote) {
                response.statusMessage = 'Entry deleted'
                response.status(202).end();
            }
            else {
                response.statusMessage = 'Resource not found'
                response.status(404).end()
            }
        })
    .catch(err => next(err))
})

// Post a Person
app.post('/api/persons', (request, response) => {
    let body = request.body;

    if (!body.name && !body.number) {
        response.statusMessage = "Content Missing";
        return response.status(400).json({status: 400, message: "Name and Number must be present"})
    } else if (!body.name) {
        response.statusMessage = "Content Missing";
        return response.status(400).json({status: 400, message: "Name must be present"})
    } else if (!body.number) {
        response.statusMessage = "Content Missing";
        return response.status(400).json({status: 400, message: "Number must be present"})
    }

    const entry = new Phonebook({
        name: body.name,
        number: body.number
    })

    entry.save().then(savedEntry => {
        response.status(200).json({status: 200, message: "New entry added", data: savedEntry})
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    let body = request.body;
    let id = request.params.id;
    const person = {
        name: body.name,
        number: body.number,
    }
    if (!body.number) {
        response.statusMessage = "Content Missing";
        return response.status(400).json({ status: 400, message: "Number must be present" })
    }
    Phonebook.findByIdAndUpdate(id, person, { new: true })
        .then(updatedRecord => {
            response.status(200).json({status: 200, message: "Record updated", data: updatedRecord})
        })
        .catch(err => next(err))
})

// Catching unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({status: 404, error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

// error handling
const errorHandler = (error, request, response, next) => {
    console.log(err.message);

    if (err.name === 'CastError') {
        response.status(400).send({ status: 400, error: 'malformatted ID' })
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || '3001';
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})