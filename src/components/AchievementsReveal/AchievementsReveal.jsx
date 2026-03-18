// import { useEffect, useRef } from 'react';
// import { achievements } from '../../data/profileData';
// import './AchievementsReveal.css';

// function clamp(value, min = 0, max = 1) {
//   return Math.min(max, Math.max(min, value));
// }

// function rangeProgress(progress, start, end) {
//   return clamp((progress - start) / (end - start));
// }

// function easeOutCubic(value) {
//   return 1 - Math.pow(1 - value, 3);
// }

// const ACHIEVEMENT_META = [
//   {
//     label: 'LeetCode',
//     mark: 'LC',
//     accent: 'achievement-card--gold',
//   },
//   {
//     label: 'Stagecraft',
//     mark: 'TH',
//     accent: 'achievement-card--rose',
//   },
//   {
//     label: 'DataWars',
//     mark: 'DW',
//     accent: 'achievement-card--cyan',
//   },
// ];

// export default function AchievementsReveal() {
//   const groupRef = useRef(null);
//   const cardRefs = useRef([]);

//   useEffect(() => {
//     let frameId = null;

//     const update = () => {
//       frameId = null;
//       const maxScroll = Math.max(
//         1,
//         document.documentElement.scrollHeight - window.innerHeight,
//       );
//       const progress = window.scrollY / maxScroll;

//       const phaseStart = 0.20;
//       const revealStart = phaseStart + 0.012;
//       const phaseEnd = 0.40;
//       const enterOpacity = Math.max(0.3, rangeProgress(progress, phaseStart, revealStart + 0.05));
//       const phaseProgress = rangeProgress(progress, phaseStart, phaseEnd);
//       const groupLift = 26 * (1 - enterOpacity) - phaseProgress * 190;

//       if (groupRef.current) {
//         const skillsLine = document.querySelector('.skills-reveal__line');
//         if (skillsLine instanceof HTMLElement) {
//           const lineRect = skillsLine.getBoundingClientRect();
//           const preferredTop = lineRect.bottom - 3500;
//           const groupHeight = groupRef.current.offsetHeight || 0;
//           const downwardOffset = Math.max(groupLift, 0);
//           const maxTop = window.innerHeight - groupHeight - downwardOffset - 28;
//           const anchoredTop = Math.min(preferredTop, maxTop);
//           groupRef.current.style.top = `${Math.max(20, anchoredTop)}px`;
//         }

//         groupRef.current.style.opacity = `${enterOpacity}`;
//         groupRef.current.style.transform = `translateY(${groupLift}px)`;
//       }

//       achievements.forEach((_, index) => {
//         const cardStart = revealStart + index * 0.022;
//         const cardEnd = cardStart + 0.075;
//         const local = rangeProgress(progress, cardStart, cardEnd);
//         const reveal = easeOutCubic(local);
//         const card = cardRefs.current[index];

//         if (!card) return;

//         card.style.opacity = `${reveal * enterOpacity}`;
//         card.style.transform = `translateY(${22 * (1 - reveal)}px) scale(${0.965 + reveal * 0.035})`;
//         card.style.boxShadow = `0 ${12 + reveal * 10}px ${24 + reveal * 16}px rgba(0, 0, 0, ${0.1 + reveal * 0.08})`;
//       });
//     };

//     const onScroll = () => {
//       if (frameId !== null) return;
//       frameId = window.requestAnimationFrame(update);
//     };

//     window.addEventListener('scroll', onScroll, { passive: true });
//     update();

//     return () => {
//       window.removeEventListener('scroll', onScroll);
//       if (frameId !== null) {
//         window.cancelAnimationFrame(frameId);
//       }
//     };
//   }, []);


//   return (
//     <section className="achievements-reveal" aria-label="Achievements reveal">
//       <div ref={groupRef} className="achievements-reveal__group">
//         {achievements.map((achievement, index) => {
//           const meta = ACHIEVEMENT_META[index] ?? {
//             label: `Achievement ${index + 1}`,
//             mark: 'AC',
//             accent: 'achievement-card--cyan',
//           };

//           return (
//             <article
//               key={achievement}
//               ref={(element) => {
//                 cardRefs.current[index] = element;
//               }}
//               className={`achievement-card ${meta.accent}`}
//             >
//               <div className="achievement-card__logo" aria-hidden="true">
//                 <span>{meta.mark}</span>
//               </div>
//               <div className="achievement-card__content">
//                 <p className="achievement-card__eyebrow">{meta.label}</p>
//                 <p className="achievement-card__text">{achievement}</p>
//               </div>
//             </article>
//           );
//         })}
//       </div>
//     </section>
//   );
// }


// import { useEffect, useRef } from "react";
// import { achievements } from "../../data/profileData";
// import "./AchievementsReveal.css";

// function clamp(value, min = 0, max = 1) {
//   return Math.min(max, Math.max(min, value));
// }

// function rangeProgress(progress, start, end) {
//   return clamp((progress - start) / (end - start));
// }

// function easeOutCubic(value) {
//   return 1 - Math.pow(1 - value, 3);
// }

// const ACHIEVEMENT_META = [
//   { label: "LeetCode", mark: "LC", accent: "achievement-card--gold" },
//   { label: "Stagecraft", mark: "TH", accent: "achievement-card--rose" },
//   { label: "DataWars", mark: "DW", accent: "achievement-card--cyan" },
// ];

// export default function AchievementsReveal() {
//   const groupRef = useRef(null);
//   const cardRefs = useRef([]);

//   useEffect(() => {
//     let frameId = null;

//     const update = () => {
//       frameId = null;

//       const maxScroll =
//         document.documentElement.scrollHeight - window.innerHeight;
//       const progress = window.scrollY / maxScroll;

//       const phaseStart = 0.2;
//       const revealStart = phaseStart + 0.02;
//       const phaseEnd = 0.4;

//       const enterOpacity = rangeProgress(progress, phaseStart, revealStart + 0.1);
//       const phaseProgress = rangeProgress(progress, phaseStart, phaseEnd);

//       const groupLift = -phaseProgress * 180;

//       // ✅ FIXED POSITIONING (YOUR ORIGINAL LOGIC)
//       if (groupRef.current) {
//         const skillsLine = document.querySelector(".skills-reveal__line");

//         if (skillsLine instanceof HTMLElement) {
//           const lineRect = skillsLine.getBoundingClientRect();

//           const preferredTop = lineRect.bottom - 3500;
//           const groupHeight = groupRef.current.offsetHeight || 0;

//           const downwardOffset = Math.max(groupLift, 0);
//           const maxTop =
//             window.innerHeight - groupHeight - downwardOffset - 28;

//           const anchoredTop = Math.min(preferredTop, maxTop);

//           groupRef.current.style.top = `${Math.max(20, anchoredTop)}px`;
//         }

//         groupRef.current.style.opacity = enterOpacity;
//         groupRef.current.style.transform = `translateY(${groupLift}px)`;
//       }

//       // CARD REVEAL
//       cardRefs.current.forEach((card, index) => {
//         if (!card) return;

//         const start = revealStart + index * 0.05;
//         const end = start + 0.12;

//         const local = rangeProgress(progress, start, end);
//         const reveal = easeOutCubic(local);

//         card.style.opacity = reveal;
//         card.style.transform = `translateY(${30 * (1 - reveal)}px) scale(${0.95 + reveal * 0.05})`;
//       });
//     };

//     const onScroll = () => {
//       if (frameId) return;
//       frameId = requestAnimationFrame(update);
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     update();

//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       if (frameId) cancelAnimationFrame(frameId);
//     };
//   }, []);

//   // 🔥 HOVER EFFECT
//   const handleMouseMove = (e, card) => {
//     const rect = card.getBoundingClientRect();

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = -(y - centerY) / 12;
//     const rotateY = (x - centerX) / 12;

//     card.style.transform = `
//       perspective(1000px)
//       rotateX(${rotateX}deg)
//       rotateY(${rotateY}deg)
//       scale(1.04)
//     `;

//     card.style.setProperty("--x", `${x}px`);
//     card.style.setProperty("--y", `${y}px`);
//   };

//   const resetCard = (card) => {
//     card.style.transform =
//       "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
//   };

//   return (
//     <section className="achievements-reveal">
//       <div ref={groupRef} className="achievements-reveal__group">
//         {achievements.map((achievement, index) => {
//           const meta =
//             ACHIEVEMENT_META[index] || {
//               label: `Achievement ${index + 1}`,
//               mark: "AC",
//               accent: "achievement-card--cyan",
//             };

//           return (
//             <article
//               key={achievement}
//               ref={(el) => (cardRefs.current[index] = el)}
//               className={`achievement-card ${meta.accent}`}
//               onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
//               onMouseLeave={(e) => resetCard(e.currentTarget)}
//             >
//               <div className="achievement-card__logo">
//                 <span>{meta.mark}</span>
//               </div>

//               <div className="achievement-card__content">
//                 <p className="achievement-card__eyebrow">{meta.label}</p>
//                 <p className="achievement-card__text">{achievement}</p>
//               </div>
//             </article>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

import { useEffect, useRef, forwardRef, useState } from 'react';
import { achievements } from '../../data/profileData';
import './AchievementsReveal.css';

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(progress, start, end) {
  return clamp((progress - start) / (end - start));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

const ACHIEVEMENT_META = [
  { label: 'LeetCode', mark: 'LC', accent: 'achievement-card--gold' },
  { label: 'Stagecraft', mark: 'TH', accent: 'achievement-card--rose' },
  { label: 'DataWars', mark: 'DW', accent: 'achievement-card--cyan' },
];

// Helper Component for the 3D Hover Effect
const HoverableCard = forwardRef(({ achievement, meta }, ref) => {
  const innerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate center coordinates
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 8 degrees). Reverse Y for natural tilt.
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    // Apply CSS variables for the 3D transform and the gradient "dip" position
    innerRef.current.style.setProperty('--mouse-x', `${x}px`);
    innerRef.current.style.setProperty('--mouse-y', `${y}px`);
    innerRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    innerRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    // Reset rotations to 0 on leave
    innerRef.current.style.setProperty('--rotate-x', `0deg`);
    innerRef.current.style.setProperty('--rotate-y', `0deg`);
  };

  return (
    <article ref={ref} className={`achievement-card ${meta.accent}`}>
      <div
        ref={innerRef}
        className="achievement-card__inner"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="achievement-card__logo" aria-hidden="true">
          <span>{meta.mark}</span>
        </div>
        <div className="achievement-card__content">
          <p className="achievement-card__eyebrow">{meta.label}</p>
          <p className="achievement-card__text">{achievement}</p>
        </div>
      </div>
    </article>
  );
});

export default function AchievementsReveal() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const groupRef = useRef(null);
  const cardRefs = useRef([]);

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
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = window.scrollY / maxScroll;

      const phaseStart = 0.20;
      const revealStart = phaseStart + 0.012;
      const phaseEnd = 0.40;
      const enterOpacity = Math.max(0.3, rangeProgress(progress, phaseStart, revealStart + 0.05));
      const phaseProgress = rangeProgress(progress, phaseStart, phaseEnd);
      const groupLift = 26 * (1 - enterOpacity) - phaseProgress * 190;

      if (groupRef.current) {
        const skillsLine = document.querySelector('.skills-reveal__line');
        if (skillsLine instanceof HTMLElement) {
          const lineRect = skillsLine.getBoundingClientRect();
          const preferredTop = lineRect.bottom - 3500;
          const groupHeight = groupRef.current.offsetHeight || 0;
          const downwardOffset = Math.max(groupLift, 0);
          const maxTop = window.innerHeight - groupHeight - downwardOffset - 28;
          const anchoredTop = Math.min(preferredTop, maxTop);
          groupRef.current.style.top = `${Math.max(20, anchoredTop)}px`;
        }

        groupRef.current.style.opacity = `${enterOpacity}`;
        groupRef.current.style.transform = `translateY(${groupLift}px)`;
      }

      achievements.forEach((_, index) => {
        const cardStart = revealStart + index * 0.022;
        const cardEnd = cardStart + 0.075;
        const local = rangeProgress(progress, cardStart, cardEnd);
        const reveal = easeOutCubic(local);
        const card = cardRefs.current[index];

        if (!card) return;

        card.style.opacity = `${reveal * enterOpacity}`;
        card.style.transform = `translateY(${22 * (1 - reveal)}px)`;
        // Note: I removed the scroll-based scale and boxShadow here so the hover effect takes full control of depth.
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

  return (
    <section className={`achievements-reveal${isMobile ? ' achievements-reveal--mobile' : ''}`} aria-label="Achievements reveal">
      <div ref={groupRef} className={`achievements-reveal__group${isMobile ? ' achievements-reveal__group--mobile' : ''}`}>
        {achievements.map((achievement, index) => {
          const meta = ACHIEVEMENT_META[index] ?? {
            label: `Achievement ${index + 1}`,
            mark: 'AC',
            accent: 'achievement-card--cyan',
          };

          return (
            <HoverableCard
              key={achievement}
              achievement={achievement}
              meta={meta}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
