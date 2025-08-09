"use client";

import { useMemo, useState } from "react";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]!));
}

// very naive markdown support: headings (#), bold (**), italics (*), code (`)
function simpleMarkdownToHtml(md: string) {
  let html = escapeHtml(md);
  html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
             .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
             .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
             .replace(/^### (.*)$/gm, '<h3>$1</h3>')
             .replace(/^## (.*)$/gm, '<h2>$1</h2>')
             .replace(/^# (.*)$/gm, '<h1>$1</h1>')
             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
             .replace(/\*(.*?)\*/g, '<em>$1</em>')
             .replace(/`([^`]+)`/g, '<code>$1</code>')
             .replace(/\n\n/g, '<br/><br/>');
  return html;
}

export default function MarkdownPage() {
  const [text, setText] = useState<string>("# 你好\n\n这是 **Markdown** 预览示例。");
  const html = useMemo(() => simpleMarkdownToHtml(text), [text]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Markdown</h3>
        <textarea className="w-full h-64" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">预览</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}