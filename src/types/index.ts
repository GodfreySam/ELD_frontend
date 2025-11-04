export type DutyLane = "off" | "sleeper" | "driving" | "onduty";

export interface DutySegment {
	startHour: number;
	endHour: number;
	lane: DutyLane;
}

export interface LogDay {
	id: number;
	date: string;
	segments_json: DutySegment[];
}

export interface Trip {
	id: number;
	created_at: string;
	driver_name: string;
	current_location: string;
	pickup_location: string;
	dropoff_location: string;
	current_cycle_hours: number;
	plan_json?: unknown;
	log_days?: LogDay[];
}

export interface TripFormData {
	driver_name: string;
	current_location: string;
	pickup_location: string;
	dropoff_location: string;
	current_cycle_hours: number;
}

export interface TripResponse {
	id: number;
	plan_json?: unknown;
	log_days?: LogDay[];
}
