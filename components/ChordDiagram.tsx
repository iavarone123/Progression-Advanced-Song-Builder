
import React from 'react';
import { Voicing } from '../types';

interface ChordDiagramProps {
  voicing: Voicing;
  chordName: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ voicing, chordName }) => {
  const strings = 6;
  const numFretsVisible = 5;
  const marginX = 25;
  const marginY = 30;
  const width = 150;
  const height = 180;
  const fretHeight = (height - 2 * marginY) / numFretsVisible;
  const stringWidth = (width - 2 * marginX) / (strings - 1);

  // Calculate the starting fret for our window
  const numericFrets = voicing.frets.filter(f => typeof f === 'number' && f > 0) as number[];
  const minFret = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
  
  // Positional anchoring: if the chord is near the nut (0-4), start at 1.
  // Otherwise, start at the minFret to show the positional context.
  let baseFret = 1;
  if (minFret > 4) {
    baseFret = minFret;
  }

  return (
    <div className="flex flex-col items-center bg-white/[0.02] p-4 rounded-3xl border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/40 transition-all duration-500 group w-full">
      <div className="mb-4 text-center">
        {/* Chord name explicitly shown in each block as requested */}
        <div className="text-xl font-black text-white leading-none tracking-tighter mb-1">
          {chordName}
        </div>
        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
          {voicing.description}
        </div>
      </div>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-2xl overflow-visible">
        {/* Fret Labels - Mandatory for clear orientation */}
        {[...Array(numFretsVisible)].map((_, i) => (
          <text 
            key={`fret-label-${i}`} 
            x={5} 
            y={marginY + i * fretHeight + (fretHeight / 2) + 4} 
            fontSize="12" 
            fill={i === 0 ? "#3b82f6" : "rgba(255,255,255,0.2)"} 
            fontWeight="900" 
            textAnchor="start"
          >
            {baseFret + i}
          </text>
        ))}

        {/* Nut (thick line) or regular fret line */}
        {baseFret === 1 ? (
          <line x1={marginX} y1={marginY} x2={width - marginX} y2={marginY} stroke="white" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <line x1={marginX} y1={marginY} x2={width - marginX} y2={marginY} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        )}

        {/* Frets */}
        {[...Array(numFretsVisible + 1)].map((_, i) => (
          <line
            key={`fret-line-${i}`}
            x1={marginX}
            y1={marginY + i * fretHeight}
            x2={width - marginX}
            y2={marginY + i * fretHeight}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
        ))}

        {/* Strings */}
        {[...Array(strings)].map((_, i) => (
          <line
            key={`string-line-${i}`}
            x1={marginX + i * stringWidth}
            y1={marginY}
            x2={marginX + i * stringWidth}
            y2={marginY + numFretsVisible * fretHeight}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        ))}

        {/* Notes */}
        {voicing.frets.map((fret, stringIdx) => {
          const x = marginX + stringIdx * stringWidth;
          
          if (fret === 'x') {
            return (
              <text key={`x-mark-${stringIdx}`} x={x} y={marginY - 10} fill="#ef4444" fontSize="14" fontWeight="900" textAnchor="middle">
                ×
              </text>
            );
          }
          
          if (fret === 0) {
            return (
              <circle key={`open-mark-${stringIdx}`} cx={x} cy={marginY - 12} r="5" fill="none" stroke="#4ade80" strokeWidth="2.5" />
            );
          }

          // Calculate relative position within the 5-fret visible window
          const relativeFret = (fret as number) - baseFret + 1;
          
          // Safety: only render if it's within the diagram window
          if (relativeFret < 1 || relativeFret > numFretsVisible) return null;
          
          const y = marginY + (relativeFret - 1) * fretHeight + (fretHeight / 2);

          return (
            <g key={`note-mark-${stringIdx}`} className="group/note">
              <circle cx={x} cy={y} r="10" fill="#3b82f6" className="animate-in fade-in zoom-in duration-300 shadow-xl shadow-blue-500/20" />
              <text x={x} y={y + 3.5} fill="white" fontSize="9" fontWeight="900" textAnchor="middle" pointerEvents="none">
                {fret}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
