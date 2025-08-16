type SelectSourceProps = {
	sourceData: string[];
	selectedSourceType: number;
	onChangeSourceType: (index: number) => void;
};

export default function SelectSource({ sourceData, selectedSourceType, onChangeSourceType }: SelectSourceProps) {

	return (
		<div className="sb-input-data-container">
			<div className="sb-input-wrapper">
				<div className="sb-input-data-title">Select type of  source data</div>
				<div className="sb-select-source-wrapper">
					{sourceData.map((source_text, index) => {
						const isActive = selectedSourceType === index;
						const class_name = isActive ? "sb-select-source-button active" : "sb-select-source-button";
						return (
							<button
								key={index}
								onClick={() => onChangeSourceType(index)}
								className={class_name}
							>
								{source_text}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}