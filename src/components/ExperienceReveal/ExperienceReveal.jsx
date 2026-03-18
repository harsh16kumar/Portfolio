import { useEffect, useRef } from 'react';
import './ExperienceReveal.css';

const EXPERIENCE_IMAGES = [
  '/experience-cards/0001.png',
  '/experience-cards/0002.png',
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

export default function ExperienceReveal() {
  const sectionRef = useRef(null);
  const rowRef = useRef(null);
  const cardRefs = useRef([]);
  const borderRefs = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const update = () => {
      frameId = null;

      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;

      // ✅ CORRECT trigger: starts when section ENTERS viewport (not mid-screen)
      // const offset = 750; // match your translateY shift

      const visualTop = rect.top - 750; // match your translateY

      const phaseProgress = rangeProgress(
        visualTop,
        viewportHeight * 0.95,   // start near bottom
        viewportHeight * -0.25   // end after going up
      );

      // ✅ Smooth appear → hold → disappear
      const enterOpacity = easeOutCubic(rangeProgress(phaseProgress, 0.0, 0.2));
      const exitFade = 1 - easeOutCubic(rangeProgress(phaseProgress, 0.75, 1));
      const groupOpacity = enterOpacity * exitFade;

      // ✅ Keep your upward motion BUT not broken
      const travelProgress = easeOutCubic(rangeProgress(phaseProgress, 0.0, 0.6));

      // 🔥 IMPORTANT: keep your "raised position" but NOT extreme
      const groupTranslateY = -750 - travelProgress * 240;

      if (rowRef.current) {
        rowRef.current.style.opacity = `${groupOpacity}`;
        rowRef.current.style.transform = `translateY(${groupTranslateY}px)`;
      }

      // ✅ Cards stagger
      EXPERIENCE_IMAGES.forEach((_, index) => {
        const revealStart = 0.05 + index * 0.08;
        const revealEnd = revealStart + 0.2;

        const revealProgress = rangeProgress(phaseProgress, revealStart, revealEnd);
        const reveal = easeOutCubic(revealProgress);

        const cardOpacity = reveal * groupOpacity;
        const cardLift = 40 * (1 - reveal);
        const scale = 0.94 + reveal * 0.06;

        const borderOpacity = clamp(revealProgress * 1.3) * groupOpacity;

        const shadowY = 12 + reveal * 18;
        const shadowBlur = 24 + reveal * 22;
        const shadowOpacity = 0.08 + reveal * 0.16;

        const card = cardRefs.current[index];
        const border = borderRefs.current[index];

        if (card) {
          card.style.opacity = `${cardOpacity}`;
          card.style.transform = `translateY(${cardLift}px) scale(${scale})`;
          card.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`;
        }

        if (border) {
          border.style.opacity = `${borderOpacity}`;
          border.style.setProperty('--draw', `${clamp(revealProgress)}`);
          border.style.transform = `scale(${0.985 + reveal * 0.015})`;
        }
      });

      // ✅ Line synced with fade-out
      if (lineRef.current) {
        const lineProgress = easeOutCubic(rangeProgress(phaseProgress, 0.7, 0.9));
        const lineTravel = rangeProgress(phaseProgress, 0.7, 1);
        const lineOpacity = 1 - rangeProgress(phaseProgress, 0.9, 1);

        lineRef.current.style.opacity = `${lineOpacity}`;
        lineRef.current.style.transform =
          `translateY(${-lineTravel * 520}px) scaleX(${lineProgress})`;
      }
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="experience-reveal"
      aria-label="Experience card reveal"
    >
      <div ref={rowRef} className="experience-reveal__row">
        {EXPERIENCE_IMAGES.map((image, index) => (
          <article
            key={image}
            ref={(el) => (cardRefs.current[index] = el)}
            className="experience-reveal__card"
          >
            <div
              ref={(el) => (borderRefs.current[index] = el)}
              className="experience-reveal__border"
            />
            <img
              src={image}
              alt={`Experience card ${index + 1}`}
              className="experience-reveal__image"
            />
          </article>
        ))}
      </div>

      <div ref={lineRef} className="experience-reveal__line" />
    </section>
  );
}