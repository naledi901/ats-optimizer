import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
// 1. IMPORT FIRESTORE TOOLS
import { doc, getDoc, increment, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 

interface Props {
  textToEnhance: string;
  section: 'summary' | 'experience' | 'skills' | 'education' | 'softSkills' | 'projects' | 'activities';
  onEnhance: (newText: string) => void;
  context?: string;
  className?: string;
}

export const AIEnhanceButton: React.FC<Props> = ({ textToEnhance, section, onEnhance, context, className }) => {
  const [loading, setLoading] = useState(false);
  const { cvData } = useCV(); 
  const { currentUser, login } = useAuth();

  // --- CONFIGURATION ---
  const MAX_USAGE_LIMIT = 10; // <--- LIMIT SET TO 10

  const handleClick = async () => {
    // 1. AUTH CHECK
    if (!currentUser) {
      const confirmLogin = window.confirm("🔒 Premium Feature\n\nPlease sign in to use AI Optimization.\nClick OK to sign in with Google.");
      if (confirmLogin) login();
      return; 
    }

    // 2. TEXT VALIDATION
    if (!textToEnhance || textToEnhance.length < 5) {
      alert('Please write a rough draft first so the AI has something to work with.');
      return;
    }

    setLoading(true);

    try {
      // --- 3. CHECK USAGE LIMIT (FIRESTORE) ---
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      let currentUsage = 0;

      if (userSnap.exists()) {
        const userData = userSnap.data();
        currentUsage = userData.aiUsageCount || 0;
      }

      // STOP if limit reached
      if (currentUsage >= MAX_USAGE_LIMIT) {
        alert(`🚫 Limit Reached\n\nYou have used all ${MAX_USAGE_LIMIT} free AI enhancements.\n(This is where you would ask them to upgrade!)`);
        setLoading(false);
        return; 
      }
      // ----------------------------------------

      // 4. CALL API (Only if limit not reached)
      // NOTE: We will swap 'localhost' for your Render URL in the next step!
      const response = await fetch('http://localhost:5000/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToEnhance, 
          section, 
          context,
          jobDescription: cvData.targetJob 
        }),
      });

      if (!response.ok) throw new Error('AI Failed');

      const data = await response.json();
      
      // 5. UPDATE PARENT FORM
      onEnhance(data.enhancedText);

      // --- 6. CHARGE THE USER (INCREMENT COUNT) ---
      // We use 'merge: true' to ensure we don't overwrite their saved CV data
      await setDoc(userRef, { 
        aiUsageCount: increment(1) 
      }, { merge: true });
      // --------------------------------------------
      
    } catch (error) {
      console.error(error);
      alert('AI is currently unavailable. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`
        flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
        ${loading 
          ? 'bg-purple-50 text-purple-400 border-purple-200 cursor-wait' 
          : cvData.targetJob 
            ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-sm' 
            : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300 shadow-sm' 
        }
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Checking Credits...
        </>
      ) : (
        <>
          <span>{cvData.targetJob ? '🎯' : '✨'}</span> 
          {cvData.targetJob ? 'Match Job' : 'Enhance'}
        </>
      )}
    </button>
  );
};