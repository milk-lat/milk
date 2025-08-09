import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">欢迎来到「牛奶的网站」</h1>
      <p className="text-muted-foreground">集博客、待办、搜索与登录于一体的综合型站点。</p>
      <ul className="list-disc pl-6">
        <li>注册/登录：管理你的账号与数据</li>
        <li>博客：发表与浏览文章</li>
        <li>待办：记录与完成每日计划</li>
        <li>搜索：快速查找文章</li>
      </ul>
    </div>
  );
}
