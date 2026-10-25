# Beginner Todo App — Week 2 Assignment

This is a simple beginner-friendly todo app using HTML, CSS, browser JavaScript, Node.js and Express.

## Run the project

1. Install Node.js if it is not already installed.
2. Open this project folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:

   ```bash
   npm install
   npm start
   ```

5. Open http://localhost:3000 in your browser.

## Files

- `server.js`: Express server and API routes.
- `public/todo.html`: Page structure.
- `public/todo.css`: Basic design and mobile layout.
- `public/todo.js`: Frontend JavaScript and Fetch requests.
- `package.json`: Project information, dependency and start command.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/todos` | Get all tasks |
| POST | `/api/todos` | Add a task using `{"text":"My task"}` |
| PATCH | `/api/todos/:id` | Update completion using `{"completed":true}` |
| DELETE | `/api/todos/:id` | Delete a task |

Each task has an `id`, `text`, and `completed` value.

## Storage limitation

Tasks are kept in a JavaScript array in the server's memory. Refreshing the browser does not clear the tasks while the server is still running. Restarting the server clears all tasks. This is required for this assignment.

## Before submitting

- Run `npm install`, then `npm start`.
- Test adding, completing, reopening and deleting tasks.
- Test that blank tasks are rejected.
- Capture desktop and mobile screenshots.
- Do not include `node_modules` in the submission.
