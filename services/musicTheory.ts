
import { Note, ScaleType, Genre, ChordData, Voicing, Section } from '../types';
import { NOTES, SCALE_INTERVALS, GENRE_PATTERNS } from '../constants';

/**
 * Gets the note at a specific interval from a root
 */
const getNoteAtInterval = (root: Note, interval: number): Note => {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = (rootIndex + interval) % 12;
  return NOTES[targetIndex];
};

/**
 * Gets all notes in a specific scale
 */
export const getScaleNotes = (root: Note, scale: ScaleType): Note[] => {
  const intervals = SCALE_INTERVALS[scale];
  return intervals.map(interval => getNoteAtInterval(root, interval));
};

/**
 * Maps scale degrees to Roman Numerals
 */
const getRomanNumeral = (degree: number, scale: ScaleType): string => {
  const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
  
  if (scale === ScaleType.Major) return majorNumerals[degree - 1] || `${degree}`;
  if (scale === ScaleType.Minor) return minorNumerals[degree - 1] || `${degree}`;
  
  const standard = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  return standard[degree - 1] || `${degree}`;
};

/**
 * Helper to shift fret numbers for different roots.
 * Ensures the voicing stays in a playable range on the neck.
 */
const shiftFrets = (frets: (number | 'x')[], offset: number): (number | 'x')[] => {
  // Find a version of this offset that keeps the chord in a standard range (0-12)
  let normalizedOffset = offset;
  while (normalizedOffset < 0) normalizedOffset += 12;
  
  return frets.map(f => {
    if (f === 'x') return 'x';
    return (f + normalizedOffset);
  });
};

/**
 * Voicing generator providing 4 distinct positions.
 * Descriptions are strictly "Position [Word] [ChordName]".
 * Templates are carefully curated for accuracy.
 */
const generateVoicings = (chordName: string): Voicing[] => {
  const rootMatch = chordName.match(/^([A-G]#?)/);
  if (!rootMatch) return [];
  const root = rootMatch[1] as Note;
  const rootIdx = NOTES.indexOf(root);
  const quality = chordName.substring(root.length).toLowerCase();

  const offset = rootIdx;
  const displayChord = chordName
    .replace(/m$/, ' minor')
    .replace(/m(?=[0-9])/, ' minor ')
    .replace(/dim$/, ' diminished')
    .replace(/dom7$/, ' 7')
    .replace(/7$/, ' 7')
    .replace(/9$/, ' 9')
    .replace(/5$/, ' 5');

  // Templates are defined relative to 'C' (offset 0)
  
  if (quality === '5') { // Power Chords
    return [
      { frets: shiftFrets([0, 2, 2, 'x', 'x', 'x'], offset), description: `Position one ${chordName}` }, // E string root
      { frets: shiftFrets(['x', 0, 2, 2, 'x', 'x'], offset), description: `Position two ${chordName}` }, // A string root
      { frets: shiftFrets([0, 2, 2, 'x', 'x', 'x'], offset + 12), description: `Position three ${chordName}` }, // High octave E
      { frets: shiftFrets(['x', 0, 2, 2, 'x', 'x'], offset + 12), description: `Position four ${chordName}` }, // High octave A
    ];
  }

  if (quality.includes('m') && !quality.includes('dim')) { // Minor Chords
    return [
      { frets: shiftFrets(['x', 0, 2, 2, 1, 0], offset), description: `Position one ${displayChord}` }, // Am Shape
      { frets: shiftFrets([0, 2, 2, 0, 0, 0], offset + 8), description: `Position two ${displayChord}` }, // Em Shape
      { frets: shiftFrets(['x', 'x', 0, 2, 3, 1], offset + 10), description: `Position three ${displayChord}` }, // Dm Shape
      { frets: shiftFrets(['x', 0, 2, 2, 1, 0], offset + 12), description: `Position four ${displayChord}` }, // Octave Position 1
    ];
  }

  if (quality.includes('7') || quality.includes('9')) { // Jazz/Extended
    return [
      { frets: shiftFrets(['x', 3, 2, 3, 3, 'x'], offset - 3), description: `Position one ${chordName}` }, // A7/9 Shape
      { frets: shiftFrets([3, 'x', 3, 4, 3, 'x'], offset - 3), description: `Position two ${chordName}` }, // E7 Shape
      { frets: shiftFrets(['x', 'x', 0, 1, 1, 0], offset), description: `Position three ${chordName}` }, // D7 Shape
      { frets: shiftFrets(['x', 3, 2, 3, 3, 'x'], offset + 9), description: `Position four ${chordName}` }, // High Pos
    ];
  }

  if (quality.includes('dim')) { // Diminished
    return [
      { frets: shiftFrets(['x', 0, 1, 2, 1, 'x'], offset), description: `Position one ${displayChord}` },
      { frets: shiftFrets([1, 'x', 0, 1, 1, 'x'], offset - 1), description: `Position two ${displayChord}` },
      { frets: shiftFrets(['x', 'x', 1, 2, 1, 2], offset - 1), description: `Position three ${displayChord}` },
      { frets: shiftFrets(['x', 3, 4, 2, 4, 'x'], offset - 3), description: `Position four ${displayChord}` },
    ];
  }

  // Default: Major Triads (CAGED)
  return [
    { frets: shiftFrets(['x', 0, 2, 2, 2, 0], offset), description: `Position one ${chordName}` }, // A Shape
    { frets: shiftFrets([0, 2, 2, 1, 0, 0], offset + 8), description: `Position two ${chordName}` }, // E Shape
    { frets: shiftFrets(['x', 'x', 0, 2, 3, 2], offset + 10), description: `Position three ${chordName}` }, // D Shape
    { frets: shiftFrets(['x', 0, 2, 2, 2, 0], offset + 12), description: `Position four ${chordName}` }, // Octave A
  ];
};

/**
 * Builds a section's chord progression with music theory labels
 */
export const buildSection = (
  root: Note, 
  scale: ScaleType, 
  genre: Genre, 
  title: string
): Section => {
  const scaleNotes = getScaleNotes(root, scale);
  const patternInfo = GENRE_PATTERNS[genre];
  const progressions = patternInfo.progressions;
  const prog = progressions[Math.floor(Math.random() * progressions.length)];

  const chords: ChordData[] = prog.map(degree => {
    const note = scaleNotes[(degree - 1) % scaleNotes.length];
    
    let quality = '';
    if (scale === ScaleType.Major) {
      if ([2, 3, 6].includes(degree)) quality = 'm';
      if (degree === 7) quality = 'dim';
    } else if (scale === ScaleType.Minor) {
      if ([1, 4, 5].includes(degree)) quality = 'm';
      if (degree === 2) quality = 'dim';
    }

    if (patternInfo.chordType === '7th') quality += '7';
    if (patternInfo.chordType === '9th') quality += '9';
    if (patternInfo.chordType === 'dom7') quality = '7';
    if (patternInfo.chordType === 'power') quality = '5';

    const chordName = `${note}${quality}`;
    return {
      name: chordName,
      romanNumeral: getRomanNumeral(degree, scale),
      voicings: generateVoicings(chordName)
    };
  });

  return { title, chords };
};
