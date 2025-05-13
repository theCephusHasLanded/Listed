import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Listed from '../listed';

const DemoPage: React.FC = () => {
  const [mode, setMode] = useState<'production' | 'demo'>('demo');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Controls */}
      <div className="bg-indigo-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Listed Demo Mode</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setMode('demo')}
              className={`px-4 py-2 rounded-md ${mode === 'demo' ? 'bg-indigo-800' : 'bg-indigo-700 hover:bg-indigo-800'}`}
            >
              Demo UI
            </button>
            <button 
              onClick={() => setMode('production')}
              className={`px-4 py-2 rounded-md ${mode === 'production' ? 'bg-indigo-800' : 'bg-indigo-700 hover:bg-indigo-800'}`}
            >
              Return to Main App
            </button>
            <Link to="/" className="px-4 py-2 rounded-md bg-indigo-700 hover:bg-indigo-800">
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {mode === 'demo' ? (
        <Listed />
      ) : (
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">You've exited Demo Mode</h2>
          <p className="mb-6">You are now in the main production application.</p>
          <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Go to Home Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default DemoPage;