import React, { useState } from 'react';
import axios from 'axios';

const DocumentUploadComponent = () => {
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    try {
      if (!document) {
        console.error('No document selected for upload.');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('document', document);

      const response = await axios.post(
        'http://127.0.0.1:8000/query/fileproc/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        setUploadSuccess(true);
      } else {
        console.error('Document upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error during document upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md">
      <div className="mb-4">
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Select Document to Upload:
        </label>
        <input
          type="file"
          id="document"
          className="mt-1 p-2"
          accept=".txt, .pdf, .doc, .docx"
          onChange={handleDocumentChange}
        />
      </div>

      <div className="mb-4">
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
          onClick={handleUploadClick}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {uploadSuccess && (
        <div className="bg-green-100 p-4 rounded-md">
          <strong className="block text-green-700 mb-2">Upload Success:</strong>
          <p className="text-green-800">Document uploaded successfully.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadComponent;
