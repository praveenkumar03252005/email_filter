import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Mail, Send, Loader2, RefreshCw, AlertCircle, LayoutDashboard, AlertTriangle, CheckCircle, Database, Settings, LifeBuoy, BarChart3, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassificationResult {
  classification: 'SPAM' | 'NOT SPAM';
  reason: string;
  confidence: number;
}

export default function App() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to classify email');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-1 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-3 px-3 py-6 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">ShieldAI <span className="text-slate-400 font-normal">| Guard</span></h1>
        </div>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main Menu</div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md font-medium">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <AlertTriangle className="w-5 h-5" />
          Detected Spam
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <CheckCircle className="w-5 h-5" />
          Safe List
        </a>

        <div className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Intelligence</div>
        <div className="px-3 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Accuracy Rating</div>
          <div className="text-lg font-bold text-slate-800">99.4%</div>
          <div className="mt-2 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '99.4%' }}></div>
          </div>
        </div>

        <div className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">System</div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <LifeBuoy className="w-5 h-5" />
          Support
        </a>

        <div className="mt-auto p-4 bg-slate-900 rounded-xl text-white">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Status</div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-medium">System Online</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Groq Classification Engine</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              Llama 3 70B Active
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
              BK
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          {/* Stats Ribbon */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 bg-white">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-500 font-medium">Emails Analyzed</div>
                <Mail className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">1,429</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-red-100 group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-500 font-medium">Spam Intercepted</div>
                <AlertCircle className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-red-600 tracking-tight">382</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-500 font-medium">Processing Speed</div>
                <Clock className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-slate-900 tracking-tight">140ms <span className="text-xs font-normal text-slate-400">avg</span></div>
            </div>
          </div>

          <div className="p-8 max-w-5xl mx-auto">
            {/* Input Section */}
            <div className="mb-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Email Security Scan</h3>
                    <p className="text-sm text-slate-500">Paste your email content to analyze for potential threats.</p>
                  </div>
                  {content && (
                    <button 
                      onClick={handleReset}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Clear Workspace
                    </button>
                  )}
                </div>

                <div className="relative group">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter email content, including headers or just the body text..."
                    className="w-full h-80 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none outline-none mb-6 font-mono text-sm leading-relaxed"
                    id="email-input"
                  />
                  {!content && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      <div className="flex flex-col items-center gap-3">
                        <Mail className="w-12 h-12 text-slate-300" />
                        <span className="text-sm font-medium text-slate-400">Waiting for input...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{content.length > 0 ? `${content.length} chars` : 'Ready to analyze'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleClassify}
                    disabled={isLoading || !content.trim()}
                    className={`
                      flex items-center gap-3 px-10 py-4 rounded-xl font-bold transition-all shadow-md
                      ${!content.trim() 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95'}
                    `}
                    id="classify-button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Execute Filter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
              {(result || error) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex items-start gap-5 shadow-sm">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-red-900 text-lg mb-1">Scan Error</h3>
                        <p className="text-red-700 text-sm leading-relaxed max-w-lg">{error}</p>
                      </div>
                    </div>
                  ) : result && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className={`h-2 w-full ${result.classification === 'SPAM' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                      
                      <div className="p-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                          <div className="space-y-6 flex-1">
                            <div className="flex items-center gap-4">
                              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                                result.classification === 'SPAM' 
                                  ? 'bg-red-50 text-red-700 border-red-100' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                classification result
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className={`p-6 rounded-3xl ${result.classification === 'SPAM' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                                {result.classification === 'SPAM' ? (
                                  <ShieldAlert className="w-12 h-12 text-red-600" />
                                ) : (
                                  <ShieldCheck className="w-12 h-12 text-emerald-600" />
                                )}
                              </div>
                              <div>
                                <h2 className={`text-5xl font-black tracking-tighter ${result.classification === 'SPAM' ? 'text-red-700' : 'text-emerald-700'}`}>
                                  {result.classification}
                                </h2>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5" />
                                  Scan completed at {new Date().toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full md:w-64 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
                              <span className="text-lg font-bold text-slate-900">{(result.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.confidence * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${result.classification === 'SPAM' ? 'bg-red-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 text-center font-medium leading-tight">
                              Probability threshold met for automated action based on model parameters.
                            </p>
                          </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model Analysis Reason</span>
                          </div>
                          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 italic relative group">
                            <div className="absolute top-4 left-4 text-4xl text-slate-200 font-serif leading-none select-none">“</div>
                            <p className="text-slate-700 text-xl leading-relaxed relative z-10 pl-4 pr-4">
                              {result.reason}
                            </p>
                            <div className="absolute bottom-4 right-4 text-4xl text-slate-200 font-serif leading-none select-none rotate-180">“</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-12 bg-slate-50 border-t border-slate-200 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer transition-colors">
              <Database className="w-3 h-3" />
              Engine: Llama-3-70b-versatile
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Latency: 142ms
            </span>
            <span className="text-indigo-600 underline cursor-pointer hover:text-indigo-800 transition-colors">View API Logs</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            Status: Fully Synchronized
          </div>
        </footer>
      </main>
    </div>
  );
}
