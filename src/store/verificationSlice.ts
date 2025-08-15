import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VerificationState {
	isVerified: boolean;
	intendedPath: string | null;
}

const initialState: VerificationState = {
	isVerified: false,
	intendedPath: null,
};

const verificationSlice = createSlice({
	name: "verification",
	initialState,
	reducers: {
		setVerified(state, action: PayloadAction<boolean>) {
			state.isVerified = action.payload;
		},
		setIntendedPath(state, action: PayloadAction<string | null>) {
			state.intendedPath = action.payload;
		},
	},
});

export const { setVerified, setIntendedPath } = verificationSlice.actions;
export default verificationSlice.reducer;
