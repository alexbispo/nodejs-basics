const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function setRepoIndex(req, res, next) {
  const { id } = req.params;
  const repoIndex = repositories.findIndex( r => r.id == id );

  if (repoIndex < 0) {
    return res.status(400).end();
  }

  res.locals.repoIndex = repoIndex;

  return next();
}

app.use("/repositories/:id", setRepoIndex);

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

  const repoIndex = response.locals.repoIndex;

  const { likes } = repositories[repoIndex];

  const newRepository = { id, url, title, techs, likes };

  repositories[repoIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = res.locals.repoIndex;

  repositories.splice(repoIndex, 1);

  return res.status(204).end();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = response.locals.repoIndex;

  const repo =  repositories[repoIndex];
  repo.likes++

  return response.json(repo);
});

module.exports = app;
