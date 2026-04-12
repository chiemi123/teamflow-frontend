"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setProjects(data.data);
        } else {
          console.error("APIエラー:", data);
        }
      })
      .catch((err) => {
        console.error("通信エラー:", err);
      });
  }, []);

  return (
    <div>
      <h1>プロジェクト一覧</h1>
      <ul>
        {projects?.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
