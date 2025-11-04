import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Trip } from "../types";

interface TripListResponse {
	results?: Trip[];
	length?: number;
}

export default function TripHistory({
	onSelect,
}: {
	onSelect: (trip: Trip) => void;
}) {
	const { data, isLoading, isError, refetch } = useQuery<
		TripListResponse | Trip[]
	>({
		queryKey: ["trips"],
		queryFn: async () => {
			const res = await fetch(api("/api/v1/trips/"));
			if (!res.ok) throw new Error("Failed to load trips");
			return res.json();
		},
	});

	const trips: Trip[] = Array.isArray(data) ? data : data?.results ?? [];

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-lg sm:text-xl font-bold text-slate-900">
					Trip History
				</h2>
				<button
					onClick={() => refetch()}
					className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
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
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Refresh
				</button>
			</div>
			{isLoading && (
				<div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-6 text-sm text-blue-700">
					<svg
						className="animate-spin h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					<span className="font-medium">Loading trips...</span>
				</div>
			)}
			{isError && (
				<div className="flex items-center gap-3 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
					<svg
						className="w-5 h-5 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
					Failed to load trip history
				</div>
			)}
			{!isLoading && trips.length === 0 && (
				<div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
					<svg
						className="mx-auto h-10 w-10 text-slate-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<p className="mt-3 text-sm font-medium text-slate-600">
						No trips yet. Create one to see it here.
					</p>
				</div>
			)}
			<ul className="divide-y divide-slate-200">
				{trips.map((t) => (
					<li key={t.id} className="py-3">
						<button
							onClick={() => onSelect(t)}
							className="group w-full rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-blue-50 hover:shadow-md active:scale-[0.99]"
						>
							<div className="flex items-center justify-between gap-3">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1.5">
										<svg
											className="w-4 h-4 flex-shrink-0 text-blue-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										<p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
											{t.pickup_location} → {t.dropoff_location}
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
										<span className="flex items-center gap-1">
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
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											{new Date(t.created_at).toLocaleDateString()}
										</span>
										<span className="flex items-center gap-1">
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
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
											{t.current_cycle_hours}h cycle
										</span>
									</div>
								</div>
								<svg
									className="w-5 h-5 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
