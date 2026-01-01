// frontend/src/components/UserMenu.tsx
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';

const UserMenu = () => {
  const { currentUser, login, logout } = useAuth();
  const { isSaving } = useCV(); 

  return (
    <div className="flex items-center gap-4">
      {/* 1. Saving Indicator (Only shows when logged in) */}
      {currentUser && (
        <span className={`text-xs font-medium transition-colors ${isSaving ? 'text-green-600' : 'text-gray-400'}`}>
          {isSaving ? '💾 Saving...' : '☁️ Saved'}
        </span>
      )}

      {/* 2. Login/Logout Logic */}
      {currentUser ? (
        <div className="flex items-center gap-3">
          {currentUser.photoURL && (
            <img 
              src={currentUser.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-300"
            />
          )}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-700">{currentUser.displayName}</p>
            <button 
              onClick={logout}
              className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={login}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-md"
        >
          {/* Google G Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Sign in
        </button>
      )}
    </div>
  );
};

export default UserMenu;