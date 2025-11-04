export type DutyLane = "off" | "sleeper" | "driving" | "onduty";

export type DutySegment = {
	startHour: number;
	endHour: number;
	lane: DutyLane;
};

export type LogDay = {
	id: number;
	date: string;
	segments_json: DutySegment[];
};

export type TripFormData = {
	driver_name: string;
	current_location: string;
	pickup_location: string;
	dropoff_location: string;
	current_cycle_hours: number;
};

export type Trip = {
	id: number;
	driver_name: string;
	created_at: string;
	current_location: string;
	pickup_location: string;
	dropoff_location: string;
	current_cycle_hours: number;
	plan_json: RoutePlan;
	log_days?: LogDay[];
};

export type TripResponse = Trip;

export type RoutePlan = {
	route: {
		polyline: [number, number][];
		distanceMiles: number;
		durationHours: number;
		stops: Stop[];
	};
	logs: {
		date: string;
		segments: DutySegment[];
	}[];
};

export type Stop =
	| { type: "rest" | "break" | "dropoff" | "pickup"; hour: number }
	| { type: "fuel"; mile: number };
