import { useState } from "react";
import LogDaySwitcher from "../components/LogDaySwitcher";
import LogsTable from "../components/LogsTable";
import ResponsiveLogSheet from "../components/ResponsiveLogSheet";
import TripMap from "../components/TripMap";
import Modal from "../components/ui/Modal";
import NavLink from "../components/ui/NavLink";
import type { Trip } from "../types";

export default function Logs() {
	const [trip, setTrip] = useState<Trip | null>(null);
	const [dayIndex, setDayIndex] = useState(0);

	return (
		<div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-100">
			<header className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-5">
					<h1 className="text-lg sm:text-xl font-bold tracking-tight">
						🚛 ELD Trip Planner
					</h1>
					<nav className="flex justify-evenly min-w-[220px] sm:min-w-[280px] font-medium">
						<NavLink to="/" className="hover:underline underline-offset-4">
							New Trip
						</NavLink>
						<NavLink to="/logs" className="hover:underline underline-offset-4">
							Logs
						</NavLink>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
				<div className="grid gap-6 lg:grid-cols-3">
					<div className="lg:col-span-3">
						<LogsTable
							onSelect={(t) => {
								setTrip(t);
								setDayIndex(0);
							}}
						/>
					</div>
				</div>
			</main>
			<Modal open={!!trip} onClose={() => setTrip(null)} title="Trip Logs">
				<div className="space-y-8">
					{trip && (
						<>
							{/* Driver Details */}
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6">
								<h3 className="mb-4 text-lg font-semibold text-slate-900">
									Driver Details
								</h3>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium text-slate-600">
											Driver Name:
										</span>
										<span className="ml-2 text-slate-900">
											{trip.driver_name || "—"}
										</span>
									</div>
									<div>
										<span className="font-medium text-slate-600">
											Current Cycle Hours:
										</span>
										<span className="ml-2 text-slate-900">
											{trip.current_cycle_hours}h
										</span>
									</div>
									<div>
										<span className="font-medium text-slate-600">
											Current Location:
										</span>
										<span className="ml-2 text-slate-900">
											{trip.current_location || "—"}
										</span>
									</div>
									<div>
										<span className="font-medium text-slate-600">Route:</span>
										<span className="ml-2 text-slate-900">
											{trip.pickup_location} → {trip.dropoff_location}
										</span>
									</div>
								</div>
							</div>

							{/* Route Map */}
							<div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
								<h3 className="mb-4 text-lg font-semibold text-slate-900">
									Route
								</h3>
								<TripMap
									polyline={
										(trip.plan_json?.route?.polyline as [number, number][]) ||
										[]
									}
									distanceMiles={trip.plan_json?.route?.distanceMiles}
									durationHours={trip.plan_json?.route?.durationHours}
									stops={trip.plan_json?.route?.stops}
									height={300}
								/>
							</div>
						</>
					)}
					<div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
						<h3 className="mb-4 text-lg font-semibold text-slate-900">
							ELD Log Sheet
						</h3>
						{trip?.log_days && trip.log_days.length > 0 && (
							<div className="mb-4">
								<LogDaySwitcher
									logDays={trip.log_days}
									selectedIndex={dayIndex}
									onChange={setDayIndex}
								/>
							</div>
						)}
						<ResponsiveLogSheet
							segments={trip?.log_days?.[dayIndex]?.segments_json}
						/>
					</div>
				</div>
			</Modal>
		</div>
	);
}
