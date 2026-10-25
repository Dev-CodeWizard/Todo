// Find the HTML elements that JavaScript needs to use.
const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

// This function asks the server for all tasks.
async function loadTasks() {
  try {
    const response = await fetch("/api/todos");
    const todos = await response.json();

    showTasks(todos);
    message.textContent = "";
  } catch (error) {
    message.textContent = "Could not load tasks. Is the server running?";
  }
}

// This function puts tasks on the page.
function showTasks(todos) {
  taskList.innerHTML = "";

  let completedNumber = 0;

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    if (todo.completed) {
      completedNumber = completedNumber + 1;
    }

    const listItem = document.createElement("li");
    listItem.className = "task-item";

    if (todo.completed) {
      listItem.classList.add("completed");
    }

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = todo.text;

    // Complete button
    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.textContent = todo.completed ? "Reopen" : "Complete";

    completeButton.addEventListener("click", function () {
      changeTaskStatus(todo.id, !todo.completed);
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteTask(todo.id);
    });

    listItem.appendChild(taskText);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  }

  taskCount.textContent =
    todos.length + " total · " + completedNumber + " completed";

  emptyMessage.style.display = todos.length === 0 ? "block" : "none";
}

// When the form is submitted, send the new task to the server.
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const taskText = input.value.trim();

  if (taskText === "") {
    message.textContent = "Please type a task first.";
    return;
  }

  try {
    message.textContent = "Adding task...";

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: taskText })
    });

    const result = await response.json();

    if (!response.ok) {
      message.textContent = result.error;
      return;
    }

    input.value = "";
    message.textContent = "Task added!";
    loadTasks();
  } catch (error) {
    message.textContent = "Could not add task. Please try again.";
  }
});

// Tell the server to mark a task complete or incomplete.
async function changeTaskStatus(id, completed) {
  try {
    const response = await fetch("/api/todos/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ completed: completed })
    });

    if (!response.ok) {
      message.textContent = "Could not update task.";
      return;
    }

    message.textContent = "Task updated!";
    loadTasks();
  } catch (error) {
    message.textContent = "Could not update task. Please try again.";
  }
}

// Tell the server to delete a task.
async function deleteTask(id) {
  try {
    const response = await fetch("/api/todos/" + id, {
      method: "DELETE"
    });

    if (!response.ok) {
      message.textContent = "Could not delete task.";
      return;
    }

    message.textContent = "Task deleted!";
    loadTasks();
  } catch (error) {
    message.textContent = "Could not delete task. Please try again.";
  }
}

// Load saved-in-memory tasks when the page opens.
loadTasks();
