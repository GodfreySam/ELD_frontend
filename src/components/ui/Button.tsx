import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost";
	size?: "sm" | "md";
};

const base =
	"inline-flex items-center justify-center gap-2 rounded-xl font-semibold leading-none shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.99]";
const variants: Record<string, string> = {
	primary: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md",
	secondary:
		"bg-white text-slate-900 border border-slate-300 hover:border-slate-400 hover:shadow-sm",
	ghost: "text-slate-700 hover:bg-slate-100",
};
const sizes: Record<string, string> = {
	sm: "h-9 px-3 text-sm",
	md: "h-10 px-4 text-sm",
};

export default function Button({
	variant = "primary",
	size = "md",
	className = "",
	...props
}: Props) {
	return (
		<button
			className={[base, variants[variant], sizes[size], className].join(" ")}
			{...props}
		/>
	);
}
