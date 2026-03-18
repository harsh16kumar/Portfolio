import { useEffect, useRef, useState } from 'react';
import './EducationReveal.css';

const EDUCATION_IMAGES = [
  '/education-cards/0001.webp',
  '/education-cards/0002.webp',
  '/education-cards/0003.webp',
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(progress, start, end) {
  return clamp((progress - start) / (end - start));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

const CARD_LAYOUTS = [
  { x: 0, y: 120, rotate: -1.5 },
  { x: -11, y: 232, rotate: -4 },
  { x: 11, y: 232, rotate: 4 },
];

export default function EducationReveal() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const sectionRef = useRef(null);
  const groupRef = useRef(null);
  const cardRefs = useRef([]);
  const borderRefs = useRef([]);
  const topLineRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;

    let frameId = null;

    const update = () => {
      frameId = null;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      const phaseProgress = rangeProgress(
        viewportHeight - rect.top,
        viewportHeight * 0.02,
        viewportHeight + rect.height * 0.34,
      );

      const enterOpacity = easeOutCubic(rangeProgress(phaseProgress, 0.0, 0.16));
      const exitFade = 1 - easeOutCubic(rangeProgress(phaseProgress, 0.78, 1));
      const groupOpacity = enterOpacity * exitFade;
      const travelProgress = easeOutCubic(rangeProgress(phaseProgress, 0.0, 0.62));
      const groupLift = 96 - travelProgress * 240;
      const topLineRevealStart = 0.0;
      const topLineRevealEnd = 0.14;
      const topLineProgress = easeOutCubic(
        rangeProgress(phaseProgress, topLineRevealStart, topLineRevealEnd),
      );
      const lineRevealStart = 0.12;
      const lineRevealEnd = 0.28;
      const lineProgress = easeOutCubic(
        rangeProgress(phaseProgress, lineRevealStart, lineRevealEnd),
      );

      if (groupRef.current) {
        groupRef.current.style.opacity = `${groupOpacity}`;
        groupRef.current.style.transform = `translateY(${groupLift}px)`;
      }

      if (topLineRef.current) {
        topLineRef.current.style.opacity = `${groupOpacity}`;
        topLineRef.current.style.transform = `translateY(${groupLift}px) scaleX(${topLineProgress})`;
      }

      if (lineRef.current) {
        lineRef.current.style.opacity = `${groupOpacity}`;
        lineRef.current.style.transform = `translateY(${groupLift}px) scaleX(${lineProgress})`;
      }

      EDUCATION_IMAGES.forEach((_, index) => {
        const cardStart = 0.02 + index * 0.06;
        const cardEnd = cardStart + 0.18;
        const local = rangeProgress(phaseProgress, cardStart, cardEnd);
        const reveal = easeOutCubic(local);
        // Delay the border drawing slightly so the card appears first
        const borderLocal = rangeProgress(phaseProgress, cardStart + 0.07, cardEnd + 0.07);
        const borderReveal = clamp(borderLocal * 1.3);

        const layout = CARD_LAYOUTS[index];
        const rise = 82 * (1 - reveal);
        const scale = 0.92 + reveal * 0.08;
        const opacity = reveal * groupOpacity;

        const card = cardRefs.current[index];
        const border = borderRefs.current[index];

        if (card) {
          card.style.opacity = `${opacity}`;
          card.style.transform = `translate(-50%, 0) translateX(${layout.x}rem) translateY(${layout.y + rise}px) rotate(${layout.rotate}deg) scale(${scale})`;
          card.style.boxShadow = `0 ${10 + reveal * 18}px ${20 + reveal * 26}px rgba(0, 0, 0, ${0.1 + reveal * 0.18})`;
        }

        if (border) {
          border.style.opacity = `${borderReveal * groupOpacity}`;
          border.style.setProperty('--draw', `${borderReveal}`);
        }
      });
    };

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="education-reveal education-reveal--mobile"
        aria-label="Education card reveal"
      >
        <div ref={groupRef} className="education-reveal__group">
          {EDUCATION_IMAGES.map((image, index) => (
            <article
              key={image}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className={`education-reveal__card education-reveal__card--${index + 1}`}
            >
              <img
                src={image}
                alt={`Education card ${index + 1}`}
                className="education-reveal__image"
              />
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="education-reveal" aria-label="Education card reveal">
      <div ref={groupRef} className="education-reveal__group">
        {EDUCATION_IMAGES.map((image, index) => (
          <article
            key={image}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className={`education-reveal__card education-reveal__card--${index + 1}`}
          >
            <div
              ref={(element) => {
                borderRefs.current[index] = element;
              }}
              className="education-reveal__border"
            />
            <img
              src={image}
              alt={`Education card ${index + 1}`}
              className="education-reveal__image"
            />
          </article>
        ))}
      </div>
      <div ref={topLineRef} className="education-reveal__line education-reveal__line--top" />
      <div ref={lineRef} className="education-reveal__line" />
    </section>
  );
}
