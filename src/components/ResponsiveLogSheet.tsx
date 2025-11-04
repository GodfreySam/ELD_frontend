import { useEffect, useRef, useState } from "react";
import type { DutySegment } from "../types";
import LogSheet from "./LogSheet";

export default function ResponsiveLogSheet({
	segments,
}: {
	segments?: DutySegment[];
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState(900);

	useEffect(() => {
		if (!containerRef.current) return;
		const el = containerRef.current;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const w = Math.max(320, Math.floor(entry.contentRect.width));
				setWidth(w);
			}
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} className="w-full overflow-x-auto">
			<LogSheet
				width={width}
				height={Math.round(width <= 480 ? width * 0.6 : width * 0.4)}
				dateLabel="Today"
				segments={segments}
			/>
		</div>
	);
}
