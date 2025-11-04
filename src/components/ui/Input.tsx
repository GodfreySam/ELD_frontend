import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	hint?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
	({ label, hint, className = "", id, ...props }, ref) => {
		const inputId =
			id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
		return (
			<div>
				{label && (
					<label
						htmlFor={inputId}
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						{label}
					</label>
				)}
				<input
					id={inputId}
					ref={ref}
					className={[
						"w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none",
						className,
					].join(" ")}
					{...props}
				/>
				{hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
			</div>
		);
	},
);

export default Input;
