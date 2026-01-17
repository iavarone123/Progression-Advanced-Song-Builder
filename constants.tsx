
import { Note, ScaleType, Genre } from './types';

export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  [ScaleType.Major]: [0, 2, 4, 5, 7, 9, 11],
  [ScaleType.Minor]: [0, 2, 3, 5, 7, 8, 10],
  [ScaleType.Dorian]: [0, 2, 3, 5, 7, 9, 10],
  [ScaleType.Phrygian]: [0, 1, 3, 5, 7, 8, 10],
  [ScaleType.Lydian]: [0, 2, 4, 6, 7, 9, 11],
  [ScaleType.Mixolydian]: [0, 2, 4, 5, 7, 9, 10],
  [ScaleType.Locrian]: [0, 1, 3, 5, 6, 8, 10],
  [ScaleType.HarmonicMinor]: [0, 2, 3, 5, 7, 8, 11],
  [ScaleType.MelodicMinor]: [0, 2, 3, 5, 7, 9, 11],
  [ScaleType.PhrygianDominant]: [0, 1, 4, 5, 7, 8, 10],
  [ScaleType.Blues]: [0, 3, 5, 6, 7, 10],
  [ScaleType.PentatonicMajor]: [0, 2, 4, 7, 9],
  [ScaleType.PentatonicMinor]: [0, 3, 5, 7, 10]
};

export interface GenreInfo {
  chordType: 'triad' | 'power' | '7th' | '9th' | 'dom7' | 'maj7' | 'm7' | 'sus';
  progressions: number[][];
}

export const GENRE_PATTERNS: Record<Genre, GenreInfo> = {
  [Genre.Pop]: {
    chordType: 'triad',
    progressions: [
      [1, 5, 6, 4], 
      [6, 4, 1, 5], 
      [1, 4, 5, 4],
      [1, 6, 4, 5],
      [4, 1, 5, 6]
    ]
  },
  [Genre.Rock]: {
    chordType: 'power',
    progressions: [
      [1, 4, 5, 4],
      [1, 6, 3, 7],
      [1, 5, 4, 1],
      [2, 4, 1, 5],
      [1, 3, 4, 5, 1] // 5-chord anthemic walk
    ]
  },
  [Genre.Jazz]: {
    chordType: '7th',
    progressions: [
      [2, 5, 1, 6],
      [1, 6, 2, 5],
      [3, 6, 2, 5],
      [2, 5, 1, 4, 7, 3, 6], // Cycle of fourths (7 chords)
      [1, 4, 7, 3, 6, 2, 5, 1] // Full Circle of Fifths
    ]
  },
  [Genre.Blues]: {
    chordType: 'dom7',
    progressions: [
      [1, 4, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5], // Full 12-bar Blues
      [1, 4, 1, 5], // Quick change 4-bar
      [1, 1, 4, 4, 1, 5, 4, 1] // 8-bar Blues
    ]
  },
  [Genre.EDM]: {
    chordType: 'triad',
    progressions: [
      [6, 4, 1, 5],
      [6, 7, 1, 5],
      [1, 5, 4, 4],
      [6, 1, 5, 2],
      [4, 5, 6, 1, 2] // Build-up progression
    ]
  },
  [Genre.NeoSoul]: {
    chordType: '9th',
    progressions: [
      [2, 5, 1, 4],
      [6, 2, 5, 1],
      [4, 3, 2, 1],
      [7, 3, 6, 2, 5, 1], // Sophisticated turnaround
      [1, 4, 3, 6]
    ]
  },
  [Genre.Country]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 5],
      [1, 5, 4, 1],
      [1, 4, 5, 5],
      [1, 2, 4, 1],
      [6, 4, 1, 5, 4, 5] // Extended storytelling progression
    ]
  },
  [Genre.Metal]: {
    chordType: 'power',
    progressions: [
      [1, 2, 1, 2],
      [1, 6, 7, 1],
      [6, 5, 4, 3],
      [1, 4, 3, 2],
      [1, 3, 2, 1, 4, 3] // Melodic death metal riff pattern
    ]
  },
  [Genre.RnB]: {
    chordType: '7th',
    progressions: [
      [1, 4, 2, 5],
      [6, 2, 4, 1],
      [4, 5, 1, 6],
      [2, 3, 4, 5, 6], // Sophisticated step-up
      [1, 3, 6, 5, 4] // Motown-style soul walk
    ]
  },
  [Genre.Reggae]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 4],
      [1, 2, 1, 2],
      [1, 5, 1, 5],
      [6, 4, 1, 5],
      [1, 4, 5, 4, 1]
    ]
  },
  [Genre.Funk]: {
    chordType: '9th',
    progressions: [
      [1, 1, 4, 4],
      [2, 5, 2, 5],
      [1, 2, 4, 1],
      [1, 4, 5, 4, 2, 5], // Funky turnaround
      [6, 2, 6, 2]
    ]
  },
  [Genre.BossaNova]: {
    chordType: '7th',
    progressions: [
      [1, 6, 2, 5], // Standard Bossa
      [2, 5, 1, 4, 7, 3, 6], // Descending 5ths
      [1, 2, 5, 1],
      [1, 3, 2, 5, 1, 4] // Jazzy expansion
    ]
  },
  [Genre.Synthwave]: {
    chordType: 'triad',
    progressions: [
      [1, 6, 3, 7], // Epic minor
      [6, 7, 1, 5],
      [1, 7, 6, 7], // "The Nightcall" vibe
      [1, 3, 4, 6, 7], // Driving bassline
      [4, 5, 6, 1]
    ]
  },
  [Genre.Classical]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 5, 1],
      [1, 6, 4, 5],
      [1, 4, 7, 3, 6, 2, 5, 1], // Full circle of fifths (Pachelbel-ish)
      [1, 5, 6, 3, 4, 1, 4, 5], // Canon in D
      [2, 5, 1, 4]
    ]
  },
  [Genre.Folk]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 5],
      [1, 5, 6, 4],
      [1, 1, 4, 4, 5, 5, 1, 1], // Traditional folk
      [6, 5, 4, 1],
      [1, 3, 4, 1]
    ]
  },
  [Genre.Disco]: {
    chordType: '7th',
    progressions: [
      [2, 5, 1, 6],
      [1, 4, 2, 5],
      [6, 2, 6, 2], // Simple minor groove
      [1, 2, 4, 5],
      [4, 5, 3, 6, 2, 5, 1] // Step-down disco anthem
    ]
  },
  [Genre.Trap]: {
    chordType: 'triad',
    progressions: [
      [1, 2, 1, 2], // Phrygian dark vibe
      [6, 5, 6, 5],
      [1, 6, 1, 6],
      [6, 4, 5, 1],
      [6, 1, 7, 6] // Dark melodic trap
    ]
  },
  [Genre.Gospel]: {
    chordType: '9th',
    progressions: [
      [1, 4, 5, 1],
      [1, 6, 2, 5],
      [4, 7, 3, 6, 2, 5, 1], // Powerful Gospel turnaround
      [1, 3, 4, 6, 2, 5, 1], // Preacher chords
      [1, 1, 4, 4, 5, 5, 1, 1]
    ]
  },
  [Genre.Grunge]: {
    chordType: 'power',
    progressions: [
      [1, 3, 4, 6], // Chromatic grunge
      [1, 6, 3, 7],
      [1, 2, 4, 1],
      [6, 5, 4, 1],
      [1, 5, 3, 6]
    ]
  },
  [Genre.Ambient]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 4],
      [1, 6, 5, 4],
      [1, 2, 4, 6],
      [6, 4, 2, 5, 1], // Slow emotional evolution
      [1, 5, 2, 4]
    ]
  }
};
