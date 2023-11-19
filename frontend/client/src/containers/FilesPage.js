import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getFiles } from 'features/user';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

const FilesPage = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, user, loading, files } = useSelector(state => state.user);

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	  };

	useEffect(() => {
		dispatch(getFiles());
	}, [dispatch]);

	if (!isAuthenticated && !loading && user === null)
		return <Navigate to='/login' />;

	return (
		<Layout title='SimpleNotes | Files' content='Files page'>
			{loading || user === null ? (
				<div className='spinner-border text-primary' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</div>
			) : (
				<>
					<h1 className='mb-5'>Files</h1>
					<p>User Files</p>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Created</th>
								<th>Updated</th>
								<th>URL</th>
							</tr>
						</thead>
						<tbody>
						{files && files.map(file => (
            				<tr key={file.id}>
								<td>{file.name}</td>
								<td>{formatDate(file.created_at)}</td>
								<td>{formatDate(file.updated_at)}</td>
								<td>{file.s3_url}</td>
							</tr>
						))}
						</tbody>
					</table>
				</>
			)}
		</Layout>
	);
};

export default FilesPage;