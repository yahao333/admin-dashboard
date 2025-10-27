"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  name: string;
  description: string;
  url: string;
};

const fallbackProjects: Project[] = [
  {
    name: "个人项目展示网站",
    description: "静态首页与项目展示",
    url: "https://yanghao0075.github.io/my_website/",
  },
  {
    name: "个人项目管理系统",
    description: "前端代码仓库",
    url: "https://github.com/yanghao0075/my_website",
  },
  {
    name: "后端 API",
    description: "Go + Gin 服务端",
    url: "https://github.com/yanghao0075/my_website_backend",
  },
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(
            data.map((p: any) => ({
              name: p.name ?? "未命名",
              description: p.description ?? "",
              url: p.url ?? "#",
            }))
          );
        }
      })
      .catch(() => {
        // 保持兜底数据
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-semibold">项目列表</h2>
      {loading && <p className="text-sm text-gray-400">正在加载远程项目…</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.name} name={p.name} description={p.description} url={p.url} />
        ))}
      </div>
    </section>
  );
}