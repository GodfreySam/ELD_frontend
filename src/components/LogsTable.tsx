import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { Trip } from "../types";

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function LogsTable({
	onSelect,
}: {
	onSelect: (t: Trip) => void;
}) {
	const { data, isLoading, isError, refetch } = useQuery<
		{ results?: Trip[] } | Trip[]
	>({
		queryKey: ["trips"],
		queryFn: async () => {
			const res = await fetch(api("/api/v1/trips/"));
			if (!res.ok) throw new Error("Failed to load trips");
			return res.json();
		},
	});

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);

	const filtered = useMemo(() => {
		const trips: Trip[] = Array.isArray(data) ? data : data?.results ?? [];
		const q = debouncedQuery.trim().toLowerCase();
		if (!q) return trips;
		return trips.filter((t) => {
			const searchFields = [
				t.driver_name || "",
				t.pickup_location || "",
				t.dropoff_location || "",
			];
			return searchFields.some((field) => field.toLowerCase().includes(q));
		});
	}, [data, debouncedQuery]);

	return (
		<div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-lg">
			<div className="mb-6 flex items-center justify-between gap-4 px-1 py-2">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search driver or location"
					className="w-full md:max-w-xs rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
					style={{ minHeight: "44px" }}
				/>
				<button
					onClick={() => refetch()}
					className="inline-flex items-center gap-2 justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
					style={{ minHeight: "44px" }}
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Refresh
				</button>
			</div>
			{isLoading && <p className="text-sm text-slate-500">Loading…</p>}
			{isError && <p className="text-sm text-red-600">Failed to load logs</p>}
			{!isLoading && !isError && filtered.length === 0 && (
				<p className="text-sm text-slate-500">
					{debouncedQuery.trim()
						? "No trips match your search."
						: "No trips found."}
				</p>
			)}
			{filtered.length > 0 && (
				<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
					<table className="min-w-full divide-y divide-slate-200 text-left text-sm">
						<thead className="bg-gradient-to-r from-slate-50 to-slate-100">
							<tr>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
									Driver
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
									Route
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
									Cycle
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
									Created
								</th>
								<th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 bg-white">
							{filtered.map((t) => (
								<tr
									key={t.id}
									className="transition-all duration-150 hover:bg-blue-50 hover:shadow-sm"
								>
									<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
										{t.driver_name || "—"}
									</td>
									<td className="px-4 py-3 text-slate-700">
										<span className="font-medium text-slate-900">
											{t.pickup_location}
										</span>
										{" → "}
										<span className="font-medium text-slate-900">
											{t.dropoff_location}
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-600">
										<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
											{t.current_cycle_hours}h
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-600">
										{new Date(t.created_at).toLocaleString()}
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-right">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onSelect(t);
											}}
											className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
										>
											<svg
												className="w-3.5 h-3.5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
											View
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
