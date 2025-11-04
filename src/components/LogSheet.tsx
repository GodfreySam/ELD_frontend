import { useMemo, useState } from "react";
import { Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import type { DutyLane, DutySegment } from "../types";

type Props = {
	width?: number;
	height?: number;
	dateLabel?: string;
	segments?: DutySegment[];
};

const laneToY = (lane: DutyLane, gridTop: number, rowHeight: number) => {
	const indexMap: Record<DutyLane, number> = {
		off: 0,
		sleeper: 1,
		driving: 2,
		onduty: 3,
	};
	return gridTop + indexMap[lane] * rowHeight;
};

const laneColors: Record<DutyLane, string> = {
	off: "#10b981", // green
	sleeper: "#3b82f6", // blue
	driving: "#f59e0b", // amber
	onduty: "#ef4444", // red
};

const laneLabels: Record<DutyLane, string> = {
	off: "Off Duty",
	sleeper: "Sleeper",
	driving: "Driving",
	onduty: "On Duty",
};

export default function LogSheet({
	width = 800,
	height = 300,
	dateLabel = "Sample Day",
	segments = [
		{ startHour: 0, endHour: 6, lane: "off" },
		{ startHour: 6, endHour: 12, lane: "driving" },
		{ startHour: 12, endHour: 13, lane: "onduty" },
		{ startHour: 13, endHour: 24, lane: "off" },
	],
}: Props) {
	const padding = 16;
	const rulerHeight = 30; // Space for ruler calibration above grid
	const gridTop = 60 + rulerHeight;
	const labelGutter = 56; // space for lane labels at left of each row
	const gridBottom = height - padding;
	const lanes = 4;
	const rowHeight = (gridBottom - gridTop) / lanes;
	const hours = 24;
	const gridLeft = padding + labelGutter;
	const gridRight = width - padding;
	const colWidth = (gridRight - gridLeft) / hours;
	const rulerY = gridTop - rulerHeight;

	const [hover, setHover] = useState<{
		label: string;
		x: number;
		y: number;
	} | null>(null);

	const gridLines = useMemo(() => {
		const lines: { points: number[] }[] = [];
		// horizontal lines
		for (let r = 0; r <= lanes; r++) {
			const y = gridTop + r * rowHeight;
			lines.push({ points: [gridLeft, y, gridRight, y] });
		}
		// vertical hour lines
		for (let h = 0; h <= hours; h++) {
			const x = gridLeft + h * colWidth;
			lines.push({ points: [x, gridTop, x, gridBottom] });
		}
		return lines;
	}, [
		gridLeft,
		gridRight,
		gridTop,
		gridBottom,
		lanes,
		rowHeight,
		hours,
		colWidth,
	]);

	return (
		<Stage width={width} height={height}>
			<Layer>
				<Text
					x={padding}
					y={padding}
					text={`ELD Log — ${dateLabel}`}
					fontSize={16}
					fontStyle="bold"
				/>
				{/* Lane labels at left of each row, vertically centered */}
				<Text x={padding} y={rulerY - 5} text="Hours" fontSize={12} />
				{(["off", "sleeper", "driving", "onduty"] as DutyLane[]).map(
					(lane, i) => {
						const laneCenterY = gridTop + i * rowHeight + rowHeight / 2;
						return (
							<Text
								key={lane}
								x={padding + 8}
								y={laneCenterY - 7}
								text={laneLabels[lane]}
								fontSize={12}
								fill="#475569"
							/>
						);
					},
				)}

				{/* Grid */}
				{gridLines.map((l, idx) => (
					<Line key={idx} points={l.points} stroke="#cbd5e1" strokeWidth={1} />
				))}
				{/* Emphasis at 8h and 12h */}
				{[8, 12].map((h) => (
					<Line
						key={`em-${h}`}
						points={[
							gridLeft + h * colWidth,
							gridTop,
							gridLeft + h * colWidth,
							gridBottom,
						]}
						stroke="#94a3b8"
						strokeWidth={1.5}
					/>
				))}

				{/* Ruler-style hour markers with ticks */}
				{/* Show all hours but adjust label spacing to prevent overlap */}
				{Array.from({ length: hours + 1 }).map((_, h) => {
					const x = gridLeft + h * colWidth;
					const showLabel = colWidth > 25 || h % 2 === 0 || h === 0 || h === 24; // Show label if enough space or every 2 hours
					const tickBottom = rulerY + rulerHeight;
					const tickTop = tickBottom - (showLabel ? 18 : 12);
					const labelY = rulerY + 2; // Moved up to sit above the tick lines

					return (
						<Group key={`hour-${h}`}>
							{/* Major tick mark (hour) */}
							<Line
								points={[x, tickTop, x, tickBottom]}
								stroke="#64748b"
								strokeWidth={2}
							/>
							{/* Hour label - only show if enough space */}
							{showLabel && (
								<Text
									x={x - 6}
									y={labelY}
									text={`${h}`}
									fontSize={10}
									fontWeight="bold"
									fill="#1e293b"
								/>
							)}
						</Group>
					);
				})}

				{/* Minor tick marks (30-minute intervals) - only if enough space */}
				{colWidth > 15 &&
					Array.from({ length: hours * 2 }).map((_, i) => {
						const halfHour = i * 0.5;
						if (halfHour % 1 === 0) return null; // Skip full hours
						const x = gridLeft + halfHour * colWidth;
						const tickBottom = rulerY + rulerHeight;
						return (
							<Line
								key={`half-${i}`}
								points={[x, tickBottom - 12, x, tickBottom - 6]}
								stroke="#94a3b8"
								strokeWidth={1}
							/>
						);
					})}

				{/* Quarter-hour tick marks (smaller) - only if enough space */}
				{colWidth > 8 &&
					Array.from({ length: hours * 4 }).map((_, i) => {
						const quarterHour = i * 0.25;
						if (quarterHour % 0.5 === 0) return null; // Skip half-hours and full hours
						const x = gridLeft + quarterHour * colWidth;
						const tickBottom = rulerY + rulerHeight;
						return (
							<Line
								key={`quarter-${i}`}
								points={[x, tickBottom - 10, x, tickBottom - 6]}
								stroke="#cbd5e1"
								strokeWidth={0.5}
							/>
						);
					})}

				{/* Segments with hover tooltip */}
				{segments.map((seg, i) => {
					const x = gridLeft + seg.startHour * colWidth;
					const w = Math.max(0, (seg.endHour - seg.startHour) * colWidth);
					const y = laneToY(seg.lane, gridTop, rowHeight) + 2;
					const h = rowHeight - 4;
					const label = `${laneLabels[seg.lane]} — ${seg.startHour}:00 to ${
						seg.endHour
					}:00`;
					return (
						<Group
							key={i}
							onMouseEnter={(e) => {
								const p = e.target.getStage()?.getPointerPosition();
								if (p) setHover({ label, x: p.x + 8, y: p.y + 8 });
							}}
							onMouseMove={(e) => {
								const p = e.target.getStage()?.getPointerPosition();
								if (p) setHover({ label, x: p.x + 8, y: p.y + 8 });
							}}
							onMouseLeave={() => setHover(null)}
						>
							<Rect
								x={x}
								y={y}
								width={w}
								height={h}
								fill={laneColors[seg.lane]}
								opacity={0.85}
								cornerRadius={4}
								shadowColor="rgba(0, 0, 0, 0.15)"
								shadowBlur={3}
								shadowOffsetX={1}
								shadowOffsetY={1}
							/>
						</Group>
					);
				})}

				{/* Legend */}
				<Group>
					{(["off", "sleeper", "driving", "onduty"] as DutyLane[]).map(
						(lane, i) => (
							<Group key={`legend-${lane}`}>
								<Rect
									x={gridLeft + i * 120}
									y={padding + 24}
									width={12}
									height={12}
									fill={laneColors[lane]}
									cornerRadius={2}
								/>
								<Text
									x={gridLeft + i * 120 + 18}
									y={padding + 22}
									text={laneLabels[lane]}
									fontSize={12}
									fill="#475569"
								/>
							</Group>
						),
					)}
				</Group>

				{/* Tooltip */}
				{hover && (
					<Group>
						<Rect
							x={hover.x}
							y={hover.y}
							width={Math.max(80, hover.label.length * 6)}
							height={22}
							fill="white"
							stroke="#cbd5e1"
							cornerRadius={6}
							shadowColor="rgba(0,0,0,0.15)"
							shadowBlur={4}
						/>
						<Text
							x={hover.x + 8}
							y={hover.y + 4}
							text={hover.label}
							fontSize={12}
						/>
					</Group>
				)}
			</Layer>
		</Stage>
	);
}
