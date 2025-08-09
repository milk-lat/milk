export type StaticPost = {
  slug: string;
  title: string;
  excerpt: string;
};

export const posts: StaticPost[] = [
  {
    slug: "hello-world",
    title: "你好，世界",
    excerpt: "欢迎来到牛奶的网站博客。这是一个静态示例条目。",
  },
  {
    slug: "ideas",
    title: "一些点子",
    excerpt: "收集一些有趣的功能与小游戏创意，持续更新。",
  },
];