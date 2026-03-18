import { useEffect, useRef } from 'react';
import './ProjectCardFlight.css';

const CARD_IMAGES = [
  '/project-cards/0001.png',
  '/project-cards/0002.png',
  '/project-cards/0003.png',
  '/project-cards/0004.png',
  '/project-cards/0005.png',
];
const HORIZONTAL_SHIFT = '13.5rem';

const KEYFRAMES = [
  { at: 0, x: -10, y: -50, z: -70, rz: -15, ry: 24, rx: 6, scale: 0.86, opacity: 0 },
  { at: 0.12, x: -4, y: -54, z: -40, rz: -12, ry: 18, rx: 4, scale: 0.92, opacity: 0.55 },
  { at: 0.22, x: 2, y: -56, z: -20, rz: -10, ry: 15, rx: 3, scale: 0.96, opacity: 1 },
  { at: 0.38, x: 8, y: -58, z: 0, rz: -8, ry: 12, rx: 2, scale: 1, opacity: 1 },
  { at: 0.48, x: 11, y: -50, z: 18, rz: 0, ry: 0, rx: 0, scale: 1.08, opacity: 1 },
  { at: 0.6, x: 11, y: -50, z: 18, rz: 0, ry: 0, rx: 0, scale: 1.08, opacity: 1 },
  { at: 0.78, x: 16, y: -44, z: 0, rz: 10, ry: -16, rx: -4, scale: 0.97, opacity: 1 },
  { at: 0.88, x: 22, y: -40, z: -35, rz: 12, ry: -18, rx: -5, scale: 0.92, opacity: 0.55 },
  { at: 1, x: 28, y: -36, z: -60, rz: 16, ry: -24, rx: -6, scale: 0.88, opacity: 0 },
];

function interpolate(progress) {
  const clamped = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    const start = KEYFRAMES[i];
    const end = KEYFRAMES[i + 1];

    if (clamped >= start.at && clamped <= end.at) {
      const span = end.at - start.at || 1;
      const t = (clamped - start.at) / span;
      const mix = (a, b) => a + (b - a) * t;

      return {
        x: mix(start.x, end.x),
        y: mix(start.y, end.y),
        z: mix(start.z, end.z),
        rz: mix(start.rz, end.rz),
        ry: mix(start.ry, end.ry),
        rx: mix(start.rx, end.rx),
        scale: mix(start.scale, end.scale),
        opacity: mix(start.opacity, end.opacity),
      };
    }
  }

  return KEYFRAMES[KEYFRAMES.length - 1];
}

function getCardState(scrollProgress) {
  const accelerated = Math.min(1, scrollProgress * 4);

  if (accelerated >= 1) {
    return {
      image: CARD_IMAGES[CARD_IMAGES.length - 1],
      style: interpolate(1),
    };
  }

  const scaled = accelerated * CARD_IMAGES.length;
  const index = Math.min(CARD_IMAGES.length - 1, Math.floor(scaled));
  const localProgress = scaled - index;

  return {
    image: CARD_IMAGES[index],
    style: interpolate(localProgress),
  };
}

export default function ProjectCardFlight() {
  const cardRef = useRef(null);
  const trailRef = useRef(null);
  const imageRef = useRef(null);
  const imageSrcRef = useRef(CARD_IMAGES[0]);

  useEffect(() => {
    let frameId = null;

    const updateFromScroll = () => {
      frameId = null;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = window.scrollY / maxScroll;
      const state = getCardState(progress);

      if (imageRef.current && imageSrcRef.current !== state.image) {
        imageRef.current.src = state.image;
        imageSrcRef.current = state.image;
      }

      if (trailRef.current) {
        trailRef.current.style.opacity = `${Math.max(0, state.style.opacity * 0.7)}`;
        trailRef.current.style.transform = `translate3d(calc(${state.style.x - 2.4}vw + ${HORIZONTAL_SHIFT}), ${state.style.y + 2}%, ${state.style.z - 30}px) scale(${Math.max(0.72, state.style.scale * 0.94)})`;
      }

      if (cardRef.current) {
        cardRef.current.style.opacity = `${state.style.opacity}`;
        cardRef.current.style.transform = `translate3d(calc(${state.style.x}vw + ${HORIZONTAL_SHIFT}), ${state.style.y}%, ${state.style.z}px) rotateZ(${state.style.rz}deg) rotateY(${state.style.ry}deg) rotateX(${state.style.rx}deg) scale(${state.style.scale})`;
      }
    };

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section className="project-flight" aria-label="Animated project card demo">
      <div className="project-flight__stage">
        <div ref={trailRef} className="project-flight__trail" />
        <div ref={cardRef} className="project-flight__card">
          <img
            ref={imageRef}
            src={CARD_IMAGES[0]}
            alt="Project card"
            className="project-flight__image"
          />
        </div>
      </div>
    </section>
  );
}
