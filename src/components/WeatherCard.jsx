export default function WeatherCard({ lable, icon, value, unit = "" }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all">
      <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {lable}
      </p>
      <p className="text-white font-semibold text-xl">
        {value ?? "--"}
        {value != null && (
          <span className="text-slate-400 text-sm ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}
