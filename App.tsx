
import React, { useState, useEffect, useCallback } from 'react';
import { Note, ScaleType, Genre, Song } from './types';
import { NOTES } from './constants';
import { buildSection } from './services/musicTheory';
import SongSection from './components/SongSection';

const App: React.FC = () => {
  const [key, setKey] = useState<Note>('C');
  const [scale, setScale] = useState<ScaleType>(ScaleType.Major);
  const [genre, setGenre] = useState<Genre>(Genre.Pop);
  const [song, setSong] = useState<Song | null>(null);

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

  useEffect(() => {
    generateSong();
  }, [generateSong]);

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 sticky top-0 z-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 group cursor-default">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-700 via-blue-500 to-cyan-400 rounded-[1.2rem] flex items-center justify-center font-black text-3xl italic shadow-2xl shadow-blue-500/30 group-hover:rotate-3 transition-all duration-500">
              P
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">PRO-GRESSION</h1>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] leading-none">Advanced Harmonic Architect</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 bg-white/[0.03] p-2 rounded-[1.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center">
              <label className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Key</label>
              <select 
                value={key}
                onChange={(e) => setKey(e.target.value as Note)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {NOTES.map(n => <option key={n} value={n} className="bg-neutral-900">{n}</option>)}
              </select>
            </div>

            <div className="w-px h-6 bg-white/10" />

            <div className="flex items-center">
              <label className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Scale</label>
              <select 
                value={scale}
                onChange={(e) => setScale(e.target.value as ScaleType)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {Object.values(ScaleType).map(s => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
              </select>
            </div>

            <div className="w-px h-6 bg-white/10" />

            <div className="flex items-center">
              <label className="px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">Genre</label>
              <select 
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
                className="bg-transparent text-sm font-black focus:outline-none pr-4 cursor-pointer hover:text-blue-400 transition-colors"
              >
                {Object.values(Genre).map(g => <option key={g} value={g} className="bg-neutral-900">{g}</option>)}
              </select>
            </div>

            <button 
              onClick={generateSong}
              className="ml-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2"
            >
              Compose Masterwork
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!song ? (
          <div className="flex flex-col items-center justify-center py-48">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute top-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-10 text-2xl font-black italic text-gray-500 tracking-tight animate-pulse uppercase">Synthesizing Diatonic Structures...</p>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="max-w-5xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="h-[2px] w-10 bg-blue-500" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em]">Composition Blueprint</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-black mb-8 leading-[0.8] tracking-tighter uppercase italic">
                {genre} <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-cyan-400 to-white">Session</span>
              </h2>
              <p className="text-gray-400 text-xl md:text-3xl leading-tight font-medium max-w-3xl">
                Dynamic {genre} architecture in <span className="text-white font-black">{key} {scale}</span>. 
                Using style-accurate intervals and positional guitar voicings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              <SongSection section={song.verse} onRemix={() => remixSection('verse')} />
              <SongSection section={song.preChorus} onRemix={() => remixSection('preChorus')} />
              <SongSection section={song.chorus} onRemix={() => remixSection('chorus')} />
              <SongSection section={song.bridge} onRemix={() => remixSection('bridge')} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-24 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left items-start">
            <div>
              <h4 className="text-xl font-black mb-4 tracking-tighter">PRO-GRESSION</h4>
              <p className="text-xs text-gray-600 font-bold tracking-widest uppercase italic max-w-xs">
                A mathematical approach to musical harmony, leveraging authentic style-specific chord progressions and music theory.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-6">
               <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.8em]">Theory Algorithm v5.0</p>
               <div className="flex gap-6">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
               </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-gray-500 font-black tracking-widest uppercase mb-2">Architectural Harmonic Engine</p>
              <p className="text-[10px] text-gray-700 font-bold">100% DIATONIC ACCURACY • MULTI-LENGTH SEQUENCES • PRO VOICINGS</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
