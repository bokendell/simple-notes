import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getFiles } from 'features/files';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

const FilesPage = () => {
	const dispatch = useDispatch();
	const { files, loading, error } = useSelector(state => state.file);
	const { isAuthenticated, user } = useSelector(state => state.user);

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
					<table class="table">
						<thead>
							<tr>
								<th scope='col'>Name</th>
								<th scope='col'>Created</th>
								<th scope='col'>Updated</th>
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