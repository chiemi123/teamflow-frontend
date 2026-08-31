// app/projects/[id]/edit/page.tsx
import ProjectEditForm from "./ProjectEditForm";

type PageProps = {
  params: Promise<{ id: string }>; // Next.js 15+ では Promise になる場合あり
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // Promise を解決
  const projectId = resolvedParams.id;

  console.log("page.tsx projectId (server side):", projectId);

  return <ProjectEditForm projectId={projectId} />;
}
