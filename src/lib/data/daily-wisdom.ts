export const dailyWisdom = [
  // Quran Verses
  `"Verily, with hardship comes ease." — Quran 94:6`,
  `"And He found you lost and guided you." — Quran 93:7`,
  `"So remember Me; I will remember you." — Quran 2:152`,
  `"Allah does not burden a soul beyond that it can bear." — Quran 2:286`,
  `"And whoever puts their trust in Allah, He will be enough for them." — Quran 65:3`,
  `"Indeed, the patient will be given their reward without account." — Quran 39:10`,
  `"My mercy encompasses all things." — Quran 7:156`,
  `"And We have certainly made the Quran easy for remembrance." — Quran 54:17`,
  `"He is with you wherever you are." — Quran 57:4`,
  `"Do not lose hope in the mercy of Allah." — Quran 39:53`,
  `"And speak to people good words." — Quran 2:83`,
  `"Indeed, Allah is with those who are patient." — Quran 2:153`,
  `"And whoever fears Allah, He will make for him a way out." — Quran 65:2`,
  `"Is not Allah sufficient for His servant?" — Quran 39:36`,
  `"So which of the favors of your Lord would you deny?" — Quran 55:13`,
  `"And We created you in pairs." — Quran 78:8`,
  `"He knows what is in every heart." — Quran 67:13`,
  `"Call upon Me; I will respond to you." — Quran 40:60`,
  `"And the Hereafter is better for you than the first life." — Quran 93:4`,
  `"Those who believe and do righteous deeds — they are the best of creatures." — Quran 98:7`,

  // Hadith
  `"The strong believer is better than the weak believer." — Sahih Muslim`,
  `"Take advantage of five before five: your youth before old age." — Al-Hakim`,
  `"The best of you are those who learn the Quran and teach it." — Sahih Bukhari`,
  `"Whoever travels a path in search of knowledge, Allah will ease a path to Paradise." — Sahih Muslim`,
  `"Actions are judged by intentions." — Sahih Bukhari`,
  `"Make things easy and do not make them difficult." — Sahih Bukhari`,
  `"The most beloved deeds to Allah are those done consistently, even if small." — Sahih Bukhari`,
  `"A good word is charity." — Sahih Bukhari`,
  `"He who does not thank people, does not thank Allah." — Abu Dawud`,
  `"The best among you are those who have the best character." — Sahih Bukhari`,
  `"Tie your camel, then put your trust in Allah." — Tirmidhi`,
  `"Be in this world as if you were a stranger or a traveler." — Sahih Bukhari`,
  `"Speak good or remain silent." — Sahih Bukhari`,
  `"Allah is beautiful and loves beauty." — Sahih Muslim`,
  `"The believer is not stung from the same hole twice." — Sahih Bukhari`,
  `"Patience is illumination." — Sahih Muslim`,
];

export function getDailyWisdom(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dailyWisdom[dayOfYear % dailyWisdom.length];
}
