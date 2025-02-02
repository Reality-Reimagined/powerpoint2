import React, { useState } from 'react';
import {
  Send,
  Calculator,
  Code,
  Bug,
  Zap,
  TestTube,
  FileCode2,
  RefreshCw,
  Shield,
  FileText,
  Languages,
  Brain,
  Loader2,
  MessageSquare,
  Heart,
  Key,
  Search,
  Image,
  FileJson,
  Database,
  Terminal,
  GitBranch,
  PenTool,
  Workflow,
  Bot,
  Settings,
  Sparkles
} from 'lucide-react';
import { processQuery } from './lib/agent';

// Tool categories and their associated tools
const toolCategories = [
  {
    name: 'Code Development',
    icon: <Code className="w-5 h-5" />,
    description: 'Tools for writing, analyzing, and improving code',
    tools: [
      { id: 'codeAssistant', name: 'Code Assistant', icon: <Code className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', description: 'Generate code in any programming language' },
      { id: 'debugCode', name: 'Debug Code', icon: <Bug className="w-4 h-4" />, color: 'bg-red-100 text-red-800', description: 'Find and fix bugs in your code' },
      { id: 'optimizeCode', name: 'Optimize Code', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800', description: 'Improve code performance' },
      { id: 'refactorCode', name: 'Code Refactorer', icon: <RefreshCw className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', description: 'Restructure and improve code quality' }
    ]
  },
  {
    name: 'Code Analysis',
    icon: <Search className="w-5 h-5" />,
    description: 'Tools for understanding and documenting code',
    tools: [
      { id: 'explainCode', name: 'Code Explainer', icon: <FileCode2 className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-800', description: 'Get detailed code explanations' },
      { id: 'generateTestCases', name: 'Test Generator', icon: <TestTube className="w-4 h-4" />, color: 'bg-green-100 text-green-800', description: 'Create comprehensive test cases' },
      { id: 'securityAudit', name: 'Security Audit', icon: <Shield className="w-4 h-4" />, color: 'bg-rose-100 text-rose-800', description: 'Identify security vulnerabilities' },
      { id: 'documentCode', name: 'Documentation', icon: <FileText className="w-4 h-4" />, color: 'bg-sky-100 text-sky-800', description: 'Generate code documentation' }
    ]
  },
  {
    name: 'Data & APIs',
    icon: <Database className="w-5 h-5" />,
    description: 'Tools for working with data and APIs',
    tools: [
      { id: 'convertCode', name: 'Code Converter', icon: <Languages className="w-4 h-4" />, color: 'bg-teal-100 text-teal-800', description: 'Convert between programming languages' },
      { id: 'generateAPI', name: 'API Generator', icon: <Terminal className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-800', description: 'Create API endpoints and documentation' },
      { id: 'parseJSON', name: 'JSON Parser', icon: <FileJson className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-800', description: 'Parse and validate JSON data' },
      { id: 'dbQueries', name: 'DB Assistant', icon: <Database className="w-4 h-4" />, color: 'bg-violet-100 text-violet-800', description: 'Generate database queries' }
    ]
  },
  {
    name: 'DevOps & Git',
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Tools for development operations',
    tools: [
      { id: 'gitCommit', name: 'Commit Messages', icon: <GitBranch className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800', description: 'Generate meaningful commit messages' },
      { id: 'cicdPipeline', name: 'CI/CD Config', icon: <Workflow className="w-4 h-4" />, color: 'bg-lime-100 text-lime-800', description: 'Create CI/CD pipeline configurations' },
      { id: 'dockerConfig', name: 'Docker Setup', icon: <Settings className="w-4 h-4" />, color: 'bg-fuchsia-100 text-fuchsia-800', description: 'Generate Docker configurations' },
      { id: 'envSetup', name: 'Env Setup', icon: <Terminal className="w-4 h-4" />, color: 'bg-pink-100 text-pink-800', description: 'Configure development environments' }
    ]
  },
  {
    name: 'AI & ML',
    icon: <Brain className="w-5 h-5" />,
    description: 'Artificial Intelligence and Machine Learning tools',
    tools: [
      { id: 'promptEngineer', name: 'Prompt Engineer', icon: <PenTool className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', description: 'Create effective AI prompts' },
      { id: 'modelSelect', name: 'Model Selector', icon: <Bot className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', description: 'Choose the right AI model' },
      { id: 'dataPrep', name: 'Data Prep', icon: <Database className="w-4 h-4" />, color: 'bg-green-100 text-green-800', description: 'Prepare data for ML models' },
      { id: 'modelTuning', name: 'Model Tuning', icon: <Settings className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800', description: 'Optimize ML model parameters' }
    ]
  },
  {
    name: 'Content & Analysis',
    icon: <FileText className="w-5 h-5" />,
    description: 'Tools for content creation and analysis',
    tools: [
      { id: 'summarize', name: 'Text Summarizer', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-lime-100 text-lime-800', description: 'Generate concise summaries' },
      { id: 'sentiment', name: 'Sentiment Analysis', icon: <Heart className="w-4 h-4" />, color: 'bg-pink-100 text-pink-800', description: 'Analyze text sentiment' },
      { id: 'keywords', name: 'Keyword Extractor', icon: <Key className="w-4 h-4" />, color: 'bg-cyan-100 text-cyan-800', description: 'Extract key terms from text' },
      { id: 'translate', name: 'Translator', icon: <Languages className="w-4 h-4" />, color: 'bg-violet-100 text-violet-800', description: 'Translate between languages' }
    ]
  }
];

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    for (const category of toolCategories) {
      const tool = category.tools.find(t => t.id === route);
      if (tool) return tool.icon;
    }
    return <Brain className="w-5 h-5" />;
  };

  const getToolColor = (route: string) => {
    for (const category of toolCategories) {
      const tool = category.tools.find(t => t.id === route);
      if (tool) return tool.color;
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    const tool = toolCategories.flatMap(c => c.tools).find(t => t.id === toolId);
    if (tool) {
      setQuery(`Use the ${tool.name} to `);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">AI Agent Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Your comprehensive AI toolkit for development and analysis</p>
          
          {/* Tool Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {toolCategories.map((category) => (
              <div 
                key={category.name}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  selectedCategory === category.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {category.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToolSelect(tool.id);
                      }}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors duration-200 hover:opacity-80 ${
                        selectedTool === tool.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      } ${tool.color}`}
                      title={tool.description}
                    >
                      {tool.icon}
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Query Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything or select a tool above..."
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

        {/* Conversation History */}
        <div className="space-y-6">
          {conversations.map((conv, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
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
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{conv.response}</p>
                    </div>
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