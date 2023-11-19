import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { getFiles } from 'features/files';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';

const FilesPage = () => {
	const dispatch = useDispatch();
	const { files, loading, error } = useSelector(state => state.file);
	const { isAuthenticated, user } = useSelector(state => state.user);
	const [selectedRows, setSelectedRows] = useState([]);

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	  };

	useEffect(() => {
		dispatch(getFiles());
	}, [dispatch]);

	if (!isAuthenticated && !loading && user === null)
		return <Navigate to='/login' />;

	const handleToggle = (fileId) => {
		// Logic to handle row selection
		// Update selectedRows state accordingly
		if (selectedRows.includes(fileId)) {
			setSelectedRows(selectedRows.filter(id => id !== fileId));
		} else {
			setSelectedRows([...selectedRows, fileId]);
		}
	};
	
	const handleDelete = () => {
	// Logic to handle deletion of selected rows
	// Use the selectedRows state for deletion
	console.log('Deleting rows:', selectedRows);
	// Perform deletion here
	setSelectedRows([]); // Clear selected rows after deletion
	};
	
	return (
		<Layout title='SimpleNotes | Files' content='Files page'>
			{loading || user === null ? (
			<div className='spinner-border text-primary' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</div>
			) : (
			<>
				<h1 className='mb-5'>Files</h1>
				<div className="mb-3">
				{selectedRows.length > 0 && (
					<button onClick={handleDelete} className='btn btn-danger'>
					Delete Selected
					</button>
				)}
				</div>
				<table className="table">
				{/* Table headers */}
				<thead>
					<tr>
					<th scope='col'></th> {/* Toggle column */}
					<th scope='col'>Name</th>
					<th scope='col'>Created</th>
					<th scope='col'>Updated</th>
					<th>URL</th>
					</tr>
				</thead>
				<tbody>
					{/* Table rows */}
					{files && files.map(file => (
					<tr key={file.id}>
						<td>
						<input
							type='checkbox'
							onChange={() => handleToggle(file.id)}
							checked={selectedRows.includes(file.id)}
						/>
						</td>
						<td>{file.name}</td>
						<td>{formatDate(file.createdAt)}</td>
						<td>{formatDate(file.updatedAt)}</td>
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