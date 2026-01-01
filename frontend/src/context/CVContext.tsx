// frontend/src/context/CVContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// 1. Explicitly import the type to fix the red line
import type { ReactNode } from 'react'; 

import { useAuth } from './AuthContext';

// 2. Remove the '.ts' extension here to fix the other error
import { db } from '../firebase'; 

import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { CVContent } from '../types'; 
import { initialCV } from '../data/initialCV';

// ... (Keep the rest of the file exactly the same)

// Define the Context Shape
interface CVContextType {
  cvData: CVContent;
  updateCVData: (section: keyof CVContent, data: any) => void;
  setCVData: React.Dispatch<React.SetStateAction<CVContent>>;
  setTargetJob: (jobDescription: string) => void;
  isSaving: boolean; // <--- Visual indicator
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth(); // Get the logged-in user
  const [cvData, setCVData] = useState<CVContent>(initialCV);
  const [isSaving, setIsSaving] = useState(false);

  // 1. LOAD DATA when User Logs In
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Merge saved data with initial structure (in case we added new fields)
          setCVData({ ...initialCV, ...docSnap.data() } as CVContent);
        }
      }
    };
    loadUserData();
  }, [currentUser]);

  // 2. AUTO-SAVE when Data Changes (Debounced 1s)
  useEffect(() => {
    if (!currentUser) return;

    const saveTimer = setTimeout(async () => {
      setIsSaving(true);
      try {
        const docRef = doc(db, "users", currentUser.uid);
        // Save the entire cvData object
        await setDoc(docRef, cvData, { merge: true });
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        setIsSaving(false);
      }
    }, 2000); // Wait 2 seconds after typing stops

    return () => clearTimeout(saveTimer);
  }, [cvData, currentUser]);

  const updateCVData = (section: keyof CVContent, data: any) => {
    setCVData((prev) => ({ ...prev, [section]: data }));
  };

  const setTargetJob = (jobDescription: string) => {
    setCVData((prev) => ({ ...prev, targetJob: jobDescription }));
  };

  return (
    <CVContext.Provider value={{ cvData, setCVData, updateCVData, setTargetJob, isSaving }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within a CVProvider');
  return context;
};