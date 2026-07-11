// app/projects/[id]/page.tsx
import ProjectDetail from "./ProjectDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  return <ProjectDetail projectId={Number(id)} />;
}
