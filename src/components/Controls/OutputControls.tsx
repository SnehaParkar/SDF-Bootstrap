// components/Formatter/OutputControls.tsx
type OutputControlsProps = {
	onCopy: () => void;
	onDownload: () => void;
};

export default function OutputControls({ onCopy, onDownload }: OutputControlsProps) {
	return (

		<div className="sb-output-action-wrapper">
			<div className="sb-output-data-title">Final Output Json</div>
			<button className="sb-button sb-copy-button" onClick={onCopy}>
				Copy
			</button>
			<button className="sb-button sb-download-button" onClick={onDownload}>
				Download Json
			</button>
		</div>

	);
}
