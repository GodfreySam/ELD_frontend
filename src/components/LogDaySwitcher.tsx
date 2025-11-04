import type { LogDay } from "../types";

export default function LogDaySwitcher({
	logDays = [],
	selectedIndex,
	onChange,
}: {
	logDays?: LogDay[];
	selectedIndex: number;
	onChange: (index: number) => void;
}) {
	if (!logDays || logDays.length === 0) return null;
	return (
		<div className="mb-6 flex flex-wrap items-center gap-3">
			{logDays.map((d, idx) => (
				<button
					key={d.id ?? idx}
					onClick={() => onChange(idx)}
					className={
						"inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 " +
						(idx === selectedIndex
							? "border-blue-600 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:border-blue-700"
							: "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow")
					}
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					{new Date(d.date).toLocaleDateString()}
				</button>
			))}
		</div>
	);
}
