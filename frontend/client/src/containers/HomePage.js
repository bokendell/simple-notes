import Layout from 'components/Layout';
import uploadStepVid from './assets/lecture-upload-vid.mp4';
import transcribeSummaryStepVid from './assets/transcribe-summary-step.mp4';
import savingStepVid from './assets/saving-step.mp4';
import manageStepVid from './assets/manage-step.mp4';

const HomePage = () => {
    return (
        <Layout title='SimpleNotes | home' content='Home page for lecture transcription and summarization'>
            <div className='container py-5'>
                <h1 className='mb-5 text-center'>Welcome to SimpleNotes</h1>
                <p className='lead text-center'>follow these simple steps to get your lecture notes:</p>
                <div className='row justify-content-center mb-4'>
                    <div className='col-md-8'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>upload</h2>
                                <p className='card-text'>upload the audio file of your lecture</p>
                                <video autoPlay loop muted playsinline className='img-fluid'>
                                    <source src={uploadStepVid} type='video/mp4'/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center mb-4'>
                    <div className='col-md-8'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>transcribe & summarize</h2>
                                <p className='card-text'>transcribe and summarize your lecture audio (around 20-30s)</p>
                                <video autoPlay loop muted playsinline className='img-fluid'>
                                    <source src={transcribeSummaryStepVid} type='video/mp4'/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center mb-4'>
                    <div className='col-md-8'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>save</h2>
                                <p className='card-text'>save the notes to your account or directly to your device using our PDF viewer</p>
                                <video autoPlay loop muted playsinline className='img-fluid'>
                                    <source src={savingStepVid} type='video/mp4'/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='card'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>manage</h2>
                                <p className='card-text'>manage all your account's notes</p>
                                <video autoPlay loop muted playsinline className='img-fluid'>
                                    <source src={manageStepVid} type='video/mp4'/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
