import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, transcribeFile, summarizeFile } from 'features/files';
import { Navigate } from 'react-router-dom';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';
import PDFPreview from 'components/PDFPreview';
import Layout from 'components/Layout';

const CreateFilePage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const { loading, error, summarized, transcribed } = useSelector((state) => state.file);
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [downloadLink, setDownloadLink] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [font, setFont] = useState('Times-Roman');
  const [fontSizeTitle, setFontSizeTitle] = useState(18);
  const [fontSizeSubHeading, setFontSizeSubHeading] = useState(14);
  const [fontSizeBody, setFontSizeBody] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.0);
  const [margin, setMargin] = useState(1.0);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [bodyColor, setBodyColor] = useState('black');
  const [title, setTitle] = useState('Factors that Enhance Learning');
  const [vocabulary, setVocabulary] = useState([
    {
      Term: 'Active Recall',
      Definition: 'Recalling information actively from memory',
      Example: 'Recalling answers to questions without looking at the textbook'
    },
    {
      Term: 'Interleaved Practice',
      Definition: 'Mixing different topics or subjects during study sessions',
      Example: 'Studying math problems, then switching to history, and then back to math'
    },
    {
      Term: 'Spacing Effect',
      Definition: 'Distributing study sessions over time for better retention',
      Example: 'Studying a language for 30 minutes every day instead of 3 hours once a week'
    }
  ]);
  const [summaryType, setSummaryType] = useState({
    '1': 'Active recall involves actively retrieving information from memory.',
    '2': 'Interleaved practice is the practice of mixing different topics or subjects during study sessions.',
    '3': 'The spacing effect suggests that spacing study sessions over time improves retention.'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxAllowedSize = 70 * 1024 * 1024; // 70 MB

    if (file && file.size > maxAllowedSize) {
      alert('File is too large. Please keep audio to under an hour (70mb limit)');
      e.target.value = '';
      return;
    }
    else if (file) {
      setFile(file);
      setFileName(file.name);
    }
  }

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  }

  const handleFontChange = (e) => {
    setFont(e.target.value);
  }

  const handleFontSizeTitleChange = (e) => {
    setFontSizeTitle(e.target.value);
  }

  const handleFontSizeSubHeadingChange = (e) => {
    setFontSizeSubHeading(e.target.value);
  }

  const handleFontSizeBodyChange = (e) => {
    setFontSizeBody(e.target.value);
  }

  const handleLineSpacingChange = (e) => {
    setLineSpacing(e.target.value);
  }

  const handleMarginChange = (e) => {
    setMargin(e.target.value);
  }

  const handleBackgroundColorChange = (e) => {
    setBackgroundColor(e.target.value);
  }

  const handleBodyColorChange = (e) => {
    setBodyColor(e.target.value);
  }

  useEffect(() => {
    getDownloadLink();
  }, [fileName]);

  useEffect(() => {
    console.log("transcription", transcription);
  }, [transcription]);

  useEffect(() => {
    const getSummary = async () => {
      const prompt = `I am writing an application that summarizes lecture transcriptions to get summaries of lectures. Please return a summary in strict JSON format with the following structure:
      {
        "Title": "The main idea of the lecture",
        "Vocabulary": [
          {
            "Term": "The term",
            "Definition": "The definition of the term",
            "Example": "An example usage of the term"
          },
          // More vocabulary items...
        ],
        "Summary": [
          "The first key point or idea from the lecture.",
          "The second key point or idea from the lecture.",
          // More summary points...
        ]
      }
      DO NOT WRAP THE GENERATED JSON AS A CODE BLOCK. ONLY THE TEXT ITSELF SHOULD BE SENT.
      IF THERE ARE ANY ERRORS, STILL SEND THE FORMAT ABOVE, WITH RANDOM TEXT AND AN ERROR MESSAGE IN THE TITLE FIELD.
      DO NOT SEND ANY OTHER TEXT BESIDES THE STRICT JSON FORMAT ABOVE. Here is the lecture transcription: `;

      if (transcription) {
        const summarizeResponse = await dispatch(summarizeFile({transcription: transcription, intro: prompt}));

  
        if (summarizeResponse.payload) {
          setTitle(summarizeResponse.payload.Title);
          setVocabulary(summarizeResponse.payload.Vocabulary);
          setSummaryType(summarizeResponse.payload.Summary);
        }
      }
    };
  
    getSummary();
  }, [transcription, dispatch]); // Run this effect when `transcription` changes
  

  const pdfExport = useRef(null);

  if (!isAuthenticated && !loading && user === null)
		return <Navigate to='/login' />;

  const getDocument = () => {
    return <PDFPreview
    title = {title}
    vocabulary = {vocabulary}
    summary = {summaryType}
    font={font}
    fontSizeTitle={fontSizeTitle}
    fontSizeSubHeading={fontSizeSubHeading}
    fontSizeBody={fontSizeBody}
    lineSpacing={lineSpacing}
    margin={margin}
    backgroundColor={backgroundColor}
    bodyColor={bodyColor}
    />
  }

  
  const getDownloadLink = async () => {
    setDownloadLink(
      <BlobProvider document={getDocument()}>
        {({ blob, url, loading, error }) => {
          if (blob) {
            setPdfBlob(blob);
          }
          if (!loading && url) {
            return <a href={url} download={`${fileName}.pdf`} style={{ textDecoration: 'none' }}>download</a>;
          } else {
            return <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>;
          }
        }}
      </BlobProvider>
    );
  };

  const handleUploadFile = async () => {
    <BlobProvider document={getDocument()}>
        {({ blob, url, loading, error }) => {
          if (blob) {
            setPdfBlob(blob);
          }
        }}
      </BlobProvider>
    if (pdfBlob) {
        const formData = new FormData();
        console.log('pdfBlob', pdfBlob);
        console.log('fileName', fileName);
        formData.append('file', new File([pdfBlob], `${fileName}.pdf`, {
            type: 'application/pdf',
        }));

        // Dispatch the thunk action with formData
        dispatch(uploadFile({ formData })).then((action) => {
            if (uploadFile.fulfilled.match(action)) {
                console.log('Upload successful', action.payload);
                // Handle success
            } else {
                console.error('Upload failed', action.payload || action.error);
                // Handle failure
            }
        });
    } else {
        console.log('PDF blob is not set');
    }
};

  
const handleSubmit = async (event) => {
  event.preventDefault();
  if (file && fileName) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mimetype', file.type);
      
      const transcriptionResponse = await dispatch(transcribeFile(formData));

      if (transcriptionResponse.payload) {
        setTranscription(transcriptionResponse.payload.results.channels[0].alternatives[0].transcript);
        // The transcription state will be updated, and useEffect will handle the rest
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }
};


  return (
    <Layout title='SimpleNotes | new note' content='Create File Page'>
      <h1>create a note</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">most audio formats accepted</label>
          <input className="form-control" type="file" accept='.mp3, .mp4, .mp2, .aac, .wav, .flac, .pcm, .mov, .m4a' id="formFile" onChange={handleFileChange} />
        </div>
        <h3>pdf settings</h3>
        <h4>font</h4>
        <div class="input-group mb-3">
          <label class="input-group-text" for="inputGroupSelect01">style</label>
          <select class="form-select" id="inputGroupSelect01" defaultValue={"Times-Roman"}onChange={handleFontChange} >
            <option selected>Choose...</option>
            <option value={"Times-Roman"}>Times New Roman</option>
            <option value={"Courier"}>Courier</option>
            <option value={"Helvetica"}>Helvetica</option>
            <option value={"OpenSans"}>Sans-Serif</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">title</span>
          <input type='number' min={0} max={50} defaultValue={18} onChange={handleFontSizeTitleChange} className="form-control" placeholder="Title Font" aria-label="Title Font" aria-describedby="basic-addon1"></input>
          <span className="input-group-text" id="basic-addon1">headings</span>
          <input type='number' min={0} max={50} defaultValue={14} onChange={handleFontSizeSubHeadingChange} className="form-control" placeholder="Body Font" aria-label="Body Font" aria-describedby="basic-addon1"></input>
          <span className="input-group-text" id="basic-addon1">body</span>
          <input type='number' min={0} max={50} defaultValue={12} onChange={handleFontSizeBodyChange} className="form-control" placeholder="Body Font" aria-label="Body Font" aria-describedby="basic-addon1"></input>
        </div>
        <h4>spacing</h4>
        <div className="input-group mb-3">
        <label class="input-group-text" for="inputGroupSelect01">line</label>
          <select class="form-select" id="inputGroupSelect01" onChange={handleLineSpacingChange}>
            <option selected>Choose...</option>
            <option value="1.0">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2.0">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3.0">3.0</option>
          </select>
          <label class="input-group-text" for="inputGroupSelect01">margin</label>
          <select class="form-select" id="inputGroupSelect01" onChange={handleMarginChange}>
            <option selected>Choose...</option>
            <option value="0.5">0.5</option>
            <option value="1.0">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
          </select>
        </div>
        <h4>color</h4>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">background</span>
          <input type="color" class="form-control form-control-color" onChange={handleBackgroundColorChange} id="background-color-input" defaultValue="white" title="Choose your color"></input>
          <span className="input-group-text" id="basic-addon1">body</span>
          <input type="color" class="form-control form-control-color" onChange={handleBodyColorChange} id="body-color-input" defaultValue="black" title="Choose your color"></input>
        </div>
        {/* <input type="text" className="form-control" aria-label="file name" value={fileName} onChange={handleFileNameChange} />
        <button type="button" className='btn btn-outline-primary'>{downloadLink}</button>
        <button onClick={handleUploadFile} type="button" className='btn btn-outline-primary'>save to account</button> */}
        <div className="d-grid gap-2">
          {(loading && transcribed == null) && 
          <div class="d-flex align-items-center">
            <strong class="text-primary" role="status">transcribing...</strong>
            <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
          </div>}
          {(loading && transcribed != null && summarized == null) && 
          <div class="d-flex align-items-center">
            <strong class="text-primary" role="status">summarizing...</strong>
            <div class="spinner-border ms-auto text-primary" aria-hidden="true"></div>
          </div>}
          {error && 
          <div class="alert alert-danger" role="alert">
            <div>
              Error: {error}
            </div>
          </div>}
          {(!loading && !summarized) && 
          <button type="submit" className='btn btn-outline-primary' disabled={!file}>summarize</button>
          }
          {(!loading && summarized && transcribed) && 
        <div className="input-group mb-3">
          <span className="input-group-text">file name</span>
          <input type="text" className="form-control" aria-label="file name" value={fileName} onChange={handleFileNameChange} />
          <button type="button" className='btn btn-outline-primary' disabled={(!fileName&&pdfBlob)}>{downloadLink}</button>
          <button onClick={handleUploadFile} type="button" className='btn btn-outline-primary' disabled={(!fileName&&pdfBlob)}>save to account</button>
        </div>
          }
        </div>
      </form>

      <h3>preview</h3>
      <PDFViewer style={{ width: '100%', height: '500px' }}>
        {getDocument()}
      </PDFViewer>
    </Layout>
  );
};

export default CreateFilePage;