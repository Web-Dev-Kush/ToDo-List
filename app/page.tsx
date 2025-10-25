"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Fetch tasks from MongoDB
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!task.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setTask("");
  };

  // ✅ Toggle completion state of a task
  const toggleComplete = async (id: string, currentState: boolean) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentState }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // Start editing a task
  const startEditing = (id: string, text: string) => {
    setEditId(id);
    setEditText(text);
  };

  // Save edited task
  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setEditId(null);
      setEditText("");
    }
  };

  // Filter tasks for the selected tab
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h1>

        {/* Add New Task */}
        <div className="flex mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter new task..."
            className="flex-grow border rounded-l-lg p-2 outline-none"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-around mb-4">
          {["all", "active", "completed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === t ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTasks.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
            >
              <div className="flex items-center gap-2 flex-grow">
                {/* ✅ Checkbox toggles completion */}
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(t._id, t.completed)}
                  className="cursor-pointer accent-blue-600"
                />

                {/* Editable / Static text */}
                {editId === t._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow border rounded p-1 outline-none"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-grow ${
                      t.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {t.text}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-2">
                {editId === t._id ? (
                  <button
                    onClick={() => saveEdit(t._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    💾
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(t._id, t.text)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✎
                  </button>
                )}
                <button
                  onClick={() => deleteTask(t._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <p className="text-gray-400 text-center mt-4">No tasks found!</p>
        )}
      </div>
    </main>
  );
}
