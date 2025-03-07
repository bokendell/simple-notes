import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getFiles, deleteFile, getPresignedURL } from "features/files";
import { Navigate } from "react-router-dom";
import { Download } from "react-feather";
import Layout from "components/Layout";
import "@fortawesome/fontawesome-free/css/all.min.css";

const FilesPage = () => {
	const dispatch = useDispatch();
	const { files, loading } = useSelector((state) => state.file);
	const { isAuthenticated, user } = useSelector((state) => state.user);
	// const [ fileURLs, setFileURLs ] = useState({});
	const [selectedRows, setSelectedRows] = useState([]);
	const [sortBy, setSortBy] = useState("");
	const [sortOrder, setSortOrder] = useState("");

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	useEffect(() => {
		dispatch(getFiles());
		// for (const file of files) {
		// 	fileURLs[file.id] = dispatch(getPresignedURL(file.id));
		// }
	}, [dispatch]);

	if (!isAuthenticated && !loading && user === null)
		return <Navigate to="/login" />;

	const handleToggle = (fileId) => {
		// Logic to handle row selection
		// Update selectedRows state accordingly
		if (selectedRows.includes(fileId)) {
			setSelectedRows(selectedRows.filter((id) => id !== fileId));
		} else {
			setSelectedRows([...selectedRows, fileId]);
		}
	};

	const handleDownloadClick = async (fileId) => {
		try {
			console.log("Getting URL for:", fileId);
			// Assuming getPresignedURL is an async operation that fetches the URL
			const actionResult = await dispatch(getPresignedURL(fileId));
			// Assuming the URL is in the payload after the action is dispatched
			const url = actionResult.payload.url; // Adjust according to how your data is structured
			console.log("URL:", url);
			if (url) {
				// Use the fileId to download the file if URL is obtained
				console.log("Downloading file:", fileId);
				window.open(url, "_blank");
			} else {
				console.error("No URL returned for file:", fileId);
			}
		} catch (error) {
			console.error("Error fetching URL:", error);
		}
	};

	const handleDelete = () => {
		// Logic to handle deletion of selected rows
		// Use the selectedRows state for deletion
		console.log("Deleting rows:", selectedRows);
		selectedRows.forEach((id) => {
			dispatch(deleteFile(id));
		});
		// Perform deletion here
		setSelectedRows([]); // Clear selected rows after deletion
	};

	const handleSort = (columnName) => {
		if (sortBy === columnName) {
			// Reverse the order if the same column is clicked again
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			// Set the new sorting column
			setSortBy(columnName);
			setSortOrder("asc");
		}
	};

	const sortedFiles = [...files].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (sortBy === "created_at" || sortBy === "updated_at") {
			// Assuming createdAt and updatedAt are dates
			return sortOrder === "asc"
				? new Date(aValue) - new Date(bValue)
				: new Date(bValue) - new Date(aValue);
		} else {
			// For string-based sorting (name, URL)
			if (!aValue || !bValue) {
				return 0; // If any value is missing or undefined, retain the order
			}
			return sortOrder === "asc"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}
	});

	return (
		<Layout title="SimpleNotes | notes" content="notes page">
			{loading || user === null ? (
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			) : (
				<>
					<h1 className="mb-5">notes</h1>
					<div className="mb-3">
						{selectedRows.length > 0 && (
							<button
								onClick={handleDelete}
								className="btn btn-danger"
							>
								Delete Selected
							</button>
						)}
					</div>
					<table className="table table-hover table-sortable">
						{/* Table headers */}
						<thead>
							<tr>
								<th scope="col"></th> {/* Toggle column */}
								<th
									scope="col"
									onClick={() => handleSort("name")}
								>
									name
									{sortBy === "name" && (
										<i
											className={`fa ${
												sortOrder === "asc"
													? "fa-sort-up"
													: "fa-sort-down"
											}`}
											aria-hidden="true"
										></i>
									)}
								</th>
								<th
									scope="col"
									onClick={() => handleSort("created_at")}
								>
									created
									{sortBy === "created_at" && (
										<i
											className={`fa ${
												sortOrder === "asc"
													? "fa-sort-up"
													: "fa-sort-down"
											}`}
											aria-hidden="true"
										></i>
									)}
								</th>
								<th
									scope="col"
									onClick={() => handleSort("updated_at")}
								>
									updated
									{sortBy === "updated_at" && (
										<i
											className={`fa ${
												sortOrder === "asc"
													? "fa-sort-up"
													: "fa-sort-down"
											}`}
											aria-hidden="true"
										></i>
									)}
								</th>
								<th className="text-center" scope="col">
									download
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedFiles.map((file) => (
								<tr key={file.id}>
									<td>
										<input
											type="checkbox"
											onChange={() =>
												handleToggle(file.id)
											}
											checked={selectedRows.includes(
												file.id
											)}
										/>
									</td>
									<td>{file.name}</td>
									<td>
										{formatDate(
											file.created_at
										).toLowerCase()}
									</td>
									<td>
										{formatDate(
											file.updated_at
										).toLowerCase()}
									</td>
									<td className="text-center">
										<button
											className="btn btn-link p-0 border-0 d-inline-block" // Changed from d-flex to d-inline-block
											onClick={() =>
												handleDownloadClick(file.id)
											}
											style={{
												color: "black",
												width: "100%",
											}}
										>
											<Download />
										</button>
									</td>
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
