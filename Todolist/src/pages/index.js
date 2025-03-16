import { useState, useEffect, useRef } from "react";
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const detailsRef = useRef(null);

  const apiUrl = process.env.REACT_APP_API_URL || "https://todolist-z3c0.onrender.com"; // Fallback to deployed URL

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/todos`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [apiUrl]);

  const handleDelete = async (index) => {
    const taskToDelete = tasks[index];

    try {
      const response = await fetch(
        `${apiUrl}/todos/${taskToDelete._id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setTasks(tasks.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (index) => {
    const taskToEdit = tasks[index];
    setTitle(taskToEdit.title);
    setDetails(taskToEdit.description);
    setEditingIndex(index);
    detailsRef.current.innerHTML = taskToEdit.description;
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDetails = detailsRef.current.innerHTML;

    if (title && formattedDetails) {
      if (editingIndex !== null) {
        const taskToUpdate = tasks[editingIndex];

        const response = await fetch(
          `${apiUrl}/todos/${taskToUpdate._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description: formattedDetails }),
          }
        );

        if (response.ok) {
          const updatedTask = await response.json();
          const updatedTasks = [...tasks];
          updatedTasks[editingIndex] = updatedTask;
          setTasks(updatedTasks);
          setEditingIndex(null);
        }
      } else {
        const response = await fetch(`${apiUrl}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description: formattedDetails }),
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
        }
      }

      setTitle("");
      detailsRef.current.innerHTML = "";
      setShowForm(false);
    }
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const handleCreateNewTask = () => {
    setTitle("");
    setDetails("");
    if (detailsRef.current) {
      detailsRef.current.innerHTML = "";
    }
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleBackToTasks = () => {
    setShowForm(false);
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="main">
      {/* Navbar */}
      <nav className="navbar">
        <h2>TO DO</h2>
      </nav>

      <div className="container">
        {/* Tasks Section */}
        <div className={`tasks ${showForm ? "hidden" : ""}`}>
          <div className="tasks-header">
            <h2>Your Tasks</h2>
            <img 
              src="/filr.png" 
              alt="Tasks" 
              className="task-icon" 
              onClick={handleCreateNewTask}
              style={{ cursor: "pointer" }}
            />
          </div>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className="box">
                <h3>{task.title}</h3>
                <p>Created at: {formatDate(task.createdAt)}</p>
                
                <div className="link-container">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(index);
                    }}
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  >
                    Delete
                  </a>
                </div>
              </div>
            ))
          ) : (
            <h3>No tasks for now</h3>
          )}
        </div>

        {/* Form Section */}
        <div className={`form ${showForm ? "active" : ""}`}>
          <button className="back-to-tasks-button" onClick={handleBackToTasks}>
            Back to Tasks
          </button>
          <h2>{editingIndex !== null ? "Edit Task" : "Create Task"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="toolbar">
              <button type="button" onClick={() => applyFormat("bold")}>
                <Bold size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("italic")}>
                <Italic size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("underline")}>
                <Underline size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("insertUnorderedList")}>
                <List size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("justifyLeft")}>
                <AlignLeft size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("justifyCenter")}>
                <AlignCenter size={20} />
              </button>
              <button type="button" onClick={() => applyFormat("justifyRight")}>
                <AlignRight size={20} />
              </button>
            </div>

            <div
              ref={detailsRef}
              contentEditable
              className="editable-box"
              onInput={(e) => setDetails(e.currentTarget.innerHTML)}
              style={{ minHeight: "100px", border: "1px solid #ccc", padding: "10px" }}
            ></div>

            <input type="submit" value={editingIndex !== null ? "Update Task" : "Create Task"} />
          </form>
        </div>
      </div>
    </div>
  );
}
