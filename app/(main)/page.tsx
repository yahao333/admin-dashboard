"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";

type Project = { name: string; description?: string; url: string };

export default function HomePage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getProjects();
        if (mounted) setItems(data as Project[]);
      } catch (e: any) {
        if (mounted) setError(e?.message || "加载失败");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">我的项目</h2>
      {loading && <p className="text-sm text-gray-500">正在加载项目…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <ProjectCard key={p.url} name={p.name} description={p.description} url={p.url} />
        ))}
      </div>
    </section>
  );
}
