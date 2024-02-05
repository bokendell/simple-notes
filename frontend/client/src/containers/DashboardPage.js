import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
// import updateUser from 'features/user';

const DashboardPage = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, user, loading } = useSelector(state => state.user);

	// const handleAddTranscription = () => {
	// 	const transcriptions_left = user.transcriptions_left + 1;
	// 	const transcription_made = user.transcriptions_made - 1;
	// 	dispatch(updateUser({ transcriptions_left: transcriptions_left, transcriptions_made: transcription_made }));
	// };

	// const handleTakeAwayTranscription = () => {
	// 	const transcriptions_left = user.transcriptions_left - 1;
	// 	const transcription_made = user.transcriptions_made + 1;
	// 	dispatch(updateUser({ transcriptions_left: transcriptions_left, transcriptions_made: transcription_made }));
	// };

	if (!isAuthenticated && !loading && user === null)
		return <Navigate to='/login' />;

	return (
		<Layout title='SimpleNotes | dashboard' content='Dashboard page'>
			{loading || user === null ? (
				<div className='spinner-border text-primary' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</div>
			) : (
				<>
					<h1 className='mb-5'>dashboard</h1>
					<p>user details</p>
					<ul>
						<li>first name: {user.first_name}</li>
						<li>last name: {user.last_name}</li>
						<li>email: {user.email}</li>
						{/* <li>transcriptions: {user.transcriptions_done}</li>
						<li>transcriptions left: {user.transcriptions_left}</li> */}
					</ul>
					{/* <button onClick={handleAddTranscription} className='btn btn-primary'>add transcription</button>
					<button onClick={handleTakeAwayTranscription} className='btn btn-danger'>take away transcription</button> */}
				</>
			)}
		</Layout>
	);
};

export default DashboardPage;
