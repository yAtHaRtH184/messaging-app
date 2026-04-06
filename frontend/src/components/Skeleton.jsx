export default function Skeleton({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
          <div className="skeleton w-10 h-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-10 rounded-2xl" style={{ width: `${40 + Math.random() * 30}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
