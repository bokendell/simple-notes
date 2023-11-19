import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, transcribeFile } from 'features/files';
import Layout from 'components/Layout';

const CreateFilePage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [transcription, setTranscription] = useState('');
  const { loading, error } = useSelector((state) => state.file);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure both file and file name are available
    if (file && fileName) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('mimetype', file.type);

        // Dispatch the uploadFile action passing file name and S3 URL if applicable
        const uploadResponse = await dispatch(uploadFile({ name: fileName, s3_url: 'https://www.abc.com' /* Replace with actual URL */ }));

        if (uploadResponse.payload) {
          const transcriptionResponse = await dispatch(transcribeFile({ file: formData, mimetype: file.type }));

          if (transcriptionResponse.payload) {
            setTranscription(transcriptionResponse.payload.transcription);
          }
        }
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }
  };

  return (
    <Layout title='SimpleNotes | New File' content='Login page'>
      <h1>Upload a new file</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">max 100mb</label>
          <input className="form-control" type="file" accept='.m4a, .mp4' id="formFile" onChange={handleFileChange} />
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