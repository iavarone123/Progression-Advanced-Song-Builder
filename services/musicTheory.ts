
import { Note, ScaleType, Genre, ChordData, Voicing, Section } from '../types';
import { NOTES, SCALE_INTERVALS, GENRE_PATTERNS } from '../constants';

const getNoteAtInterval = (root: Note, interval: number): Note => {
  const rootIndex = NOTES.indexOf(root);
  const targetIndex = (rootIndex + interval) % 12;
  return NOTES[targetIndex] as Note;
};

export const getScaleNotes = (root: Note, scale: ScaleType): Note[] => {
  const intervals = SCALE_INTERVALS[scale];
  return intervals.map(interval => getNoteAtInterval(root, interval));
};

const getRomanNumeral = (degree: number, scale: ScaleType): string => {
  const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
  if (scale === ScaleType.Major) return majorNumerals[(degree - 1) % 7] || `${degree}`;
  if (scale === ScaleType.Minor || scale === ScaleType.PhrygianDominant) return minorNumerals[(degree - 1) % 7] || `${degree}`;
  const standard = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  return standard[(degree - 1) % 7] || `${degree}`;
};

/**
 * Positional Voicing Engine
 * Calculates unique chord fingerings across the neck and sorts them Nut-to-Bridge.
 */
const generateVoicings = (chordName: string): Voicing[] => {
  const rootMatch = chordName.match(/^([A-G]#?)/);
  if (!rootMatch) return [];
  const root = rootMatch[1] as Note;
  const quality = chordName.substring(root.length);

  const candidates: { frets: (number | 'x')[], minFret: number }[] = [];

  const getFretForNote = (stringRoot: Note, targetNote: Note) => {
    let fret = NOTES.indexOf(targetNote) - NOTES.indexOf(stringRoot);
    while (fret < 0) fret += 12;
    return fret;
  };

  const addPositionalVoicing = (shapeFrets: (number | 'x')[], rootString: number) => {
    const stringRoots: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];
    const targetRootStringNote = stringRoots[rootString];
    let baseFret = getFretForNote(targetRootStringNote, root);
    
    // Create the voicing
    const finalFrets = shapeFrets.map(f => (f === 'x' ? 'x' : f + baseFret));
    
    // Validate bounds
    if (finalFrets.every(f => f === 'x' || (f >= 0 && f <= 16))) {
      const activeFrets = finalFrets.filter(f => typeof f === 'number' && f > 0) as number[];
      const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0;
      candidates.push({ frets: finalFrets as (number | 'x')[], minFret });
    }
    
    // Also try an octave higher if it fits on a standard guitar neck (up to fret 22)
    const octaveFrets = finalFrets.map(f => (f === 'x' ? 'x' : (f as number) + 12));
    if (octaveFrets.every(f => f === 'x' || (f >= 0 && f <= 22))) {
      const activeOct = octaveFrets.filter(f => typeof f === 'number' && f > 0) as number[];
      if (activeOct.length > 0) {
        candidates.push({ frets: octaveFrets as (number | 'x')[], minFret: Math.min(...activeOct) });
      }
    }
  };

  // Build standard positional shapes based on quality
  if (quality === '5') {
    addPositionalVoicing([0, 2, 2, 'x', 'x', 'x'], 0);
    addPositionalVoicing(['x', 0, 2, 2, 'x', 'x'], 1);
    addPositionalVoicing(['x', 'x', 0, 2, 3, 'x'], 2);
  } else if (quality.includes('m') && !quality.includes('maj')) {
    const is7 = quality.includes('7');
    addPositionalVoicing(is7 ? [0, 2, 0, 0, 0, 0] : [0, 2, 2, 0, 0, 0], 0);
    addPositionalVoicing(is7 ? ['x', 0, 2, 0, 1, 0] : ['x', 0, 2, 2, 1, 0], 1);
    addPositionalVoicing(is7 ? ['x', 'x', 0, 2, 1, 1] : ['x', 'x', 0, 2, 3, 1], 2);
  } else if (quality.includes('maj') || quality === '') {
    const is7 = quality.includes('7');
    addPositionalVoicing(is7 ? [0, 2, 1, 1, 0, 0] : [0, 2, 2, 1, 0, 0], 0);
    addPositionalVoicing(is7 ? ['x', 0, 2, 1, 2, 0] : ['x', 0, 2, 2, 2, 0], 1);
    addPositionalVoicing(is7 ? ['x', 'x', 0, 2, 2, 2] : ['x', 'x', 0, 2, 3, 2], 2);
    addPositionalVoicing(is7 ? [3, 2, 0, 0, 0, 2] : [3, 2, 0, 0, 0, 3], 0);
  } else if (quality === '7' || quality === '9') {
    const is9 = quality === '9';
    addPositionalVoicing(is9 ? [0, 2, 0, 1, 0, 2] : [0, 2, 0, 1, 0, 0], 0);
    addPositionalVoicing(is9 ? ['x', 0, 2, 0, 2, 0] : ['x', 0, 2, 0, 2, 0], 1);
    addPositionalVoicing(['x', 'x', 0, 2, 1, 2], 2);
  } else {
    // Fallback for diminished, etc.
    addPositionalVoicing(['x', 1, 2, 1, 2, 'x'], 1);
    addPositionalVoicing([1, 'x', 1, 2, 1, 'x'], 0);
    addPositionalVoicing(['x', 'x', 1, 2, 1, 2], 2);
  }

  // CRITICAL: Sort by minFret to ensure Position 1 is strictly closest to the Nut
  const sorted = candidates.sort((a, b) => a.minFret - b.minFret);

  // Filter unique fret layouts to avoid redundant diagrams
  const unique = sorted.filter((val, index, self) => 
    index === self.findIndex((t) => (
      JSON.stringify(t.frets) === JSON.stringify(val.frets)
    ))
  );

  return unique.slice(0, 4).map((c, i) => ({
    frets: c.frets,
    description: `Position ${i + 1}`
  }));
};

export const buildSection = (root: Note, scale: ScaleType, genre: Genre, title: string): Section => {
  const scaleNotes = getScaleNotes(root, scale);
  const patternInfo = GENRE_PATTERNS[genre];
  const prog = patternInfo.progressions[Math.floor(Math.random() * patternInfo.progressions.length)];

  const chords: ChordData[] = prog.map(degree => {
    const noteIndex = (degree - 1) % scaleNotes.length;
    const note = scaleNotes[noteIndex >= 0 ? noteIndex : noteIndex + scaleNotes.length] as Note;
    let quality = '';
    const isMajorScale = scale === ScaleType.Major;
    const isMinorScale = scale === ScaleType.Minor || scale === ScaleType.HarmonicMinor || scale === ScaleType.MelodicMinor;
    const isPhrygianDominant = scale === ScaleType.PhrygianDominant;

    if (isMajorScale) {
      if ([2, 3, 6].includes(degree)) quality = 'm';
      if (degree === 7) quality = 'dim';
    } else if (isMinorScale) {
      if ([1, 4, 5].includes(degree)) quality = 'm';
      if (degree === 2) quality = 'dim';
      if (degree === 3) quality = '';
    } else if (isPhrygianDominant) {
      // Phrygian Dominant harmonization: I, bII, iii-dim, iv-min, v-dim, bVI, bvii-min
      if (degree === 1) quality = ''; // Tonic is Major
      if (degree === 2) quality = ''; // bII is Major
      if ([3, 5].includes(degree)) quality = 'dim';
      if ([4, 7].includes(degree)) quality = 'm';
      if (degree === 6) quality = ''; // bVI is Major
    }

    if (patternInfo.chordType === '7th') {
      if (quality === 'm') quality = 'm7';
      else if (quality === 'dim') quality = 'm7b5';
      else quality = 'maj7';
      if (degree === 5 || (isPhrygianDominant && degree === 1)) quality = '7'; // Phrygian Dominant has a dominant 7th tonic
    } else if (patternInfo.chordType === '9th') {
      if (quality === 'm') quality = 'm9';
      else quality = 'maj9';
      if (degree === 5) quality = '9';
    } else if (patternInfo.chordType === 'dom7') {
      quality = '7';
    } else if (patternInfo.chordType === 'power') {
      quality = '5';
    }

    const chordName = `${note}${quality}`;
    return {
      name: chordName,
      romanNumeral: getRomanNumeral(degree, scale),
      voicings: generateVoicings(chordName)
    };
  });

  return { title, chords };
};
