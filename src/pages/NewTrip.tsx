import TripForm from "../components/TripForm";
import NavLink from "../components/ui/NavLink";

export default function NewTrip() {
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
			<main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
				<section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
					<div className="mb-6">
						<h2 className="mb-2 text-xl sm:text-2xl font-bold text-slate-900">
							Create New Trip
						</h2>
						<p className="text-sm sm:text-base text-slate-600">
							Enter driver information, locations, and current cycle hours to
							plan your trip.
						</p>
					</div>
					<TripForm onCreated={() => {}} />
				</section>
			</main>
		</div>
	);
}
