import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, transcribeFile } from 'features/files';
import Layout from 'components/Layout';
import { response } from 'express';

const CreateFilePage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [transcription, setTranscription] = useState('');
  const { loading, error } = useSelector((state) => state.files);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure both file and file name are available
    if (file && fileName) {
      // Dispatch the uploadFile action passing file name and S3 URL if applicable
      dispatch(uploadFile({ name: fileName, s3_url: 'YOUR_S3_URL' /* Replace with actual URL */ })).then((response) => {
        // Upon successful file upload, initiate transcription
        if (response.payload) {
          dispatch(transcribeFile(file)).then((transcriptionResponse) => {
            // Upon successful transcription, update state with the transcription
            if (transcriptionResponse.payload) {
              setTranscription(transcriptionResponse.payload.transcription); // Replace with the correct path for the transcription data in the response
            }
          });
        }
      });
    }
  };

  return (
    <Layout title='SimpleNotes | New File' content='Login page'>
      <h1>Upload a new file</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">max 100mb</label>
          <input className="form-control" type="file" accept='.mp3, .mp4' id="formFile" onChange={handleFileChange} />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">New File Name</span>
          <input type="text" className="form-control" aria-label="File Name" value={fileName} onChange={handleFileNameChange} />
          <button type="submit" className='btn btn-outline-primary'>Create</button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </Layout>
  );
};

export default CreateFilePage;