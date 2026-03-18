import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollSequence.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSequence({
  frameCount = 100,
  folder = '/frames',
  ext = 'jpg',
  scrollPages = 4,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx =
      canvas.getContext('2d', { alpha: true, desynchronized: true }) ??
      canvas.getContext('2d');

    if (!ctx) return undefined;

    const current = { progress: 0 };
    const images = Array.from({ length: frameCount }, () => new Image());
    const getFrameIndex = () => Math.round(current.progress * (frameCount - 1));
    const getRenderScale = () => (window.innerWidth <= 768 ? 0.5 : 0.65);

    let lastDrawnIndex = -1;
    let idlePreloadId = null;
    let timeoutPreloadId = null;

    const drawFrame = (index, force = false) => {
      const resolvedIndex = Math.max(0, Math.min(frameCount - 1, Math.round(index)));
      if (!force && resolvedIndex === lastDrawnIndex) return;

      const img = images[resolvedIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;

      const coverScale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const drawWidth = imageWidth * coverScale;
      const drawHeight = imageHeight * coverScale;
      const drawX = (canvasWidth - drawWidth) / 2;
      const drawY = (canvasHeight - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      lastDrawnIndex = resolvedIndex;
    };

    const resize = () => {
      const renderScale = getRenderScale();
      canvas.width = Math.round(window.innerWidth * renderScale);
      canvas.height = Math.round(window.innerHeight * renderScale);
      drawFrame(getFrameIndex(), true);
    };

    const loadFrame = (index) => {
      const img = images[index];
      if (!img || img.datasetRequested) return;

      img.datasetRequested = 'true';
      img.decoding = 'async';
      img.onload = () => {
        if (index === 0 || index === getFrameIndex()) {
          drawFrame(getFrameIndex(), true);
        }
      };

      const name = String(index + 1).padStart(4, '0');
      img.src = `${folder}/${name}.${ext}`;
    };

    const schedulePreload = (callback) => {
      if ('requestIdleCallback' in window) {
        idlePreloadId = window.requestIdleCallback(callback, { timeout: 120 });
        return;
      }

      timeoutPreloadId = window.setTimeout(callback, 40);
    };

    const preloadRemainingFrames = () => {
      let nextIndex = 1;

      const loadBatch = (deadline) => {
        let loadedInBatch = 0;

        while (
          nextIndex < frameCount &&
          loadedInBatch < 6 &&
          (!deadline || deadline.timeRemaining() > 5)
        ) {
          loadFrame(nextIndex);
          nextIndex += 1;
          loadedInBatch += 1;
        }

        if (nextIndex < frameCount) {
          schedulePreload(loadBatch);
        }
      };

      schedulePreload(loadBatch);
    };

    window.addEventListener('resize', resize);
    resize();
    loadFrame(0);
    preloadRemainingFrames();

    const tween = gsap.to(current, {
      progress: 1,
      ease: 'none',
      onUpdate: () => drawFrame(getFrameIndex()),
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${scrollPages * 100}%`,
        pin: true,
        scrub:5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const scale = 0.35;
          const yPercent = 65 * (progress ** 4);

          gsap.set(canvas, {
            scale,
            yPercent,
            transformOrigin: '100% 0%',
          });
        },
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener('resize', resize);

      if (idlePreloadId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idlePreloadId);
      }

      if (timeoutPreloadId !== null) {
        window.clearTimeout(timeoutPreloadId);
      }
    };
  }, [frameCount, folder, ext, scrollPages]);

  return (
    <section ref={containerRef} className="scroll-sequence">
      <canvas ref={canvasRef} className="sequence-canvas" />
      <div className="sequence-hint">
        <span>scroll</span>
      </div>
    </section>
  );
}
