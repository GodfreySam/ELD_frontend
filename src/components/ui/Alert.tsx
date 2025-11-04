import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	variant?: "success" | "error" | "info";
	centered?: boolean;
	className?: string;
	iconSizePx?: number;
}>;

const base =
	"inline-flex items-center gap-2 border px-3 py-2 text-xs rounded-none";
const variants: Record<string, string> = {
	success: "border-green-200 bg-green-50 text-green-700",
	error: "border-red-200 bg-red-50 text-red-700",
	info: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function Alert({
	variant = "info",
	centered = false,
	className = "",
	iconSizePx = 14,
	children,
}: Props) {
	return (
		<div
			className={[centered ? "w-full flex justify-center" : "", className].join(
				" ",
			)}
		>
			<div className={[base, variants[variant]].join(" ")}>
				<svg
					aria-hidden
					viewBox="0 0 20 20"
					fill={
						variant === "error"
							? "#dc2626"
							: variant === "success"
							? "#16a34a"
							: "#334155"
					}
					style={{ width: `${iconSizePx}px`, height: `${iconSizePx}px` }}
				>
					<path
						fillRule="evenodd"
						d={
							variant === "error"
								? "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						}
						clipRule="evenodd"
					/>
				</svg>
				<div>{children}</div>
			</div>
		</div>
	);
}
