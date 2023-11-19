import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getFiles = createAsyncThunk('files/', async (_, thunkAPI) => {
	try {
		const res = await fetch('/api/files/', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});

		const data = await res.json();

		if (res.status === 200) {
			return data;
		} else {
			return thunkAPI.rejectWithValue(data);
		}
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response.data);
	}
});

export const uploadFile = createAsyncThunk(
    'files/create', 
    async ({ name, s3_url }, thunkAPI) => {
    try {
        const body = JSON.stringify({
			name,
			s3_url,
		});
        const res = await fetch('/api/files/create/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await res.json();

        if (res.status === 200) {
            return data;
        } else {
            return thunkAPI.rejectWithValue(data);
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const transcribeFile = createAsyncThunk(
    'files/transcribe',
    async ({file, mimetype}, thunkAPI) => {

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('mimetype', mimetype);

            console.log('Body:', formData);
            console.log('File:', file);
            console.log('Mimetype:', mimetype);

            const res = await fetch('/api/files/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.status === 200) {
                return data;
            } else {
                return thunkAPI.rejectWithValue(data);
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    files: [],
    loading: false,
    error: null,
};

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(getFiles.pending, state=> {
            state.loading = true;
        })
        .addCase(getFiles.fulfilled, (state, action) => {
            state.loading = false;
            state.files = action.payload;
        })
        .addCase(getFiles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(uploadFile.pending, state => {
            state.loading = true;
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.loading = false;
            state.files.push(action.payload);
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(transcribeFile.pending, state => {
            state.loading = true;
        })
        .addCase(transcribeFile.fulfilled, (state, action) => {
            state.loading = false;
            state.files.push(action.payload);
        })
        .addCase(transcribeFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default filesSlice.reducer;