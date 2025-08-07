// components/Formatter/SourceInput.tsx
type SourceInputProps = {
	sourceData: string;
	outputFileame: string;
	onChangeSourceData: (val: string) => void;
	onChangeFilename: (val: string) => void;
	onClear: () => void;
};

export default function SourceInput({
	sourceData,
	outputFileame,
	onChangeSourceData,
	onChangeFilename,
	onClear,
}: SourceInputProps) {
	return (
		<div className="sb-input-data-container">
			<div className="sb-input-wrapper">
				<div className="sb-clear-data-action-wrapper">
					<div className="sb-input-data-title">Enter Source Data</div>
					<button className="sb-button sb-clear-button" onClick={onClear}>
						Clear Source Data
					</button>
				</div>
				<textarea
					name="sourceData"
					className="sb-source-input-textarea"
					value={sourceData}
					onChange={(e) => onChangeSourceData(e.target.value)}
					placeholder="Paste your source text here..."
				/>
			</div>
			<div className="sb-input-wrapper">
				<div className="sb-input-data-title">Enter Output File Name</div>
				<input
					name="outputFileame"
					className="sb-input-text-field"
					type="text"
					value={outputFileame}
					onChange={(e) => onChangeFilename(e.target.value)}
					placeholder="Enter a name for the output file..."
				/>
			</div>
		</div>
	);
}
