const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

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

    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.textContent = todo.completed ? "Reopen" : "Complete";

    completeButton.addEventListener("click", function () {
      changeTaskStatus(todo.id, !todo.completed);
    });

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

loadTasks();
