"use client";

import { useEffect, useState } from "react";

type Todo = { id: string; title: string; done: boolean };

export default function TodoPage() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("niunai_todos");
    if (raw) setTodos(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("niunai_todos", JSON.stringify(todos));
  }, [todos]);

  function add() {
    if (!text.trim()) return;
    setTodos([{ id: crypto.randomUUID(), title: text.trim(), done: false }, ...todos]);
    setText("");
  }
  function toggle(id: string) {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id: string) {
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <div className="max-w-md space-y-3">
      <h3 className="text-lg font-medium">本地待办</h3>
      <div className="flex gap-2">
        <input className="flex-1" placeholder="输入待办" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={add}>添加</button>
      </div>
      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t.id} className="flex items-center justify-between border rounded p-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.title}</span>
            </label>
            <button className="text-sm text-red-600" onClick={() => remove(t.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}