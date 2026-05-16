type ProjectCardProps = {
  name: string;
  description?: string;
};

export default function ProjectCard({ name, description }: ProjectCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-bold">{name}</h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
