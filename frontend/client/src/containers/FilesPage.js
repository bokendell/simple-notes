import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { getFiles, deleteFile } from 'features/files';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import '@fortawesome/fontawesome-free/css/all.min.css';



const FilesPage = () => {
	const dispatch = useDispatch();
	const { files, loading, error } = useSelector(state => state.file);
	const { isAuthenticated, user } = useSelector(state => state.user);
	const [selectedRows, setSelectedRows] = useState([]);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState('');

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'short', day: 'numeric'};
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
		selectedRows.forEach(id => {
			dispatch(deleteFile(id));

		});
		// Perform deletion here
		setSelectedRows([]); // Clear selected rows after deletion
	};

	const handleSort = (columnName) => {
		if (sortBy === columnName) {
		  // Reverse the order if the same column is clicked again
		  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
		  // Set the new sorting column
		  setSortBy(columnName);
		  setSortOrder('asc');
		}
	  };

	  const sortedFiles = [...files].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];
	  
		if (sortBy === 'created_at' || sortBy === 'updated_at') {
		  // Assuming createdAt and updatedAt are dates
		  return sortOrder === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
		} else {
		  // For string-based sorting (name, URL)
		  if (!aValue || !bValue) {
			return 0; // If any value is missing or undefined, retain the order
		  }
		  return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
		}
	  });
	  
	
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
				<table className="table table-hover table-sortable">
				{/* Table headers */}
				<thead>
					<tr>
						<th scope='col'></th> {/* Toggle column */}
						<th scope='col' onClick={() => handleSort('name')}>
    						Name
							{sortBy === 'name' && (
								<i className={`fa ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`} aria-hidden='true'></i>
							)}
						</th>
						<th scope='col' onClick={() => handleSort('created_at')}>
							Created
							{sortBy === 'created_at' && (
								<i className={`fa ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`} aria-hidden='true'></i>
							)}
						</th>
						<th scope='col' onClick={() => handleSort('updated_at')}>Updated
							{sortBy === 'updated_at' && (
								<i className={`fa ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`} aria-hidden='true'></i>
							)}
						</th>
						<th scope='col' onClick={() => handleSort('s3_key')}>
    						URL
							{sortBy === 's3_key' && (
								<i className={`fa ${sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`} aria-hidden='true'></i>
							)}
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedFiles.map(file => (
					<tr key={file.id}>
						<td>
						<input
							type='checkbox'
							onChange={() => handleToggle(file.id)}
							checked={selectedRows.includes(file.id)}
						/>
						</td>
						<td>{file.name}</td>
						<td>{formatDate(file.created_at)}</td>
						<td>{formatDate(file.updated_at)}</td>
						<td>{file.s3_key}</td>
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