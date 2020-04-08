const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const newRepository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex( r => r.id == id );

  if (repositoryIndex < 0) {
    return response.status(400).end();
  }

 const { likes } = repositories[repositoryIndex];

  const newRepository = { id, url, title, techs, likes };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex( r => r.id == id );

  if (repositoryIndex < 0) {
    return res.status(400).end();
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).end();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( r => r.id == id );

  if (repositoryIndex < 0) {
    return response.status(400).end();
  }

  const repo =  repositories[repositoryIndex];
  repo.likes++

  return response.json(repo);
});

module.exports = app;
