import React from 'react';

import supabase from '../supabaseClient';

import { useState } from 'react';

export default function Assistant() {
  const [aiResponse, setAiResponse] = useState('');

  const handleAssistantClick = async (prompt) => {
    setAiResponse("🤖 Thinking...");

    try {
      const res = await fetch("https://jorantgixpsjetsyujkl.functions.supabase.co/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setAiResponse(`🤖 ${data.reply}`);
    } catch (error) {
      console.error("AI error:", error);
      setAiResponse("❌ Error getting response.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      <div className="space-y-3">
        <button
          onClick={() => handleAssistantClick("When should I sleep?")}
          className="w-full text-left px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
        >
          🛏️ When should I sleep?
        </button>

        <button
          onClick={() => handleAssistantClick("Optimize my travel")}
          className="w-full text-left px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
        >
          ✈️ Optimize my travel
        </button>

        <button
          onClick={() => handleAssistantClick("Summarize today")}
          className="w-full text-left px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
        >
          📋 Summarize today
        </button>

        {aiResponse && (
          <div className="mt-4 text-sm bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
}
