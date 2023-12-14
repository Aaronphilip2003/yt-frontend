import React, { useState } from 'react';
import axios from 'axios';

const DocumentUploadComponent = ({ onSuccess }) => {
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const response = await axios.post('http://127.0.0.1:8000/query/fileproc/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        setUploadSuccess(true);
        onSuccess(); // Notify the parent component about the successful upload
      } else {
        console.error('Document upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error during document upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`http://127.0.0.1:8000/query/answerfile/?query=${userMessage}&name=${document.name}`, {
        userMessage,
      });

      // Extract relevant data from the response and update the chat history
      const newChatHistory = [...chatHistory, { role: 'user', message: userMessage }];
      if (response.data.response) {
        newChatHistory.push({ role: 'bot', message: response.data.response });
      }

      setChatHistory(newChatHistory);
      setUserMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md">
      {/* Document Upload Section */}
      <div>
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
      </div>

      {/* Chat Section */}
      {uploadSuccess && (
        <div>
          <div className="mb-4">
            <div className="mb-2">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={chat.role === 'user' ? 'text-right text-blue-500' : 'text-left text-green-500'}
                >
                  {chat.message}
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                className="mt-1 p-2 border rounded-md w-full"
                placeholder="Type your message here..."
                value={userMessage}
                htmlFor="query"
                onChange={handleUserMessageChange}
              />
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md"
                onClick={handleSendMessage}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadComponent;
