type ErrorStateProps = {
  message?: string;
};

export default function ErrorState({
  message = "エラーが発生しました"
}: ErrorStateProps) {
  return (
    <div className="text-center p-10 text-red-500">
      {message}
    </div>
  );
}