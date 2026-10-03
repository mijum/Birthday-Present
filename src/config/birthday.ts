import { BirthdayConfig } from '../types/birthday';

/**
 * Birthday Website Configuration
 * 
 * You can personalize every single aspect of this experience here:
 * - herName & herNickname: The recipient's name and sweet nicknames
 * - yourName: Your name or signature
 * - introMessages: The storytelling reveal lines on Scene 1
 * - firstLetter: The opening handwritten letter
 * - memories: Photos, captions, and dates for your shared moments
 * - finalLetter: The concluding emotional love letter
 * - audio: Background music and sound effects configuration
 */
export const BIRTHDAY_CONFIG: BirthdayConfig = {
  herName: "Beautiful",
  herNickname: "My Love",
  yourName: "Yours Forever",

  introMessages: [
    "Hey, Beautiful...",
    "Today is a little different.",
    "Because today, the world became more beautiful.",
    "And someone incredibly special was born.",
    "I made something just for you...",
    "So take a little moment, and let me tell you something."
  ],

  firstLetter: {
    salutation: "My Dearest,",
    paragraphs: [
      "আমার জীবনের সবচেয়ে বিশেষ মানুষটিকে জন্মদিনের একরাশ ভালোবাসা ও অফুরন্ত শুভেচ্ছা।",
      "শব্দ দিয়ে হয়তো কখনোই বুঝিয়ে বলা সম্ভব নয় যে তুমি আমার জীবনে কতটা জায়গা জুড়ে আছো, তবুও আজকের এই বিশেষ দিনে একটু প্রকাশ করতে চাই। তোমার একটা মিষ্টি হাসি আমার সাধারণ দিনগুলোকেও অসাধারণ করে তোলে, আর তোমার উপস্থিতি আমার হৃদয়ে এমন এক অদ্ভুত প্রশান্তি এনে দেয় যা ভাষায় প্রকাশ করা যায় না।",
      "আমি মন থেকে প্রার্থনা করি—তোমার জীবনের এই নতুন বছরটি যেন অফুরন্ত সুখ, মধুর স্মৃতি, পরম শান্তি আর তোমার মনের প্রতিটি অপূর্ণ স্বপ্নের বাস্তব রূপ বয়ে নিয়ে আসে।",
      "আমি চাই তুমি সবসময় জানো যে—তুমি আমার জীবনে কতটা মূল্যবান, কতটা আদরের আর কতটা গভীরভাবে ভালোবাসার মানুষ। হয়তো সব অনুভূতি সবসময় মুখে প্রকাশ করা হয়ে ওঠে না, কিন্তু প্রতিটি মুহূর্তেই তা সত্যি।",
      "আজকের এই পুরো দিনটি শুধু তোমার—তোমার সুন্দর হাসির, তোমার আকাশছোঁয়া স্বপ্নের আর তোমার মতো নিষ্পাপ ও সুন্দর হৃদয়ের মানুষটির জন্য।"
    ],
    signOff: "শুভ জন্মদিন, আমার ভালোবাসা।",
    signature: "সবসময় তোমারই ♡"
  },

  memories: [
    {
      id: "mem-1",
      title: "The Starlit Conversations",
      caption: "The moment I never want to forget.",
      date: "A quiet evening",
      location: "Underneath the city lights",
      accentColor: "#f3c1cb"
    },
    {
      id: "mem-2",
      title: "Warm Coffee & Easy Laughter",
      caption: "Your smile, my favorite view.",
      date: "A Sunday morning",
      location: "Our favorite corner cafe",
      accentColor: "#e8a4b8"
    },
    {
      id: "mem-3",
      title: "Golden Hour Walks",
      caption: "A little memory that means everything.",
      date: "Sunset shoreline",
      location: "By the water",
      accentColor: "#dfb285"
    },
    {
      id: "mem-4",
      title: "The Unplanned Adventure",
      caption: "One of my happiest days.",
      date: "That spontaneous getaway",
      location: "Lost in the best way",
      accentColor: "#d67d8a"
    },
    {
      id: "mem-5",
      title: "Gentle Everyday Wonders",
      caption: "The quiet moments that make my heart full.",
      date: "Every simple day with you",
      location: "Right where we belong",
      accentColor: "#c86b7c"
    },
    {
      id: "mem-6",
      title: "Looking Toward Tomorrow",
      caption: "And a thousand more moments to come.",
      date: "The beginning of your new year",
      location: "Everywhere ahead",
      accentColor: "#b24d64"
    }
  ],

  candleCount: 6,

  finalLetter: {
    salutation: "My Love,",
    paragraphs: [
      "আমাদের এই ছোট্ট জন্মদিনের আয়োজনটি হয়তো শেষের দিকে, তবে আমি আশা করি এটি তোমার মিষ্টি মুখে এক টুকরো নির্মল হাসি ফুটিয়ে তুলতে পেরেছে।",
      "এই পৃথিবীতে যদি তোমাকে কোনো একটা বিশেষ উপহার দেওয়ার ক্ষমতা আমার থাকতো, তবে আমি তোমাকে আমার চোখের দৃষ্টি দিয়ে নিজেকে দেখার ক্ষমতা দিতাম। তাহলে তুমি সত্যিই বুঝতে পারতে—তুমি আমার কাছে কতটা বিশেষ, কতটা অনিন্দ্য সুন্দর আর কতটা অমূল্য এক আশীর্বাদ।",
      "আমি হয়তো প্রতিশ্রুতি দিতে পারবো না যে জীবনের প্রতিটি দিন নিখুঁত বা মেঘমুক্ত হবে, কিন্তু আমি কথা দিচ্ছি—তোমার পাশে থেকে হাসির কারণ জোগাতে, তোমার স্বপ্ন পূরণের সাথী হতে আর ভালোবাসার মধুর স্মৃতি তৈরি করতে আমি কখনোই পিছপা হবো না।",
      "তুমি যেমন, ঠিক তেমনই থাকার জন্য তোমাকে অনেক অনেক ধন্যবাদ। তোমার ছোট ছোট মায়া, যত্ন আর ভালোবাসাগুলোই তোমাকে সবার চেয়ে আলাদা আর আমার জীবনের শ্রেষ্ঠ উপহার বানিয়েছে।",
      "জীবনের ক্যালেন্ডারে যত জন্মদিনই আসুক আর চলে যাক না কেন, তুমি সবসময় মনে রেখো—তুমি এই পৃথিবীর সবচেয়ে সুন্দর ভালোবাসা, শ্রদ্ধা আর গভীর অনুভূতির যোগ্য।"
    ],
    signOff: "শুভ জন্মদিন, আমার চাঁদের আলো।",
    signature: "সমস্ত ভালোবাসা নিয়ে,\nচিরকাল তোমারই ♡"
  },

  audio: {
    // Custom romantic background song from public folder
    backgroundMusicUrl: "/YTDown.com_YouTube_Media_XfC6xNwHi2Q_Jay-Sean-Ride-It-Lyrics_009_128k (1).mp3",
    enableSoundEffects: true
  }
};
