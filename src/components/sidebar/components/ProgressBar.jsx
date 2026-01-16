export default function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="p-6 border-t border-slate-800">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-400">Progress</span>
        <span className="font-medium text-sky-400">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-sky-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
