import React, { useState } from 'react';
import { Send, Calculator, Cloud, Brain, Loader2, Languages, Ruler } from 'lucide-react';
import { processQuery } from './lib/agent';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Array<{
    query: string;
    route: string;
    response: string | null;
    error: string | null;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    const result = await processQuery(query);
    setConversations(prev => [...prev, result]);
    setQuery('');
    setLoading(false);
  };

  const getToolIcon = (route: string) => {
    switch (route) {
      case 'calculate':
        return <Calculator className="w-5 h-5" />;
      case 'weather':
        return <Cloud className="w-5 h-5" />;
      case 'translate':
        return <Languages className="w-5 h-5" />;
      case 'convert':
        return <Ruler className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getToolColor = (route: string) => {
    switch (route) {
      case 'calculate':
        return 'bg-purple-100 text-purple-800';
      case 'weather':
        return 'bg-blue-100 text-blue-800';
      case 'translate':
        return 'bg-green-100 text-green-800';
      case 'convert':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Agent Platform</h1>
          <p className="text-xl text-gray-600 mb-4">Ask anything - I'll use the right tools to help you</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm flex items-center gap-1">
              <Calculator className="w-4 h-4" /> Calculator
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm flex items-center gap-1">
              <Cloud className="w-4 h-4" /> Weather
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm flex items-center gap-1">
              <Languages className="w-4 h-4" /> Translator
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm flex items-center gap-1">
              <Ruler className="w-4 h-4" /> Unit Converter
            </span>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question (e.g., calculate 25 * 4, weather in London, translate Hello to Spanish)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 transition-colors duration-200"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {loading ? 'Processing...' : 'Send'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {conversations.map((conv, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-1">You</p>
                  <p className="text-gray-700 text-lg">{conv.query}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getToolColor(conv.route)}`}>
                  {getToolIcon(conv.route)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-900 font-medium">Assistant</p>
                    {conv.route !== 'none' && conv.route !== 'error' && (
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getToolColor(conv.route)}`}>
                        {getToolIcon(conv.route)}
                        Using {conv.route} tool
                      </span>
                    )}
                  </div>
                  {conv.error ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                      <p className="font-medium">Error</p>
                      <p>{conv.error}</p>
                    </div>
                  ) : (
                    <p className="text-gray-700 text-lg whitespace-pre-wrap">{conv.response}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;