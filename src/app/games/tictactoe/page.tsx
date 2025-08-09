"use client";

import { useMemo, useState } from "react";

type Player = "X" | "O";

export default function TicTacToeGamePage() {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("X");

  const winner = useMemo(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(Boolean)) return "draw" as const;
    return null;
  }, [board]);

  function play(i: number) {
    if (board[i] || winner) return;
    const copy = board.slice();
    copy[i] = turn;
    setBoard(copy);
    setTurn(turn === "X" ? "O" : "X");
  }
  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("X");
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">井字棋</h1>
        <p className="text-sm text-muted-foreground mt-1">在 3×3 棋盘上轮流落子，先连成一线者获胜。</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="rounded-xl border p-4 w-full max-w-[260px]">
          <div className="grid grid-cols-3 w-full">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => play(i)}
                className="h-16 border text-2xl font-bold hover:bg-black/[.04] dark:hover:bg-white/[.06]"
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            {winner === "draw" && <div className="text-sm">平局！</div>}
            {winner && winner !== "draw" && <div className="text-sm">胜者：{winner}</div>}
            {!winner && <div className="text-sm">轮到：{turn}</div>}
          </div>
          <button className="px-3 py-2 rounded border" onClick={reset}>重来</button>
        </div>
      </div>
    </div>
  );
}