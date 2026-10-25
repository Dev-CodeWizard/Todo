
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

let todos = [];
let nextId = 1;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "todo.html"));
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const text = req.body.text;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Please enter a task." });
  }

  const newTodo = {
    id: nextId,
    text: text.trim(),
    completed: false
  };

  nextId = nextId + 1;
  todos.push(newTodo);

  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Task not found." });
  }

  if (typeof req.body.completed !== "boolean") {
    return res.status(400).json({ error: "completed must be true or false." });
  }

  todo.completed = req.body.completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = todos.length;

  todos = todos.filter((item) => item.id !== id);

  if (todos.length === oldLength) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log("Todo app is running at http://localhost:" + PORT);
});
