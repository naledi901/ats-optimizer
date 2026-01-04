import React, { useState } from 'react';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from './PaymentModal'; // <--- Import the Modal

interface Props {
  textToEnhance: string;
  section: 'summary' | 'experience' | 'skills' | 'education' | 'softSkills' | 'projects' | 'activities';
  onEnhance: (newText: string) => void;
  context?: string;
  className?: string;
}

export const AIEnhanceButton: React.FC<Props> = ({ textToEnhance, section, onEnhance, context, className }) => {
  const [loading, setLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false); // <--- Controls the popup
  
  const { cvData } = useCV(); 
  const { currentUser, login } = useAuth();

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
      // 3. CALL BACKEND
      const response = await fetch('https://ats-optimizer-zjdl.onrender.com/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: textToEnhance, 
          section, 
          context,
          jobDescription: cvData.targetJob,
          userId: currentUser.uid 
        }),
      });

      const data = await response.json();

      // CASE A: Limit Reached (403 Error)
      if (response.status === 403) {
        // OPEN THE PAYMENT MODAL INSTEAD OF ALERTING! 💎
        setShowPayModal(true); 
        return; 
      }

      // CASE B: General Error
      if (!response.ok) throw new Error('AI Failed');

      // CASE C: Success
      onEnhance(data.enhancedText);
      
    } catch (error) {
      console.error(error);
      alert('AI is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: Called when Paystack says "Success" ---
  const handlePaymentSuccess = async () => {
    try {
      if (!currentUser) return;

      // 1. Tell Backend to Upgrade User
      await fetch('https://ats-optimizer-zjdl.onrender.com/upgrade-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid }),
      });

      // 2. Close Modal & Notify
      setShowPayModal(false);
      alert("🎉 Payment Successful! You now have UNLIMITED Access.");

    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Payment received, but upgrade failed. Please contact support.");
    }
  };

  return (
    <>
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
            Optimizing...
          </>
        ) : (
          <>
            <span>{cvData.targetJob ? '🎯' : '✨'}</span> 
            {cvData.targetJob ? 'Match Job' : 'Enhance'}
          </>
        )}
      </button>

      {/* THE PAYMENT POPUP */}
      <PaymentModal 
        isOpen={showPayModal} 
        onClose={() => setShowPayModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};