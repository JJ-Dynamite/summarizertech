'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('detailed');

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, style }),
      });
      const data = await res.json();
      if (data.success) setSummary(data.data);
    } catch (error) {
      console.error('Summarize failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">📝</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Summarizer Tech
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Summarize any YouTube video with AI</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleSummarize}
              disabled={!url || loading}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Summarizing...' : '📝 Summarize'}
            </button>
          </div>
          <div className="flex gap-3">
            {['brief', 'detailed', 'key-points'].map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  style === s
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {summary && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">▶️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{summary.title}</h2>
                  <p className="text-gray-400">{summary.channel} • {summary.duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-bold text-red-400 mb-4">AI Summary</h3>
              <p className="text-gray-200 leading-relaxed">{summary.summary}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-bold text-red-400 mb-4">Key Points</h3>
              <ul className="space-y-3">
                {summary.key_points.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-bold text-red-400 mb-4">Timestamps</h3>
              <div className="space-y-2">
                {summary.timestamps.map((ts: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg">
                    <span className="font-mono text-red-400 w-16">{ts.time}</span>
                    <span className="text-gray-300">{ts.topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700 text-center">
                <p className="text-2xl font-bold text-red-400">{summary.word_count.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Words</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700 text-center">
                <p className="text-2xl font-bold text-orange-400">{summary.timestamps.length}</p>
                <p className="text-gray-400 text-sm">Sections</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700 text-center">
                <p className="text-2xl font-bold text-yellow-400">90%</p>
                <p className="text-gray-400 text-sm">Time Saved</p>
              </div>
            </div>
          </div>
        )}

        {!summary && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold">Save Time</h3>
              <p className="text-gray-400 text-sm">Get key info in minutes</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Accurate</h3>
              <p className="text-gray-400 text-sm">AI-powered analysis</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold">Timestamps</h3>
              <p className="text-gray-400 text-sm">Navigate easily</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
