
import React, { useState, useEffect, useCallback } from 'react';
import { Note, ScaleType, Genre, Song } from './types';
import { NOTES } from './constants';
import { buildSection } from './services/musicTheory';
import SongSection from './components/SongSection';

const App: React.FC = () => {
  // Initialize state from URL if available
  const [key, setKey] = useState<Note>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('key') as Note) || 'C';
  });
  const [scale, setScale] = useState<ScaleType>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('scale') as ScaleType) || ScaleType.Major;
  });
  const [genre, setGenre] = useState<Genre>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('genre') as Genre) || Genre.Pop;
  });
  const [song, setSong] = useState<Song | null>(null);

  // Sync state to URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('key', key);
    url.searchParams.set('scale', scale);
    url.searchParams.set('genre', genre);
    window.history.replaceState({}, '', url);
  }, [key, scale, genre]);

  const generateSong = useCallback(() => {
    const newSong: Song = {
      key,
      scale,
      genre,
      verse: buildSection(key, scale, genre, 'Verse'),
      preChorus: buildSection(key, scale, genre, 'Pre-Chorus'),
      chorus: buildSection(key, scale, genre, 'Chorus'),
      bridge: buildSection(key, scale, genre, 'Bridge'),
    };
    setSong(newSong);
  }, [key, scale, genre]);

  const remixSection = (sectionKey: keyof Song) => {
    if (!song) return;
    const section = song[sectionKey];
    const title = (section as any).title || 'Section';
    const newSection = buildSection(key, scale, genre, title);
    setSong(prev => prev ? { ...prev, [sectionKey]: newSection } : null);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Progression: ${key} ${scale} ${genre} Masterwork`,
      text: `Check out this ${genre} chord progression architecture in ${key} ${scale}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! Share it to your mobile device or add to home screen.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  useEffect(() => {
    generateSong();
  }, [generateSong]);

  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/60 sticky top-0 z-50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-400 rounded-xl flex items-center justify-center font-black text-xl italic shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">PROGRESSION</h1>
              <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.3em] mt-1">Master Song Architect</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center">
              <label className="px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">Key</label>
              <select 
                value={key}
                onChange={(e) => setKey(e.target.value as Note)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {NOTES.map(n => <option key={n} value={n} className="bg-neutral-900">{n}</option>)}
              </select>
            </div>

            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            <div className="flex items-center">
              <label className="px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">Scale</label>
              <select 
                value={scale}
                onChange={(e) => setScale(e.target.value as ScaleType)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {Object.values(ScaleType).map(s => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
              </select>
            </div>

            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            <div className="flex items-center">
              <label className="px-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">Genre</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {Object.values(Genre).map(g => <option key={g} value={g} className="bg-neutral-900">{g}</option>)}
              </select>
            </div>

            <div className="flex gap-2 ml-1">
              <button 
                onClick={generateSong}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
              >
                Compose
              </button>
              <button 
                onClick={handleShare}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 group"
                title="Share Song"
              >
                <svg className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {!song ? (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-10 shadow-[0_0_50px_rgba(59,130,246,0.2)]"></div>
            <p className="text-2xl font-black italic text-gray-400 tracking-tight animate-pulse">Calculating Harmonic Structures...</p>
          </div>
        ) : (
          <div className="space-y-24">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-10 bg-blue-500" />
                <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Project Blueprint</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                {genre} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Masterwork</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-2xl leading-relaxed font-medium">
                Deep theory-driven {genre} composition in <span className="text-white font-black">{key} {scale}</span>. 
                Below you'll find logically sequenced guitar neck positions for every chord.
              </p>
            </div>

            <div className="space-y-16">
              <SongSection section={song.verse} onRemix={() => remixSection('verse')} />
              <SongSection section={song.preChorus} onRemix={() => remixSection('preChorus')} />
              <SongSection section={song.chorus} onRemix={() => remixSection('chorus')} />
              <SongSection section={song.bridge} onRemix={() => remixSection('bridge')} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-16 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-center">
            <div>
              <h4 className="text-lg font-black mb-1 tracking-tighter">PROGRESSION</h4>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase italic">Music Theory Algorithm v4.2</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.8em]">PWA Enabled • Add to Home Screen</p>
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
               </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-gray-500 font-black tracking-widest uppercase">Positional Voicing Engine</p>
              <p className="text-[9px] text-gray-700 font-bold mt-1">MOBILE SYNC • PURE THEORY • NO AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
