"use client";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  created_at: string;
  updated_at?: string;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = "http://localhost:8000/tasks";

  const loadTasks = async () => {
    const res = await fetch(API_URL);
    const data: Task[] = await res.json();

    const sorted = data.sort((a, b) => {
      if (a.is_done === b.is_done) return a.id - b.id;
      return a.is_done ? 1 : -1;
    });

    setTasks(sorted);
  };


  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, is_done: false }),
    });
    setTitle("");
    setDescription("");
    await loadTasks();
  };

  const toggleTask = async (task: Task) => {
    await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        is_done: !task.is_done,
      }),
    });
    await loadTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await loadTasks();
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>📝 ToDo List</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł zadania"
          style={{ padding: "0.5rem", width: "40%", marginRight: "0.5rem" }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opis (opcjonalny)"
          style={{ padding: "0.5rem", width: "40%", marginRight: "0.5rem" }}
        />
        <button onClick={addTask}>Dodaj</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              marginBottom: "0.75rem",
              background: "#f2f2f2",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() => toggleTask(task)}
                style={{ marginRight: "0.5rem" }}
              />
                <div style={{ flex: 1 }}>
                  <strong
                    style={{
                      color: task.is_done ? "#444" : "#111",
                      textDecoration: task.is_done ? "line-through" : "none",
                      fontWeight: task.is_done ? 500 : 700,
                      opacity: task.is_done ? 0.85 : 1,
                    }}
                  >
                    #{task.id} {task.title}
                  </strong>

                  {task.description && (
                    <div
                      style={{
                        color: task.is_done ? "#666" : "#333",
                        fontSize: "0.9em",
                        fontStyle: task.is_done ? "italic" : "normal",
                      }}
                    >
                      {task.description}
                    </div>
                  )}

                  <div style={{ fontSize: "0.8em", color: "#888" }}>
                    <span>
                      🕒 Utworzono: {new Date(task.created_at).toLocaleString()}
                    </span>
                    {task.updated_at && (
                      <span>
                        {" "}
                        | ✏️ Zmieniono: {new Date(task.updated_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "#ff5555",
                  border: "none",
                  color: "#fff",
                  borderRadius: "5px",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  marginLeft: "0.5rem",
                }}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
