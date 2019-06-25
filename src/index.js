require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 3000;
const projects = [];
let counterReq = 0;
const app = express();
const checkProjectExist = (req, res, next) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ erro: "Project does not exist" });
  }
  return next();
};
const countRequests = (req, res, next) => {
  console.time("request");
  counterReq++;
  next();
  console.timeEnd("request");
  console.log(`Requests done until then ${counterReq}`);
};

app.use(express.json());
app.use(countRequests);
app
  .get("/projects", (req, res) => {
    return res.json(projects);
  })
  .post("/projects", (req, res) => {
    const { id, title } = req.body;
    projects.push({ id, title, tasks: [] });
    return res.json(projects);
  })
  .put("/projects/:id", checkProjectExist, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    project.title = title;
    return res.json(projects);
  })
  .delete("/projects/:id", checkProjectExist, (req, res) => {
    const { id } = req.params;
    const index = projects.findIndex(p => p.id == id);
    projects.splice(index, 1);
    return res.json(projects);
  })
  .post("/projects/:id/tasks", checkProjectExist, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const project = projects.find(p => p.id == id);
    project.tasks.push(title);
    return res.json(projects);
  });

app.listen(port);
