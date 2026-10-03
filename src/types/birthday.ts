export type SceneId = 
  | 'INTRO'
  | 'FIRST_LETTER'
  | 'MEMORIES'
  | 'BIRTHDAY_CAKE'
  | 'CAKE_CUTTING'
  | 'FINAL_LETTER';

export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  accentColor?: string;
}

export type MicState = 
  | 'NOT_REQUESTED'
  | 'REQUESTING'
  | 'LISTENING'
  | 'BLOWING_DETECTED'
  | 'EXTINGUISHED'
  | 'PERMISSION_DENIED'
  | 'UNAVAILABLE';

export interface LetterContent {
  salutation: string;
  paragraphs: string[];
  signOff: string;
  signature: string;
}

export interface BirthdayConfig {
  herName: string;
  herNickname: string;
  yourName: string;
  introMessages: string[];
  firstLetter: LetterContent;
  memories: MemoryItem[];
  candleCount: number;
  finalLetter: LetterContent;
  audio: {
    backgroundMusicUrl?: string;
    enableSoundEffects: boolean;
  };
}
