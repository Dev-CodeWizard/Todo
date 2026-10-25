// 1. Import the tools we need.
const express = require("express");
const path = require("path");

// 2. Create the Express app.
const app = express();
const PORT = 3000;

// 3. Store todos in an array in server memory.
// The array resets when the server restarts.
let todos = [];
let nextId = 1;

// Read JSON sent by the browser.
app.use(express.json());

// Make files inside "public" available to the browser.
app.use(express.static(path.join(__dirname, "public")));

// Open the main page when someone visits http://localhost:3000/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "todo.html"));
});

// GET: send all todos to the browser.
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST: create a new todo.
app.post("/api/todos", (req, res) => {
  const text = req.body.text;

  // Do not accept empty text.
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

// PATCH: change whether a todo is completed.
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

// DELETE: remove a todo.
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = todos.length;

  todos = todos.filter((item) => item.id !== id);

  if (todos.length === oldLength) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.status(204).send();
});

// Start the server.
app.listen(PORT, () => {
  console.log("Todo app is running at http://localhost:" + PORT);
});
