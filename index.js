require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

/*let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]
const people = persons.length*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const options = { year: 'numeric', 
  month: 'short',
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric', 
  second: 'numeric', 
  timeZoneName: 'long', 
  timeZone: 'Europe/Helsinki'  }
  const timeOfRequest = new Date().toLocaleString('en-US', options)
  response.send(`
    <p>Phonebook has info for ${people} people</p>
    <p>${timeOfRequest}</p>
    `)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()})
  .catch(error => next(error))
  })

  /*const generateId = () => {
    let id = Math.floor(Math.random() * 100).toString() 
    while (persons.find(person => person.id === id)) {
      id = Math.floor(Math.random() * 100).toString()
    }
    return `${id}`
}*/

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    if (!name || !number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }
    
    /* if (persons.find(person => person.name === name)) {
        return response.status(400).json({
            error: 'name is already in phonebook'
        })
    } */ 

      const person = new Person({
        //id: generateId(),
        name: name,
        number: number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})