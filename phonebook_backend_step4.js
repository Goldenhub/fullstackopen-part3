const express = require('express');
const app = express();
app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Homepage
app.get('/', (request, response) => {
    response.send('<h1>Welcome to the Persons DataBase</h1>');
})

// Get all Persons
app.get('/api/persons', (request, response) => {

  response.send(persons)
})

// Get Info
app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
})

// Get a Person
app.get('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id);
    let person = persons.find(e => e.id === id);
    if (person.name) {
        response.send(person)
    } else {
        response.statusMessage = "Resource Not Found";
        response.status('404').json({status: 404, message: 'Resource Not Found'})
    }
})

// Delete a Person
app.delete('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id);
    const person = persons.find(e => e.id === id);
    if (person) {
        persons = persons.filter(e => e.id !== id);
        response.status(202).json({ status: 204, message: "Resource Deleted Successfully" });
    } else {
        response.statusMessage = "Resource Not Found";
        response.status(404).json({status: 404, message: "Resource does not exist"})
    }
})




const PORT = '3001';
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})