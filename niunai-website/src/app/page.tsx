export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">欢迎来到「牛奶的网站」</h1>
      <p className="text-muted-foreground">这是一个纯静态展示站点，包含多个有趣的小功能与示例。</p>
      <ul className="list-disc pl-6">
        <li>功能实验室：计算器、待办、井字棋、秒表、Markdown 预览</li>
        <li>博客：静态文章列表</li>
      </ul>
    </div>
  );
}
