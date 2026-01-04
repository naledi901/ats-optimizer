import React from 'react';
import { PaystackButton } from 'react-paystack';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();

  if (!isOpen || !currentUser) return null;

  // ⚙️ PAYSTACK CONFIGURATION
  const config = {
    reference: (new Date()).getTime().toString(), // Unique ID for this transaction
    email: currentUser.email || 'user@example.com',
    amount: 5000, // Amount is in CENTS (5000 cents = R50.00)
    publicKey: 'pk_test_bc2fe228b0f54dedb16938ee19aa1896691c281a', // <--- ⚠️ PASTE YOUR KEY HERE
    currency: 'ZAR',
  };

  const handlePaystackSuccess = (reference: any) => {
    // 1. Verify transaction (We will add backend verification next)
    console.log("Payment Complete:", reference);
    
    // 2. Unlock the app for the user
    onSuccess(); 
  };

  const handlePaystackClose = () => {
    console.log("User closed payment window");
  };

  const componentProps = {
    ...config,
    text: 'Pay R50 Now',
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header Image / Icon */}
        <div className="bg-purple-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Unlock Unlimited AI</h2>
          <p className="text-purple-100 text-sm mt-1">Get the job you deserve.</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>Unlimited AI Enhancements</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>Premium PDF Templates</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>Remove "Free Tier" Limits</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Total Price</span>
              <span className="text-3xl font-bold text-gray-900">R50<span className="text-sm font-normal text-gray-500">.00</span></span>
            </div>
            
            {/* The Paystack Button */}
            <PaystackButton 
              {...componentProps} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
            />
            
            <p className="text-center text-xs text-gray-400 mt-3">
              Secure payment via Paystack 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};