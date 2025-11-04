import { CITIES } from "../data/cities";

type Props = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	required?: boolean;
};

export default function LocationInput({
	value,
	onChange,
	placeholder = "Select location",
	required = false,
}: Props) {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			required={required}
			className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[52px] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23334155%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
		>
			<option value="" disabled>
				{placeholder}
			</option>
			{CITIES.map((city) => (
				<option key={city.name} value={city.name}>
					{city.name}
				</option>
			))}
		</select>
	);
}
