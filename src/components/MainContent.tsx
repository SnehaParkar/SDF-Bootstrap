
import { useState } from "react";
import { transformSourceData } from "@/utils/transformer";
import { FlowTemplate } from "@/types/flowTypes";
const tenantId = 441194;

const output = {};
const outputJson = JSON.stringify({ output });
export default function MainContent() {
	const VERIFICATION_CODE = "2025";
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [verificationNumber, setVerificationNumber] = useState<string>("");
	const [sourceData, setSourceData] = useState<string>("");
	const [outputFileame, setOutputFilename] = useState<string>("test");
	const [jsonOutput, setJsonOutput] = useState<FlowTemplate | null>(null);


	const handleVerify = () => {
		if (verificationNumber === VERIFICATION_CODE) {
			setIsAuthorized(true);
		}
	};

	const handleClearSourceData = () => {
		setSourceData("");
		setJsonOutput(null);
		setOutputFilename("Test");
	};

	const handleTransform = () => {
		const transformed = transformSourceData(sourceData, outputFileame);
		setJsonOutput(transformed);
	};

	const handleDownload = () => {
		const json = JSON.stringify(jsonOutput, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${outputFileame}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
	};

	return (
		<div className="sb-main-content-page">
			{!isAuthorized && (
				<div className="sb-main-content-section">
					<div className="sb-verification-data-container">
						<div className="sb-input-wrapper">
							<div className="sb-input-data-title">Enter Verification code</div>
							<input name="outputFileame" className="sb-input-text-field"
								type="text"
								value={verificationNumber}
								onChange={(e) => setVerificationNumber(e.target.value)}
								placeholder="Enter a Verification Code..." />

						</div>
						<button
							className="sb-button sb-transform-button"
							onClick={handleVerify}>
							Verify
						</button>
					</div>
				</div>)}
			{isAuthorized && (
				<div className="sb-main-content-section">
					<div className="sb-input-data-container">
						<div className="sb-input-wrapper">
							<div className="sb-clear-data-action-wrapper">
								<div className="sb-input-data-title">Enter Source Data</div>
								<button
									className="sb-button sb-clear-button"
									onClick={handleClearSourceData}>
									Clear Source Data
								</button>
							</div>
							<textarea name="sourceData" className="sb-source-input-textarea"
								value={sourceData}
								onChange={(e) => setSourceData(e.target.value)}
								placeholder="Paste your source text here..."
							/>
						</div>
						<div className="sb-input-wrapper">
							<div className="sb-input-data-title">Enter Name For Output File</div>
							<input name="outputFileame" className="sb-input-text-field"
								type="text"
								value={outputFileame}
								onChange={(e) => setOutputFilename(e.target.value)}
								placeholder="Enter a name for the output file..." />

						</div>
					</div>
					<button
						className="sb-button sb-transform-button"
						onClick={handleTransform}>
						Transform Data
					</button>

					{jsonOutput && (
						<div className="sb-output-data-container">
							<div className="sb-output-action-wrapper">
								<div className="sb-output-data-title">Output Json</div>
								<button
									className="sb-button sb-copy-button"
									onClick={handleCopy}>
									Copy
								</button>
								<button
									className="sb-button sb-download-button"
									onClick={handleDownload}>
									Download Json
								</button>
							</div>

							<div className="sb-output-data-content">
								<pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
							</div>

						</div>)}
				</div>)}
		</div>
	);
}