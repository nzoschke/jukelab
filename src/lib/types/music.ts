// References:
// - https://docs.mp3tag.de/mapping/
// - https://docs.mp3tag.de/mapping-table/

export interface Album {
  art: string;
  artist: string;
  barcode: string;
  compilation: boolean;
  /** @type integer */
  discs: number;
  genre: string;
  src: string;
  title: string;
  year: Date;
}

export interface AlbumTracks extends Album {
  tracks: Track[];
}

export interface Playlist {
  art: string;
  id: string;
  comment: string;
  owner: string;
  src: string;
  title: string;
}

export interface PlaylistTracks extends Playlist {
  tracks: Track[];
}

export interface Track {
  album: string;
  albumArtist: string;
  artist: string;
  bpm: number;
  comment: string;
  /** @type integer */
  disc: number;
  genre: string;
  isrc: string;
  key: string;
  /** @type integer */
  length: number; // ms
  mood: string;
  src: string;
  title: string;
  /** @type integer */
  track: number;
  type: string;
  year: Date;
}

// Constants

export const Album: Album = {
  art: "",
  artist: "",
  barcode: "",
  compilation: false,
  discs: 0,
  genre: "",
  src: "",
  title: "",
  year: new Date(0),
};

export const AlbumTracks: AlbumTracks = {
  art: "",
  artist: "",
  barcode: "",
  compilation: false,
  discs: 0,
  genre: "",
  src: "",
  title: "",
  tracks: [],
  year: new Date(0),
};

export const Track: Track = {
  album: "",
  albumArtist: "",
  artist: "",
  bpm: 0,
  comment: "",
  disc: 0,
  genre: "",
  isrc: "",
  key: "",
  length: 0,
  mood: "",
  src: "",
  title: "",
  track: 0,
  type: "",
  year: new Date(0),
};
