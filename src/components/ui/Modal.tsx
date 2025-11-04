import type { PropsWithChildren } from "react";

export default function Modal({
	open,
	onClose,
	title,
	children,
}: PropsWithChildren<{ open: boolean; onClose: () => void; title?: string }>) {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "1rem",
				paddingLeft: "1.5rem",
				paddingRight: "1.5rem",
			}}
		>
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-hidden="true"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
			/>

			{/* Modal Content */}
			<div
				className="relative rounded-lg bg-white shadow-2xl flex flex-col"
				style={{
					position: "relative",
					zIndex: 10000,
					maxHeight: "90vh",
					height: "90vh",
					width: "100%",
					maxWidth: "1200px",
					margin: "auto",
					marginLeft: "1rem",
					marginRight: "1rem",
					backgroundColor: "white",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-t-lg">
					<h3 className="text-base font-semibold text-slate-900">{title}</h3>
					<button
						type="button"
						onClick={onClose}
						className="rounded p-1 text-slate-500 hover:bg-slate-100 transition-colors"
					>
						✕
					</button>
				</div>

				{/* Scrollable Content */}
				<div
					className="flex-1 overflow-y-auto overflow-x-hidden px-5 sm:px-6 py-5 sm:py-6"
					style={{ minHeight: 0 }}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
