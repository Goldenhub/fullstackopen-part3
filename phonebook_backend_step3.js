const express = require('express');
const app = express();
// app.use(express.json());

const persons = [
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


app.get('/', (request, response) => {
    response.send('<h1>Welcome to the Persons DataBase</h1>');
})

app.get('/api/persons', (request, response) => {

  response.send(persons)
})

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    let id = request.params.id;
    let person = persons.find(e => e.id == id);
    if (person.name) {
        response.send(person)
    } else {
        response.statusMessage = "Resource Not Found";
        response.status('404').json({status: 404, message: 'Resource Not Found'})
    }
})

const PORT = '3001';
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})