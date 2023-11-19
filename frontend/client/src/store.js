import { configureStore } from '@reduxjs/toolkit';
import userReducer from 'features/user';
import fileReducer from 'features/files';

export const store = configureStore({
	reducer: {
		user: userReducer,
		file: fileReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});
