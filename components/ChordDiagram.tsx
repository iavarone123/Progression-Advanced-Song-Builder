
import React from 'react';
import { Voicing } from '../types';

interface ChordDiagramProps {
  voicing: Voicing;
  chordName: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ voicing, chordName }) => {
  const strings = 6;
  const frets = 5;
  const margin = 20;
  const width = 140;
  const height = 180;
  const fretHeight = (height - 2 * margin - 10) / frets;
  const stringWidth = (width - 2 * margin) / (strings - 1);

  // Determine the display window for the chord
  const numericFretsIgnoringOpen = voicing.frets.filter(f => typeof f === 'number' && f > 0) as number[];
  const minFret = numericFretsIgnoringOpen.length > 0 ? Math.min(...numericFretsIgnoringOpen) : 0;
  
  // baseFret is 0 if any notes are in the first 4 frets, otherwise it's the minFret
  const baseFret = minFret > 4 ? minFret : 0;

  return (
    <div className="flex flex-col items-center bg-white/[0.02] p-3 rounded-2xl border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 group w-full">
      <span className="text-[10px] text-gray-400 mb-3 uppercase font-black tracking-widest group-hover:text-blue-400 transition-colors text-center w-full px-1 leading-tight">
        {voicing.description}
      </span>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-2xl">
        {/* Nut or base fret indicator */}
        {baseFret > 0 ? (
          <>
            <text x={width - 15} y={margin + 12} fontSize="11" fill="#94a3b8" fontWeight="900" textAnchor="start">
              {baseFret}
            </text>
            {/* Top thin line for high position boxes */}
            <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          </>
        ) : (
          /* Thick Nut for open position */
          <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="white" strokeWidth="4" />
        )}

        {/* Fret Wires (Horizontal Lines) */}
        {[...Array(frets + 1)].map((_, i) => (
          <line
            key={`fret-${i}`}
            x1={margin}
            y1={margin + i * fretHeight}
            x2={width - margin}
            y2={margin + i * fretHeight}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
        ))}

        {/* Strings (Vertical Lines) */}
        {[...Array(strings)].map((_, i) => (
          <line
            key={`string-${i}`}
            x1={margin + i * stringWidth}
            y1={margin}
            x2={margin + i * stringWidth}
            y2={margin + frets * fretHeight}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
          />
        ))}

        {/* Note Markers */}
        {voicing.frets.map((fret, stringIdx) => {
          const x = margin + stringIdx * stringWidth;
          
          if (fret === 'x') {
            return (
              <text key={`x-${stringIdx}`} x={x} y={margin - 8} fill="#ef4444" fontSize="14" fontWeight="900" textAnchor="middle">
                ×
              </text>
            );
          }
          
          if (fret === 0) {
            return (
              <circle key={`open-${stringIdx}`} cx={x} cy={margin - 10} r="4" fill="none" stroke="#4ade80" strokeWidth="2" />
            );
          }

          // Calculate vertical position relative to the base fret window
          // If baseFret is 5, fret 5 is the first space (relative k = 1)
          // If baseFret is 0, fret 1 is the first space (relative k = 1)
          const relativeFret = (fret as number) - (baseFret === 0 ? 0 : baseFret - 1);
          
          // Only render if it fits in the 5-fret diagram window
          if (relativeFret < 1 || relativeFret > frets) return null;
          
          // Center the note exactly in the middle of the fret space
          const y = margin + (relativeFret - 0.5) * fretHeight;

          return (
            <g key={`note-${stringIdx}`}>
              {/* Note marker centered on the string (vertical line) and between fret wires */}
              <circle cx={x} cy={y} r="8" fill="#3b82f6" className="animate-in fade-in zoom-in duration-500 shadow-xl" />
              <circle cx={x} cy={y} r="3" fill="white" fillOpacity="0.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
