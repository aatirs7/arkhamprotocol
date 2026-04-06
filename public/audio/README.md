# Adhan Audio Files

Place the following MP3 files in this directory:

- `fajr-adhan.mp3` — Adhan for Fajr prayer
- `regular-adhan.mp3` — Adhan for Dhuhr, Asr, Maghrib, and Isha
- `tahajjud-adhan.mp3` — Adhan/reminder for Tahajjud (night prayer)

These files are served statically by Next.js at `/audio/<filename>`.
The `play_adhan` Alexa action returns URLs pointing to these files.

Alexa AudioPlayer requirements:
- HTTPS (Vercel handles this)
- MP3 format
- 48 kbps+ bitrate, 16000 Hz+ sample rate
- Max 240 seconds per clip
