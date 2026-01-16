
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
  [ScaleType.Blues]: [0, 3, 5, 6, 7, 10]
};

export const GENRE_PATTERNS: Record<Genre, { chordType: string, progressions: number[][] }> = {
  [Genre.Pop]: {
    chordType: 'triad',
    progressions: [
      [1, 5, 6, 4], // The "Classic" Pop
      [6, 4, 1, 5], // The "Sensitive" Pop
      [1, 4, 1, 5], // Simple Folk-Pop
      [1, 6, 4, 5], // 50s Pop
      [4, 1, 5, 6]  // Modern Suspense
    ]
  },
  [Genre.Rock]: {
    chordType: 'power',
    progressions: [
      [1, 4, 5, 4], // Standard Blues-Rock
      [1, 6, 3, 7], // Grunge-ish
      [1, 5, 4, 1], // Stadium Rock
      [2, 4, 1, 5], // Alternative Rock
      [1, 3, 4, 5]  // Punk-Rock
    ]
  },
  [Genre.Jazz]: {
    chordType: '7th',
    progressions: [
      [2, 5, 1, 6], // ii-V-I-vi
      [1, 6, 2, 5], // I-vi-ii-V
      [3, 6, 2, 5], // iii-vi-ii-V
      [2, 5, 1, 4], // Circle of Fifths
      [1, 2, 4, 5]  // Modal Jazz vibe
    ]
  },
  [Genre.Blues]: {
    chordType: 'dom7',
    progressions: [
      [1, 1, 1, 1], // 12-bar blues part 1
      [4, 4, 1, 1], // 12-bar blues part 2
      [5, 4, 1, 5], // 12-bar blues part 3
      [1, 4, 1, 5]  // Quick change
    ]
  },
  [Genre.EDM]: {
    chordType: 'triad',
    progressions: [
      [6, 4, 1, 5], // Epic Chord progression
      [6, 7, 1, 5], // Dark House
      [1, 5, 4, 4], // Tropical House vibe
      [6, 1, 5, 2], // Future Bass vibe
      [1, 3, 4, 6]  // Trance energy
    ]
  },
  [Genre.NeoSoul]: {
    chordType: '9th',
    progressions: [
      [2, 5, 1, 4], // Standard R&B cycle
      [6, 2, 5, 1], // Chill vibes
      [4, 3, 2, 1], // Walk down
      [7, 3, 6, 2], // Turnaround
      [1, 3, 2, 5]  // Smooth Soul
    ]
  },
  [Genre.Country]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 5], // Basic Country
      [1, 5, 4, 1], // Backwards Country
      [1, 4, 5, 5], // Honky Tonk
      [1, 1, 4, 5], // Outlaw Country
      [6, 4, 1, 5]  // Modern Country Ballad
    ]
  },
  [Genre.Metal]: {
    chordType: 'power',
    progressions: [
      [1, 2, 1, 2], // Thrash chugging
      [1, 6, 7, 1], // Melodic Death Metal
      [6, 5, 4, 3], // Phrygian walk down
      [1, 4, 3, 2], // Doom Metal
      [1, 5, 6, 3]  // Power Metal anthem
    ]
  },
  [Genre.RnB]: {
    chordType: '7th',
    progressions: [
      [1, 4, 2, 5], // 90s RnB
      [6, 2, 4, 1], // Modern Soul
      [4, 5, 1, 6], // Pop RnB
      [2, 3, 4, 5], // Sophisticated RnB
      [1, 3, 6, 5]  // Motown style
    ]
  },
  [Genre.Reggae]: {
    chordType: 'triad',
    progressions: [
      [1, 4, 1, 4], // Classic Reggae
      [1, 2, 1, 2], // Minor Reggae vibe
      [1, 5, 1, 5], // Simplistic riddim
      [6, 4, 1, 5], // Modern Lovers Rock
      [1, 4, 5, 4]  // Traditional
    ]
  },
  [Genre.Funk]: {
    chordType: '9th',
    progressions: [
      [1, 1, 4, 4], // Standard Funk Grooves
      [2, 5, 2, 5], // Smooth Funk
      [1, 2, 4, 1], // Syncopated
      [1, 4, 5, 4], // Soulful Funk
      [6, 2, 6, 2]  // Minor Funk
    ]
  }
};
