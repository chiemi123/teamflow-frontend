// app/tasks/[id]/page.tsx
import TaskDetail from "./TaskDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;

  return <TaskDetail taskId={Number(id)} />;
}