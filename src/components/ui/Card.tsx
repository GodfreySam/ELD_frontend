import type { PropsWithChildren } from "react";

export function Card({
	children,
	className = "",
}: PropsWithChildren<{ className?: string }>) {
	return (
		<section
			className={[
				"rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-lg",
				className,
			].join(" ")}
		>
			{children}
		</section>
	);
}

export function CardHeader({
	title,
	subtitle,
}: {
	title: string;
	subtitle?: string;
}) {
	return (
		<div className="mb-5">
			<h2 className="text-xl font-bold text-slate-900">{title}</h2>
			{subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
		</div>
	);
}
