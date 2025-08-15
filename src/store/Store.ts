import { configureStore } from "@reduxjs/toolkit";
import verificationReducer from "./verificationSlice";

export const store = configureStore({
	reducer: {
		verification: verificationReducer,
	},
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
