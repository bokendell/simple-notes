import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ListForm from "./ListForm";
import { getFCP } from "web-vitals";

function FileList() {
    const [files, setFiles] = React.useState([]);
    const [showFileForm, setFileForm] = React.useState(false);

    useEffect(() => {
        async function getFiles() {
            const response = await axios.get("http://localhost:8000/api/files/");
            setFiles(response.data);
        }
        getFiles();
    }, []);
}

const handleDelete = async (id) => {
    try {
        await axios.delete(`http://localhost:8000/api/files/${id}/`);
        setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
        console.log(error);
    }
};

return (
    <div className="container mx-auto px-4">
      {showFileForm ? (
        // Renders the note form component when showNoteForm is true
        <FileForm setFiles={setFiles} />
      ) : (
        <div>
          <div className="flex justify-between items-center my-8">
            <button
              // Sets showNoteForm to true when the "Create Note" button is clicked
              onClick={() => setShowFileForm(true)}
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Create File
            </button>
          </div>
          {files.length > 0 ? (
            // Renders a grid of note cards when there are notes to display
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notes.map((file) => (
                <li key={file.id} className="border border-gray-400 rounded-lg overflow-hidden shadow-md">
                  <Link to={`/files/${file.id}/`} className="block">
                    <div className="p-4">
                      <h2 className="text-lg font-medium text-gray-900">{file.name}</h2>
                      <p className="mt-2 text-gray-600">{file.s3_url}...</p>
                    </div>
                  </Link>
                  <div className="bg-gray-100 px-4 py-3">
                    <button
                      // Deletes the file when the "Delete" button is clicked
                      className="text-red-500 font-medium hover:text-red-600"
                      onClick={() => handleDelete(file.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No files found.</p>
          )}
        </div>
      )}
    </div>
);

export default FileList;