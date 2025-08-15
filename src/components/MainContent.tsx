
import { useState } from "react";
import Header from "./Header";
import Formatter from "./MathFormatter/Formatter";
import MenuBar from "./MenuBar";


export default function MainContent() {
	const VERIFICATION_CODE = "2025";
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const [verificationNumber, setVerificationNumber] = useState<string>("");


	const handleVerify = () => {
		if (verificationNumber === VERIFICATION_CODE) {
			setIsAuthorized(true);
		}
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
				<>


				</>)}
		</div>
	);
}