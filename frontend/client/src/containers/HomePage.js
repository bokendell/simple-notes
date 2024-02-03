import Layout from 'components/Layout';

const HomePage = () => {
    return (
        <Layout title='SimpleNotes | Home' content='Home page for lecture transcription and summarization'>
            <div className='container py-5'>
                <h1 className='mb-5 text-center'>Welcome to SimpleNotes</h1>
                <p className='lead text-center'>Follow these simple steps to get your lecture notes:</p>
                <div className='row justify-content-center mb-4'>
                    <div className='col-md-8'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>1. Upload Your Lecture Audio</h2>
                                <p className='card-text'>Start by uploading the audio file of your lecture.</p>
                                {/* Placeholder for the image/video */}
                                <div className='media-placeholder bg-secondary text-white text-center'>[Upload Step Image/Video]</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center mb-4'>
                    <div className='col-md-8'>
                        <div className='card mb-3'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>2. Transcription & Summarization</h2>
                                <p className='card-text'>Our tool will transcribe and provide a concise summary of your lecture.</p>
                                {/* Placeholder for the image/video */}
                                <div className='media-placeholder bg-secondary text-white text-center'>[Transcription Step Image/Video]</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='card'>
                            <div className='card-body'>
                                <h2 className='h4 card-title'>3. Save and Access</h2>
                                <p className='card-text'>Save the notes to your account or directly to your device using our PDF viewer.</p>
                                {/* Placeholder for the image/video */}
                                <div className='media-placeholder bg-secondary text-white text-center'>[Save Step Image/Video]</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
