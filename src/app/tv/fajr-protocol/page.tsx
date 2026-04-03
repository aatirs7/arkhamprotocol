"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fajrProtocolSlides,
  type ProtocolSlide,
} from "@/lib/data/fajr-protocol-content";

export default function FajrProtocolPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const slide = fajrProtocolSlides[slideIndex];
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === fajrProtocolSlides.length - 1;

  const goNext = useCallback(() => {
    if (isLast) return;
    setFadeIn(false);
    setTimeout(() => {
      setSlideIndex((i) => i + 1);
      setFadeIn(true);
    }, 400);
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (isFirst) return;
    setFadeIn(false);
    setTimeout(() => {
      setSlideIndex((i) => i - 1);
      setFadeIn(true);
    }, 400);
  }, [isFirst]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center select-none overflow-hidden font-body">
      {/* Slide content */}
      <div
        className={`flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-16 transition-opacity duration-400 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {slide.type === "silence" && <SilenceSlide slide={slide} onComplete={goNext} />}
        {slide.type === "dua" && <DuaSlide slide={slide} />}
        {slide.type === "quran" && <QuranSlide slide={slide} />}
        {slide.type === "pray" && <PraySlide slide={slide} />}
      </div>

      {/* Navigation */}
      <div className="shrink-0 w-full px-16 py-8 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="text-neutral-700 hover:text-neutral-400 transition-colors disabled:opacity-0 text-sm tracking-wider"
        >
          ‹
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {fajrProtocolSlides.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === slideIndex
                  ? "bg-[#00e5ff]"
                  : i < slideIndex
                    ? "bg-[#00e5ff]/30"
                    : "bg-neutral-800"
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <a
            href="/tv"
            className="text-[#00e5ff]/60 hover:text-[#00e5ff] text-xs tracking-wider uppercase transition-colors"
          >
            Complete
          </a>
        ) : (
          <button
            onClick={goNext}
            className="text-neutral-700 hover:text-neutral-400 transition-colors text-sm tracking-wider"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Silence Slide — circular countdown
// ────────────────────────────────────────────

function SilenceSlide({
  slide,
  onComplete,
}: {
  slide: ProtocolSlide;
  onComplete: () => void;
}) {
  const total = slide.duration ?? 120;
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  const progress = ((total - remaining) / total) * 100;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, "0")}`;

  // SVG circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-xl font-headline font-light text-white/80 tracking-wide">
        {slide.title}
      </h2>
      <p className="text-neutral-500 text-sm tracking-wide">{slide.subtitle}</p>

      {/* Circular timer */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="text-2xl font-headline font-light text-white tabular-nums">
          {timeStr}
        </span>
      </div>

      <button
        onClick={onComplete}
        className="text-neutral-700 text-[10px] tracking-widest uppercase hover:text-neutral-400 transition-colors"
      >
        Override
      </button>
    </div>
  );
}

// ────────────────────────────────────────────
// Du'a Slide — Arabic + Transliteration + English
// ────────────────────────────────────────────

function DuaSlide({ slide }: { slide: ProtocolSlide }) {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      {slide.title && (
        <div className="text-neutral-600 text-[10px] tracking-[0.4em] uppercase">
          {slide.title}
        </div>
      )}

      {/* Arabic — large, Uthmani feel */}
      <div
        className="text-3xl leading-[2.2] text-white/90 font-normal"
        dir="rtl"
        lang="ar"
        style={{ fontFamily: '"Amiri", "Scheherazade New", "Traditional Arabic", serif' }}
      >
        {slide.arabic}
      </div>

      {/* English translation */}
      <p className="text-neutral-400 text-sm tracking-wide leading-relaxed max-w-xl italic">
        {slide.english}
      </p>

      {/* Transliteration */}
      {slide.transliteration && (
        <p className="text-neutral-600 text-xs tracking-wide leading-relaxed max-w-xl">
          {slide.transliteration}
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Quran Slide — Verses with Arabic + English
// ────────────────────────────────────────────

function QuranSlide({ slide }: { slide: ProtocolSlide }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {slide.surahInfo && (
        <div className="text-neutral-600 text-[10px] tracking-[0.4em] uppercase">
          {slide.surahInfo}
        </div>
      )}

      <div className="space-y-10">
        {(slide.verses ?? []).map((verse, i) => (
          <div key={i} className="space-y-3">
            <div
              className="text-2xl leading-[2.2] text-white/90"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: '"Amiri", "Scheherazade New", "Traditional Arabic", serif' }}
            >
              {verse.arabic}
            </div>
            <p className="text-neutral-500 text-sm tracking-wide italic">
              {verse.english}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Pray Slide — Final call to prayer
// ────────────────────────────────────────────

function PraySlide({ slide }: { slide: ProtocolSlide }) {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <h2 className="text-4xl font-headline font-light text-white/90 tracking-wide glow-cyan">
        {slide.title}
      </h2>

      <p className="text-neutral-400 text-base tracking-wide leading-relaxed max-w-lg">
        {slide.subtitle}
      </p>

      {/* Divider */}
      <div className="w-16 h-px bg-[#00e5ff]/20" />

      {slide.hadith && (
        <p className="text-neutral-500 text-sm italic tracking-wide leading-relaxed max-w-lg">
          {slide.hadith}
        </p>
      )}
    </div>
  );
}
