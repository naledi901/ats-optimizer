import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import Editor from './components/Editor';

function App() {
  // This state controls which screen is visible
  // false = Show Landing Page
  // true = Show CV Editor
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      {showEditor ? (
        // If user clicked Start, show the Editor
        <Editor />
      ) : (
        // Otherwise, show the Landing Page
        // We pass a function so the button inside LandingPage can turn showEditor to true
        <LandingPage onStart={() => setShowEditor(true)} />
      )}
    </>
  );
}

export default App;