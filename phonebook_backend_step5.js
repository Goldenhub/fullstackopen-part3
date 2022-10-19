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
    if (person) {
        response.send(person)
    } else {
        response.statusMessage = "Resource Not Found";
        response.status(404).json({status: 404, message: 'Resource Not Found'})
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

    let duplicateName = persons.find(e => e.name === body.name.trim());

    if (duplicateName) {
        response.statusMessage = "Duplicate Post";
        return response.status(400).json({status: 400, message: "Name must be unique"})
    }


    let id = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person);
    response.status(200).json({status: 200, message: "Person Added", data: person})

})




const PORT = '3001';
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})