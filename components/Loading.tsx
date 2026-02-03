export default function Loading() {
  return (
    <div className="p-20 space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse w-full h-24 rounded-md bg-gray-200"
        />
      ))}
    </div>
  );
}
