// The normal way to declare express and app
// const express = require('express')
// const app = express()

import http from "http";
import express from "express";

// Importing Mogan
import morgan from "morgan";
import cors from "cors";

const app = express();

// const corsOptions = {
//   origin: "http://localhost:5173", // Allow only this origin
//   methods: "GET, POST, PUT, DELETE",
//   allowedHeaders: "Content-Type",
// };
// app.use(cors(corsOptions));
app.use(cors());

/* This code only response with Hello World
const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});*/

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Philipoo",
    number: "08038142333",
  },
];

//Middleware is used like this:
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(express.json()); // Middleware to parse JSON
// Use morgan middleware with the 'tiny' configuration
app.use(morgan("tiny"));

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//Openning of Posting a file
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  //Checking Similarity in the name
  const findName = persons.find(function (person) {
    return person.name.toLowerCase() === String(body.name).toLowerCase();
  });

  if (Boolean(findName) === true) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  //Checking Simimalrity in the Number
  const findPhone = persons.find(function (person) {
    return person.number.toLowerCase() === String(body.number).toLowerCase();
  });

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});
//Closing of Posting a File

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.filter((person) => person.id !== id);
  if (person) {
    response.json(person);
  } else {
    response.status(204).end();
  }
});

// Adding a response for Info page
app.get("/info", (request, response) => {
  const phonebookcount = persons.length;
  const timeofRequest = new Date();

  response.send(
    `<br>Phonebook has info for ${phonebookcount} people </br>
      <p>${timeofRequest}</p>`
  );
});

app.use(express.static("dist"));

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
