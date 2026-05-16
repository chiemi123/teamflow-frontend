type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "読み込み中..."
}: LoadingProps) {
  return (
    <div className="text-center p-10">
      {message}
    </div>
  );
}