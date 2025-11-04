import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../lib/api";
import type { TripFormData, TripResponse } from "../types";
import LocationInput from "./LocationInput";
import Alert from "./ui/Alert";

export default function TripForm({
	onCreated,
}: {
	onCreated: (trip: TripResponse) => void;
}) {
	const [form, setForm] = useState<TripFormData>({
		driver_name: "",
		current_location: "",
		pickup_location: "",
		dropoff_location: "",
		current_cycle_hours: 10,
	});

	const mutation = useMutation({
		mutationFn: async () => {
			const res = await fetch(api("/api/v1/trips/"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("Failed to create trip");
			return (await res.json()) as TripResponse;
		},
		onSuccess: (data) => {
			// Reset form after successful submission
			setForm({
				driver_name: "",
				current_location: "",
				pickup_location: "",
				dropoff_location: "",
				current_cycle_hours: 10,
			});
			onCreated(data);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				mutation.mutate();
			}}
			className="space-y-7"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-7">
				<div className="sm:col-span-2">
					<label className="mt-4 mb-2 block text-sm font-semibold text-slate-900">
						Driver Name
					</label>
					<input
						className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[52px]"
						placeholder="Jane Doe"
						value={form.driver_name}
						onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
						required
					/>
				</div>
				<div>
					<label className="mt-4 mb-2 block text-sm font-semibold text-slate-900">
						Current Location
					</label>
					<LocationInput
						value={form.current_location}
						onChange={(value) => setForm({ ...form, current_location: value })}
						placeholder="Select current location"
						required
					/>
				</div>
				<div>
					<label className="mt-4 mb-2 block text-sm font-semibold text-slate-900">
						Pickup Location
					</label>
					<LocationInput
						value={form.pickup_location}
						onChange={(value) => setForm({ ...form, pickup_location: value })}
						placeholder="Select pickup location"
						required
					/>
				</div>
				<div className="sm:col-span-2">
					<label className="mt-4 mb-2 block text-sm font-semibold text-slate-900">
						Dropoff Location
					</label>
					<LocationInput
						value={form.dropoff_location}
						onChange={(value) => setForm({ ...form, dropoff_location: value })}
						placeholder="Select dropoff location"
						required
					/>
				</div>
				<div>
					<label className="mt-4 mb-2 block text-sm font-semibold text-slate-900">
						Current Cycle Hours
					</label>
					<input
						type="number"
						className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[52px]"
						placeholder="10"
						min={0}
						max={70}
						value={form.current_cycle_hours}
						onChange={(e) =>
							setForm({ ...form, current_cycle_hours: Number(e.target.value) })
						}
						required
					/>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-2">
				<button
					type="submit"
					disabled={mutation.isPending}
					className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
				>
					{mutation.isPending ? "Creating..." : "Create Trip"}
				</button>
				{mutation.isError && (
					<Alert variant="error" centered iconSizePx={14}>
						Error creating trip
					</Alert>
				)}
				{mutation.isSuccess && (
					<Alert variant="success" centered iconSizePx={18}>
						Trip created successfully!
					</Alert>
				)}
			</div>
		</form>
	);
}
