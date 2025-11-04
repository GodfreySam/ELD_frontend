import { useState } from "react";
import "./App.css";
import LogDaySwitcher from "./components/LogDaySwitcher";
import ResponsiveLogSheet from "./components/ResponsiveLogSheet";
import TripForm from "./components/TripForm";
import TripHistory from "./components/TripHistory";
import TripMap from "./components/TripMap";
import type { Trip, TripResponse } from "./types";

function App() {
	const [trip, setTrip] = useState<Trip | null>(null);
	const [dayIndex, setDayIndex] = useState(0);
	const onSelectTrip = (t: Trip | TripResponse) => {
		setTrip(t as Trip);
		setDayIndex(0);
	};
	return (
		<div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-100">
			<header className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
					<h1 className="text-lg sm:text-xl font-bold tracking-tight">
						🚛 ELD Trip Planner
					</h1>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
				<div className="grid gap-7 lg:grid-cols-[380px_minmax(0,1fr)]">
					<div className="space-y-6 lg:col-span-1">
						<section className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-lg">
							<div className="mb-5">
								<h2 className="mb-2 text-lg sm:text-xl font-bold text-slate-900">
									Create Trip
								</h2>
								<p className="text-sm text-slate-600">
									Enter locations and cycle hours, then submit.
								</p>
							</div>
							<TripForm onCreated={onSelectTrip} />
						</section>
						<TripHistory onSelect={onSelectTrip} />
					</div>
					<section className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-lg space-y-7">
						<div>
							<h2 className="mb-4 text-xl sm:text-2xl font-bold text-slate-900">
								Route
							</h2>
							<TripMap
								polyline={
									(trip?.plan_json?.route?.polyline as [number, number][]) || []
								}
								distanceMiles={trip?.plan_json?.route?.distanceMiles}
								durationHours={trip?.plan_json?.route?.durationHours}
								stops={trip?.plan_json?.route?.stops}
								height={320}
							/>
						</div>
						<h2 className="mb-4 text-xl sm:text-2xl font-bold text-slate-900">
							ELD Log Sheet
						</h2>
						{trip?.log_days && trip.log_days.length > 0 && (
							<LogDaySwitcher
								logDays={trip.log_days}
								selectedIndex={dayIndex}
								onChange={setDayIndex}
							/>
						)}
						<ResponsiveLogSheet
							segments={trip?.log_days?.[dayIndex]?.segments_json}
						/>
						{!trip && (
							<div className="mt-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">
								<svg
									className="mx-auto h-12 w-12 text-slate-400"
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
								<p className="mt-4 text-sm sm:text-base font-medium text-slate-600">
									Submit or select a trip to view logs
								</p>
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}

export default App;
