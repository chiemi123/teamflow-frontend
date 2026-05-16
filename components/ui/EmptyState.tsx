type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({
  message = "データがありません"
}: EmptyStateProps) {
  return (
    <div className="text-center p-10">
      {message}
    </div>
  );
}