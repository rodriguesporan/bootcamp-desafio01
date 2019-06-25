require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 3000;
const projects = [];
let counterReq = 0;
const app = express();
const checkProjectExist = (req, res, next) => {
  const { id } = req.params;
  if (!projects[id]) {
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
    projects[id] = { id, title, tasks: [] };
    return res.json(projects);
  })
  .put("/projects/:id", checkProjectExist, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    projects[id].title = title;
  })
  .delete("/projects/:id", checkProjectExist, (req, res) => {
    const { id } = req.params;
    projects.splice(id, 1);
  })
  .post("/projects/:id/tasks", checkProjectExist, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    const { tasks } = projects[id];
    projects[id].tasks = [...tasks, title];
    return res.json(projects);
  });

app.listen(port);
