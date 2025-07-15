import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl w-full max-w-md shadow-2xl border border-slate-700/50" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white text-center">Enter Gemini API Key</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-400 text-center">
            To use the AI prediction features, you need to provide a Google Gemini API key. You can get a free key from Google AI Studio.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your API key here"
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-center focus:ring-2 focus:ring-brand-yellow focus:outline-none"
          />
           <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-sky-400 hover:text-sky-300">
            Get your Gemini API Key &rarr;
          </a>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-end items-center gap-4">
            <button onClick={onClose} className="bg-transparent hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-brand-red hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition-colors">Save Key</button>
        </div>
      </div>
    </div>
  );
};