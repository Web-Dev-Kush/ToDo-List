"use client";

import { useState, useEffect } from "react";

type Task = {
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

export default function Home() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index: number) => {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEditing = (index: number, text: string) => {
    setEditingIndex(index);
    setEditedText(text);
  };

  const saveEdit = (index: number) => {
    if (editedText.trim() === "") return;
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, text: editedText } : t
      )
    );
    setEditingIndex(null);
    setEditedText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedText("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h1>

        {/* Add Task */}
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

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {filteredTasks.map((t, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
            >
              <div className="flex items-center gap-2 flex-grow">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(index)}
                  className="w-4 h-4"
                />

                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(index)}
                    className="flex-grow border rounded p-1 text-sm"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(index, t.text)}
                    className={`cursor-pointer ${
                      t.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {t.text}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => saveEdit(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      💾
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✖
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(index, t.text)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <p className="text-gray-400 text-center mt-4">
            {filter === "completed"
              ? "No completed tasks."
              : filter === "active"
              ? "No active tasks."
              : "No tasks yet!"}
          </p>
        )}
      </div>
    </main>
  );
}
