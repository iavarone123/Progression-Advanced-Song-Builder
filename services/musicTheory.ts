
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
 * Movable Shape Templates (relative to their root string)
 */
const SHAPES = {
  MAJOR: [
    { name: 'E-shape', rootString: 6, frets: [0, 2, 2, 1, 0, 0] },
    { name: 'A-shape', rootString: 5, frets: ['x', 0, 2, 2, 2, 0] },
    { name: 'D-shape', rootString: 4, frets: ['x', 'x', 0, 2, 3, 2] },
    { name: 'C-shape', rootString: 5, frets: ['x', 3, 2, 0, 1, 0] },
  ],
  MINOR: [
    { name: 'Em-shape', rootString: 6, frets: [0, 2, 2, 0, 0, 0] },
    { name: 'Am-shape', rootString: 5, frets: ['x', 0, 2, 2, 1, 0] },
    { name: 'Dm-shape', rootString: 4, frets: ['x', 'x', 0, 2, 3, 1] },
    { name: 'Gm-shape', rootString: 6, frets: [3, 1, 0, 0, 3, 3] }, // Relative to root
  ],
  SEVENTH: [
    { name: 'E7-shape', rootString: 6, frets: [0, 2, 0, 1, 0, 0] },
    { name: 'A7-shape', rootString: 5, frets: ['x', 0, 2, 0, 2, 0] },
    { name: 'D7-shape', rootString: 4, frets: ['x', 'x', 0, 2, 1, 2] },
    { name: 'C7-shape', rootString: 5, frets: ['x', 3, 2, 3, 1, 'x'] },
  ],
  POWER: [
    { name: 'E-root', rootString: 6, frets: [0, 2, 2, 'x', 'x', 'x'] },
    { name: 'A-root', rootString: 5, frets: ['x', 0, 2, 2, 'x', 'x'] },
    { name: 'D-root', rootString: 4, frets: ['x', 'x', 0, 2, 2, 'x'] },
    { name: 'E-octave', rootString: 6, frets: [12, 14, 14, 'x', 'x', 'x'] },
  ]
};

/**
 * Finds the fret for a root note on a specific string
 */
const getFretForRoot = (root: Note, string: number): number => {
  const stringRoots: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];
  const stringRoot = stringRoots[6 - string];
  let fret = NOTES.indexOf(root) - NOTES.indexOf(stringRoot);
  while (fret < 0) fret += 12;
  return fret;
};

/**
 * Generates 4 distinct guitar positions based on music theory
 */
const generateVoicings = (chordName: string): Voicing[] => {
  const rootMatch = chordName.match(/^([A-G]#?)/);
  if (!rootMatch) return [];
  const root = rootMatch[1] as Note;
  const quality = chordName.substring(root.length).toLowerCase();

  const displayChord = chordName
    .replace(/m$/, ' Minor')
    .replace(/m(?=[0-9])/, ' Minor ')
    .replace(/dim$/, ' Diminished')
    .replace(/7$/, ' 7')
    .replace(/9$/, ' 9')
    .replace(/5$/, ' 5');

  let templates: any[] = [];
  if (quality === '5') templates = SHAPES.POWER;
  else if (quality.includes('7') || quality.includes('9')) templates = SHAPES.SEVENTH;
  else if (quality.includes('m')) templates = SHAPES.MINOR;
  else templates = SHAPES.MAJOR;

  const positions = ['one', 'two', 'three', 'four'];

  return templates.map((tpl, i) => {
    const rootFret = getFretForRoot(root, tpl.rootString);
    // For shapes like C-shape where the root is not the lowest fret of the template
    // we need to adjust the shift. In our SHAPES, the root is at the fret where '0' is in the template.
    const frets = tpl.frets.map((f: number | 'x') => {
      if (f === 'x') return 'x';
      return f + rootFret;
    });

    return {
      frets,
      description: `Position ${positions[i]} ${displayChord}`
    };
  }).sort((a, b) => {
    // Ensure they are actually in order of the neck positions
    const getMinFret = (v: Voicing) => Math.min(...v.frets.filter(f => typeof f === 'number') as number[]);
    return getMinFret(a) - getMinFret(b);
  });
};

/**
 * Builds a section's chord progression
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
