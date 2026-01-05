import React from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  const { login, currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="text-xl font-bold text-gray-900">ATS Optimizer</span>
        </div>
        <div className="flex gap-4 items-center">
          {!currentUser ? (
            <button onClick={login} className="text-sm font-semibold text-gray-600 hover:text-blue-600">
              Log In
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <img src={currentUser.photoURL || ''} className="w-8 h-8 rounded-full border" alt="Profile" />
              <span className="text-sm font-medium">{currentUser.displayName}</span>
            </div>
          )}
          <button 
            onClick={onStart}
            className="bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-green-600 transition-all shadow-md"
          >
            {currentUser ? 'Go to Dashboard' : 'Build My CV'}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-wider text-green-700 uppercase bg-green-100 rounded-full">
            #1 AI CV Builder in SA 🇿🇦
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            The CV that gets the <br/>
            <span className="text-green-500">job done.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
            Build a professional, ATS-friendly CV in minutes. Our AI helps you write the perfect summary and skills to beat the bots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-green-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all"
            >
              Create Your CV Now
            </button>
          </div>
        </div>

        {/* Right: Actual App Screenshot (UPDATED) */}
        <div className="flex-1 relative">
          {/* The Floating Card Effect */}
          <div className="relative z-10 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 transform rotate-2 hover:rotate-0 transition-all duration-500 ease-out">
            <img 
              src="/app-preview.png" 
              alt="ATS Optimizer Dashboard" 
              className="w-full h-auto rounded-lg shadow-inner border border-gray-100"
            />
          </div>

          {/* Decorative Elements behind the image */}
          <div className="absolute top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl -z-10 transform -rotate-2"></div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow z-20">
            <div className="bg-green-100 p-2 rounded-full">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ATS Score</p>
              <p className="text-xl font-bold text-green-600">98/100</p>
            </div>
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to get hired
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl shrink-0">✨</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Writing</h3>
                <p className="text-gray-600">Stuck on what to write? Our AI rewrites your messy notes into professional, corporate-ready bullet points instantly.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-bold mb-2">ATS Optimization</h3>
                <p className="text-gray-600">We analyze job descriptions and optimize your keywords so your CV passes the automated screening software.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl shrink-0">🇿🇦</div>
              <div>
                <h3 className="text-xl font-bold mb-2">SA Standard Format</h3>
                <p className="text-gray-600">Designed specifically for the South African market. Clean, concise, and formatted exactly how local recruiters want it.</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl shrink-0">🔒</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your data is saved securely. Download unlimited PDF versions or come back later to update your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROFESSIONAL FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          
          {/* LEFT: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold">ATS Optimizer</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering South African job seekers with AI tools to beat the bots and land more interviews.
            </p>
          </div>

          {/* MIDDLE: Contact & Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              {/* Email Link */}
              <li>
                <a href="mailto:naledimotaung901@gmail.com" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <span className="text-lg">✉️</span>
                  <span>naledimotaung901@gmail.com</span>
                </a>
              </li>
              
              {/* Phone Link */}
              <li>
                <a href="tel:0720251310" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <span>072 025 1310</span>
                </a>
              </li>

              {/* Divider Line */}
              <li className="border-t border-gray-800 my-2"></li>

              {/* Legal Links */}
              <li>
                <a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2">
                  <span>Privacy Policy</span>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">POPIA Ready</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-colors">Terms of Use</a>
              </li>
            </ul>
          </div>

          {/* RIGHT: Market Signal */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Market</h4>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🇿🇦</span>
                <span className="font-bold text-white">Built for South Africa</span>
              </div>
              <p className="text-xs text-gray-400">
                Optimized for local ATS standards used by major SA recruiters and corporations.
              </p>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} ATS Optimizer. All rights reserved.
        </div>
      </footer>

    </div>
  );
};