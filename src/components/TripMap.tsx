import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
} from "react-leaflet";
import type { Stop } from "../types";

type Props = {
	polyline?: [number, number][];
	distanceMiles?: number;
	durationHours?: number;
	stops?: Stop[];
	height?: number;
};

const defaultCenter: [number, number] = [39.5, -98.35]; // US center-ish

// Fix default marker icon path in Vite
const DefaultIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function TripMap({
	polyline = [],
	distanceMiles,
	durationHours,
	stops = [],
	height = 300,
}: Props) {
	const hasLine = polyline && polyline.length >= 2;
	const center = hasLine
		? [
				(polyline[0][0] + polyline[polyline.length - 1][0]) / 2,
				(polyline[0][1] + polyline[polyline.length - 1][1]) / 2,
		  ]
		: defaultCenter;

	// Type narrowing wrappers for JSX to avoid react-leaflet typing friction
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const AnyMap = MapContainer as unknown as React.ComponentType<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const AnyTile = TileLayer as unknown as React.ComponentType<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const AnyPolyline = Polyline as unknown as React.ComponentType<any>;

	const interpolate = (t: number): [number, number] => {
		if (!hasLine) return defaultCenter;
		const a = polyline[0];
		const b = polyline[polyline.length - 1];
		const clamped = Math.max(0, Math.min(1, t));
		const lat = a[0] + (b[0] - a[0]) * clamped;
		const lng = a[1] + (b[1] - a[1]) * clamped;
		return [lat, lng];
	};

	return (
		<div className="space-y-3">
			<div className="text-sm text-slate-700">
				{typeof distanceMiles === "number" && (
					<span className="mr-4">
						Distance: <strong>{distanceMiles.toFixed(1)}</strong> mi
					</span>
				)}
				{typeof durationHours === "number" && (
					<span>
						Duration: <strong>{durationHours.toFixed(1)}</strong> h
					</span>
				)}
			</div>
			<div className="w-full rounded-lg overflow-hidden border border-slate-200">
				<AnyMap
					center={center as [number, number]}
					zoom={hasLine ? 5 : 4}
					style={{ height: `${height}px`, width: "100%" }}
					scrollWheelZoom={false}
				>
					<AnyTile
						attribution={
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						}
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{hasLine && (
						<>
							<Marker position={polyline[0]}>
								<Popup>Pickup</Popup>
							</Marker>
							<Marker position={polyline[polyline.length - 1]}>
								<Popup>Dropoff</Popup>
							</Marker>
							<AnyPolyline
								positions={polyline}
								color="#2563eb"
								weight={4}
								opacity={0.9}
							/>
							{stops.map((s, idx) => {
								let t = 0.5;
								if (
									"hour" in s &&
									typeof durationHours === "number" &&
									durationHours > 0
								) {
									t = s.hour / durationHours;
								}
								if (
									"mile" in s &&
									typeof distanceMiles === "number" &&
									distanceMiles > 0
								) {
									t = s.mile / distanceMiles;
								}
								const pos = interpolate(t);
								return (
									<Marker key={idx} position={pos}>
										<Popup>
											{"type" in s ? s.type.toUpperCase() : "Stop"}
											{"hour" in s ? ` @ ${s.hour}h` : ""}
											{"mile" in s ? ` @ ${s.mile}mi` : ""}
										</Popup>
									</Marker>
								);
							})}
						</>
					)}
				</AnyMap>
			</div>
		</div>
	);
}
