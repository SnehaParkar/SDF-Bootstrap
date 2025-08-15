export default function Header({ title }: { title: string }) {
	return (
		<header className="sb-header-container">
			<div className="sb-header">
				<span className="sb-header-text">{title}</span>
			</div>
			{/* <div className="sb-header-menu-container">
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Home</span>
				</div>
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Skills</span>
				</div>
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Experience</span>
				</div>
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Projects</span>
				</div>
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Education</span>
				</div>
				<div className="sb-header-menu">
					<span className="sb-header-menu-title">Contact</span>
				</div>
			</div> */}
		</header>
	);
}