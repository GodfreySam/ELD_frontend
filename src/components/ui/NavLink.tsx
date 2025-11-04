import type { LinkProps } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

type Props = LinkProps & { variant?: "primary" | "outline" };

export default function NavLink({
	variant = "outline",
	className = "",
	...props
}: Props) {
	const location = useLocation();
	const to = props.to as string | { pathname?: string };
	const targetPath = typeof to === "string" ? to : to?.pathname || "";
	const isActive =
		location.pathname === targetPath ||
		(targetPath &&
			targetPath !== "/" &&
			location.pathname.startsWith(targetPath));

	const base =
		"inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold leading-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99]";
	const primary =
		"bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-md";
	const outline =
		"border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm";

	const styles = isActive ? primary : variant === "primary" ? primary : outline;
	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			className={[base, styles, className].join(" ")}
			{...props}
		/>
	);
}
