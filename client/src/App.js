import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleAddTask = async () => {
    if (!taskText.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/tasks", { text: taskText });
      setTaskText("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Confirm delete → open modal
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks(); // Refresh the list
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

  // Toggle complete
  const handleToggleComplete = async (id, completed) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      completed: !completed,
    });
    fetchTasks();
  };

  // Inline edit
  const handleEdit = async (id, newText) => {
    if (!newText.trim()) return;
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { text: newText });
    fetchTasks();
  };

  // Filter and sort
  const filteredTasks = tasks
    .filter((t) => t.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.text.localeCompare(b.text) : 0));

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="hole-container">
      {/* LEFT SIDE */}
      <div className="left-container">
        <fieldset className="container">
          <legend>To-Do List</legend>

          <div className="input-area">
            <input
              type="text"
              id="task-input"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task..."
            />
            <button id="add-task-btn" onClick={handleAddTask}>
              <img src="./add-task.png" alt="Add_Task" />
            </button>
          </div>

          <div className="controls">
            <input
              type="text"
              id="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
            />
            <button id="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
              <img src="./filter.png" alt="Sort A-Z" />
            </button>
          </div>
        </fieldset>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-container">
        <div className="task-container">
          <div className="btn-container">
            <div className="total-tasks">Total: {total}</div>
            <div className="completed-tasks">Completed: {completed}</div>
            <div className="pending-tasks">Pending: {pending}</div>
          </div>

          <ul id="task-list">
            {filteredTasks.length === 0 ? (
              <li style={{ textAlign: "center", color: "#777" }}>
                No tasks found.
              </li>
            ) : (
              filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <span
                    className="task-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleEdit(task._id, e.target.textContent)
                    }
                  >
                    {task.text}
                  </span>

                  <div className="task-actions">
                    <button className="complete-btn" onClick={() => handleToggleComplete(task._id, task.completed)}>✓</button>
                    <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
