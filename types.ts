
export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export enum ScaleType {
  Major = 'Major',
  Minor = 'Minor',
  Dorian = 'Dorian',
  Phrygian = 'Phrygian',
  Lydian = 'Lydian',
  Mixolydian = 'Mixolydian',
  Locrian = 'Locrian',
  HarmonicMinor = 'Harmonic Minor',
  Blues = 'Blues'
}

export enum Genre {
  Pop = 'Pop',
  Rock = 'Rock',
  Jazz = 'Jazz',
  Blues = 'Blues',
  EDM = 'EDM',
  NeoSoul = 'Neo-Soul',
  Country = 'Country',
  Metal = 'Metal',
  RnB = 'R&B',
  Reggae = 'Reggae',
  Funk = 'Funk'
}

export interface Voicing {
  frets: (number | 'x')[]; // 6 strings for guitar (E A D G B E)
  fingers?: (number | null)[];
  description: string;
}

export interface ChordData {
  name: string;
  romanNumeral: string;
  voicings: Voicing[];
}

export interface Section {
  title: string;
  chords: ChordData[];
}

export interface Song {
  key: Note;
  scale: ScaleType;
  genre: Genre;
  verse: Section;
  preChorus: Section;
  chorus: Section;
  bridge: Section;
}
