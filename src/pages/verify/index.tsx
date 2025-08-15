"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { setVerified, setIntendedPath } from "../../store/verificationSlice";


export default function VerifyPage() {
	const VERIFICATION_CODE = "2025";
	const [verificationNumber, setVerificationNumber] = useState<string>("");
	const [error, setError] = useState("");

	const router = useRouter();
	const dispatch = useDispatch();
	const intendedPath = useSelector((state: RootState) => state.verification.intendedPath);

	/**
	 * Verifies the entered verification code against a predefined code.
	 * If the code matches, sets a flag in local storage indicating verification success
	 * and navigates to the "/maths" page. If the code does not match, sets an error message.
	 */

	const handleVerify = () => {
		// Example: actual code = "1234"
		if (verificationNumber === VERIFICATION_CODE) {
			dispatch(setVerified(true));
			const redirectPath = intendedPath || "/";
			dispatch(setIntendedPath(null));
			router.replace(redirectPath);
		} else {
			setError("Invalid verification code");
		}
	};

	return (
		<div className="sb-container">
			<div className="sb-layout-frame">
				<div className="sb-header-divider"></div>

				<div className="sb-main-content-page">
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
							{error && <p style={{ color: "red" }}>{error}</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
