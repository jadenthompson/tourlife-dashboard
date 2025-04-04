import { useState } from 'react';
import { Send, Bot, Moon, Plane } from 'lucide-react';
import supabase from '../supabaseClient';

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (prompt = input) => {
    if (!prompt.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://jorantgixpsjetsyujkl.functions.supabase.co/askAssistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt, contextData: "" }),
      });
      

      const data = await res.json();

      if (data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        throw new Error("No reply received");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "❌ Sorry, I couldn't process your request. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5" /> AI Assistant
      </h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleSend("When should I sleep?")}
          className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          <Moon className="w-4 h-4" /> Sleep Time
        </button>
        <button
          onClick={() => handleSend("Optimize my travel")}
          className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          <Plane className="w-4 h-4" /> Travel Tips
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
                : 'bg-white dark:bg-zinc-800 mr-auto max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gray-50 dark:bg-zinc-900">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your tour..."
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-800"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
