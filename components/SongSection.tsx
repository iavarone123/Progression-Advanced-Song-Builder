
import React from 'react';
import { Section } from '../types';
import ChordDiagram from './ChordDiagram';

interface SongSectionProps {
  section: Section;
  onRemix: () => void;
}

const SongSection: React.FC<SongSectionProps> = ({ section, onRemix }) => {
  return (
    <div className="glass p-6 md:p-10 rounded-[2.5rem] mb-16 border border-white/10 shadow-2xl relative overflow-hidden transition-all hover:border-white/20">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 blur-[100px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-4xl font-black tracking-tight text-white italic uppercase">
              {section.title}
            </h3>
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border border-white/10">
              {section.chords.length} Chord Unit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-400 font-medium">
              Structure: <span className="text-blue-400 font-bold">{section.chords.map(c => c.name).join(' — ')}</span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={onRemix}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all text-sm font-black active:scale-95 shadow-xl backdrop-blur-xl text-blue-400"
        >
          <svg className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate {section.title}
        </button>
      </div>

      {/* Column-based Matrix Layout with Horizontal Scroll */}
      <div className="relative z-10 overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {section.chords.map((chord, chordIdx) => (
            <div key={`${section.title}-col-${chordIdx}`} className="flex flex-col gap-6 w-64">
              {/* Chord Header Column */}
              <div className="flex flex-col items-center text-center p-6 bg-white/[0.03] rounded-3xl border border-white/5 mb-2 hover:bg-white/[0.06] transition-colors cursor-default">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">
                  Step {chordIdx + 1} • {chord.romanNumeral}
                </span>
                <h4 className="text-3xl font-black text-white mb-2 tracking-tighter">
                  {chord.name}
                </h4>
                <div className="h-1 w-12 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />
              </div>

              {/* Vertical Voicings Column */}
              <div className="flex flex-col gap-4">
                {chord.voicings.slice(0, 4).map((voicing, vIdx) => (
                  <ChordDiagram 
                    key={`voicing-${chord.name}-${vIdx}`} 
                    voicing={voicing} 
                    chordName={chord.name} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section End Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center px-4">
        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.5em]">
          End Sequence
        </span>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
        </div>
      </div>
    </div>
  );
};

export default SongSection;
