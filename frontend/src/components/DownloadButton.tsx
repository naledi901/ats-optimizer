import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';

const DownloadButton = () => {
  const { cvData } = useCV();
  const { currentUser, login } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    // --- 1. AUTH CHECK (Direct Login - No "Confirm" dialog) ---
    if (!currentUser) {
       login(); // Call login directly to avoid popup blockers
       return; 
    }
    // ----------------------------------------------------------

    setIsDownloading(true);
    try {
      const response = await fetch('https://ats-optimizer-zjdl.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Sanitize filename
      a.download = `CV_${cvData.personalInfo.fullName.replace(/\s+/g, '_') || 'Draft'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download Error:', error);
      alert('PDF Generation Failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all
        ${isDownloading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
        }
      `}
    >
      {isDownloading ? (
        <>
          {/* Loading Spinner */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : (
        <>
          {/* Download Icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
};

export default DownloadButton;