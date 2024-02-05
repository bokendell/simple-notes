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

export const getPresignedURL = createAsyncThunk('files/presigned-url', async (id, thunkAPI) => {
    try {
        const res = await fetch(`/api/files/presigned-url/${id}`, {
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
    async ({ formData }, thunkAPI) => {
        try {
            const response = await fetch('/api/files/create/', { // Adjust the endpoint as necessary
                method: 'POST',
                body: formData, // Directly pass the FormData object
                headers: {
                    Accept: 'application/json',
                },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data);
            }
    
            return data; // Assuming this is the file info from the server
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Could not upload file');
        }
    });
//     async ({ name, s3_url }, thunkAPI) => {
//     try {
//         const body = JSON.stringify({
// 			name,
// 			s3_url,
// 		});
//         const res = await fetch('/api/files/create/', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body,
//         });

//         const data = await res.json();

//         if (res.status === 200) {
//             return data;
//         } else {
//             return thunkAPI.rejectWithValue(data);
//         }
//     } catch (err) {
//         return thunkAPI.rejectWithValue(err.response.data);
//     }
// });

export const deleteFile = createAsyncThunk('files/delete', async (id, thunkAPI) => {
    try {
        const res = await fetch(`/api/files/delete/${id}`, {
            method: 'DELETE',
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

export const transcribeFile = createAsyncThunk('files/transcribe', async (formData, thunkAPI) => {
    try {
      const res = await fetch('/api/files/transcribe', {
        method: 'POST',
        body: formData, // formData directly as body
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

export const summarizeFile = createAsyncThunk('files/summarize', async ({ transcription, intro }, thunkAPI) => {
    try {
        const body = JSON.stringify({
			transcription,
			intro,
		});

        // console.log("summary body", body);
        const res = await fetch('/api/files/summarize', {
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

const initialState = {
    files: [],
    loading: false,
    error: null,
    transcribed: null,
    summarized: null,
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
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(getPresignedURL.pending, state => {
            // state.loading = true;
        })
        .addCase(getPresignedURL.fulfilled, (state, action) => {
            // state.loading = false;
        })
        .addCase(getPresignedURL.rejected, (state, action) => {
            // state.loading = false;
            state.error = action.error.message;
        })
        .addCase(transcribeFile.pending, state => {
            state.loading = true;
            state.transcribed = null;
        })
        .addCase(transcribeFile.fulfilled, (state, action) => {
            state.loading = false;
            state.transcribed = true;
        })
        .addCase(transcribeFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.transcribed = false;
        })
        .addCase(summarizeFile.pending, state => {
            state.loading = true;
            state.summarized = null;
        })
        .addCase(summarizeFile.fulfilled, (state, action) => {
            state.loading = false;
            state.summarized = true;
        })
        .addCase(summarizeFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.summarized = false;
        })
        .addCase(deleteFile.pending, state => {
            state.loading = true;
        })
        .addCase(deleteFile.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(deleteFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default filesSlice.reducer;