// app/tasks/[id]/edit/page.tsx

import TaskEditForm from "./TaskEditForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const taskId = resolvedParams.id;

  return <TaskEditForm taskId={taskId} />;
}