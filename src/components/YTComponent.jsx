import React, { useState } from 'react';
import axios from 'axios';

const YTComponent = () => {
  const [url, setUrl] = useState('');
  const [answer, setAnswer] = useState('');
  const [references, setReferences] = useState('');
  const [trainingUrl, setTrainingUrl] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [generateQuestionsLoading, setGenerateQuestionsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState('');

  const handleTrainingURLChange = (e) => {
    const url = e.target.value;
    const regex_url = url.replace(/&.*/g, '');
    setTrainingUrl(regex_url);
  };

  const handleAnswerClick = async () => {
    try {
      setAnswerLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/query/llm/?query=${url}&url=${trainingUrl}`);
      setAnswer(response.data.response);
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleReferencesClick = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/query/yt/?query=${url}&url=${trainingUrl}`);
      setReferences(response.data.answers[0]);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  };

  const handleTrainClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/query/ytvid/?query=${trainingUrl}`);

      console.log('Training Response:', response.data);

      fetchTranscript(response.data);

      if (response.data === 'success') {
        window.alert('Training successful! You can now see the transcript.');
      }
    } catch (error) {
      console.error('Error during training:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeClick = async () => {
    try {
      setSummarizeLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/query/summarize_video/?url=${trainingUrl}`);
      setAnswer(response.data.response);
    } catch (error) {
      console.error('Error summarizing video:', error);
    } finally {
      setSummarizeLoading(false);
    }
  };

  const handleGenerateQuestionsClick = async () => {
    try {
      setGenerateQuestionsLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/query/question_generation/?url=${trainingUrl}`);
      setGeneratedQuestions(response.data.response);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setGenerateQuestionsLoading(false);
    }
  };

  const fetchTranscript = async (data) => {
    try {
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        setTranscript(['No transcript found for the video.']);
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setTranscript(['Error fetching transcript. Please try again later.']);
    }
  };

  return (
    <>
    <h1 className="text-2xl font-bold mt-4 ml-10">YouTube Video Question Answering</h1>
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-100 rounded-md ml-10 ">
      {/* Answer and References Section */}
      <div>
      </div>
      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Enter Question:
        </label>
        <input
          type="text"
          id="url"
          className="mt-1 p-2 border rounded-md w-full"
          placeholder="Write your Question here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          onClick={handleAnswerClick}
          disabled={answerLoading}
        >
          {answerLoading ? 'Loading...' : 'Answer'}
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          onClick={handleReferencesClick}
        >
          References
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
          onClick={handleSummarizeClick}
          disabled={summarizeLoading}
        >
          {summarizeLoading ? 'Summarizing...' : 'Summarize Video'}
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
          onClick={handleGenerateQuestionsClick}
          disabled={generateQuestionsLoading}
        >
          {generateQuestionsLoading ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>

      {answer && (
        <div className="bg-green-100 p-4 rounded-md mb-4">
          <strong className="block text-green-700 mb-2">Answer:</strong>
          <div className="max-h-48 overflow-y-auto">
            {answer}
          </div>
        </div>
      )}

      {references && (
        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <strong className="block text-blue-700 mb-2">References:</strong>
          <p className="text-blue-800">{references}</p>
        </div>
      )}

      {generatedQuestions && (
        <div className="bg-yellow-100 p-4 rounded-md mb-4">
          <strong className="block text-yellow-700 mb-2">Generated Questions:</strong>
          <p className="text-yellow-800">{generatedQuestions}</p>
        </div>
      )}

      {/* Training Section */}
      <div className="mb-4">
        <label htmlFor="trainingUrl" className="block text-sm font-medium text-gray-700">
          Enter URL for Training:
        </label>
        <div className="flex">
          <input
            type="text"
            id="trainingUrl"
            className="mt-1 p-2 border rounded-l-md w-full"
            placeholder="Paste YouTube URL here..."
            value={trainingUrl}
            onChange={handleTrainingURLChange}
          />
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-r-md"
            onClick={handleTrainClick}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Train'}
          </button>
        </div>
      </div>

      {/* Transcript Section */}
      {transcript.length > 0 && (
        <div className="bg-white rounded-md shadow-md p-4 mb-4">
          <div className="bg-green-100 p-4 rounded-md max-h-96 overflow-y-auto">
            <strong className="block text-green-700 mb-2">Transcript:</strong>
            {transcript.map((line, index) => (
              <p key={index} className="text-green-800">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default YTComponent;
