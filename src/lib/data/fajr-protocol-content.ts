export interface ProtocolSlide {
  type: "silence" | "dua" | "quran" | "pray";
  title?: string;
  subtitle?: string;
  duration?: number; // seconds, for silence
  arabic?: string;
  transliteration?: string;
  english?: string;
  surahInfo?: string;
  verses?: {
    arabic: string;
    english: string;
  }[];
  hadith?: string;
}

export const fajrProtocolSlides: ProtocolSlide[] = [
  // ── Silence ──
  {
    type: "silence",
    title: "Silence Protocol",
    subtitle: "Sit in silence for 2 minutes. No phone. No distractions. Just be.",
    duration: 120,
  },

  // ── Du'a: Morning Supplication ──
  {
    type: "dua",
    title: "Morning Du'a",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration:
      "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal.",
    english:
      "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
  },

  // ── Du'a: Waking Up ──
  {
    type: "dua",
    title: "Upon Waking",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration:
      "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    english:
      "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
  },

  // ── Quran: Surah Al-Ikhlas (112) ──
  {
    type: "quran",
    surahInfo: "Surah Al-Ikhlas · 112",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      },
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        english: 'Say, "He is Allah, [who is] One,',
      },
      {
        arabic: "اللَّهُ الصَّمَدُ",
        english: "Allah, the Eternal Refuge.",
      },
    ],
  },
  {
    type: "quran",
    surahInfo: "Surah Al-Ikhlas · 112 (continued)",
    verses: [
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        english: "He neither begets nor is born,",
      },
      {
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        english: 'Nor is there to Him any equivalent."',
      },
    ],
  },

  // ── Quran: Surah Al-Falaq (113) ──
  {
    type: "quran",
    surahInfo: "Surah Al-Falaq · 113",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      },
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        english: 'Say, "I seek refuge in the Lord of daybreak,',
      },
      {
        arabic: "مِن شَرِّ مَا خَلَقَ",
        english: "From the evil of that which He created,",
      },
    ],
  },
  {
    type: "quran",
    surahInfo: "Surah Al-Falaq · 113 (continued)",
    verses: [
      {
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        english: "And from the evil of darkness when it settles,",
      },
      {
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        english: "And from the evil of the blowers in knots,",
      },
      {
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        english: 'And from the evil of an envier when he envies."',
      },
    ],
  },

  // ── Quran: Surah An-Nas (114) ──
  {
    type: "quran",
    surahInfo: "Surah An-Nas · 114",
    verses: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      },
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        english: 'Say, "I seek refuge in the Lord of mankind,',
      },
      {
        arabic: "مَلِكِ النَّاسِ",
        english: "The Sovereign of mankind,",
      },
    ],
  },
  {
    type: "quran",
    surahInfo: "Surah An-Nas · 114 (continued)",
    verses: [
      {
        arabic: "إِلَٰهِ النَّاسِ",
        english: "The God of mankind,",
      },
      {
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        english: "From the evil of the retreating whisperer,",
      },
      {
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        english: "Who whispers in the breasts of mankind,",
      },
      {
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        english: 'Among jinn and among mankind."',
      },
    ],
  },

  // ── Pray ──
  {
    type: "pray",
    title: "Pray Fajr",
    subtitle: "Stand before your Lord in the stillness of dawn.",
    hadith:
      '"Whoever prays the Fajr prayer, he is under the protection of Allah." — Sahih Muslim',
  },
];
