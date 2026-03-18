import { useEffect, useState, useRef } from 'react';
import './SectionNavigator.css';

function getTrackedElement(section) {
  if (section.trackSelector) {
    const selected = document.querySelector(section.trackSelector);
    if (selected instanceof HTMLElement) return selected;
  }

  const fallback = document.getElementById(section.id);
  return fallback instanceof HTMLElement ? fallback : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getActivationScrollY(section, thresholdY) {
  const tracked = getTrackedElement(section);
  if (!(tracked instanceof HTMLElement)) return null;

  const activationOffset =
    typeof section.activationOffset === 'number' ? section.activationOffset : 0;

  const elementTopInDocument = tracked.getBoundingClientRect().top + window.scrollY;
  // Active when (elementTopInViewport + activationOffset) <= thresholdY
  // elementTopInViewport = elementTopInDocument - scrollY
  // => (elementTopInDocument - scrollY + activationOffset) = thresholdY
  // => scrollY = elementTopInDocument + activationOffset - thresholdY
  return elementTopInDocument + activationOffset - thresholdY;
}

export default function SectionNavigator({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const activationThresholdRatio = 0.42;
  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: null,
    trackTop: 0,
    trackHeight: 1,
  });
  const sectionRangeRef = useRef({ startY: 0, endY: 0 });
  const sectionScaleRef = useRef({
    points: [],
    weights: [],
    totalWeighted: 1,
  });
  const rafScrollToRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const update = () => {
      frameId = null;
      const thresholdY = window.innerHeight * activationThresholdRatio;
      let activeSection = sections[0];

      sections.forEach((section) => {
        const trackedElement = getTrackedElement(section);
        if (!(trackedElement instanceof HTMLElement)) return;

        const activationOffset =
          typeof section.activationOffset === 'number'
            ? section.activationOffset
            : 0;

        const trackedTop =
          trackedElement.getBoundingClientRect().top + activationOffset;

        if (trackedTop <= thresholdY) {
          activeSection = section;
        }
      });

      // Handle bottom edge case - only trigger if actually scrolled down
      const isAtBottom =
        window.scrollY > 50 &&
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      if (isAtBottom && sections.length > 0) {
        activeSection = sections[sections.length - 1];
      }

      if (activeSection?.id) {
        setActiveId(activeSection.id);
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
  }, [sections]);

  const computeSectionRange = () => {
    const thresholdY = window.innerHeight * activationThresholdRatio;
    const fallbackMax = document.documentElement.scrollHeight - window.innerHeight;

    const activationPoints = sections
      .map((section) => ({
        id: section.id,
        y: getActivationScrollY(section, thresholdY),
      }))
      .filter((p) => typeof p.y === 'number' && Number.isFinite(p.y))
      .map((p) => ({ ...p, y: clamp(p.y, 0, fallbackMax) }));

    const startY = activationPoints.length ? activationPoints[0].y : 0;
    const endY = activationPoints.length
      ? activationPoints[activationPoints.length - 1].y
      : fallbackMax;

    sectionRangeRef.current = {
      startY: clamp(startY, 0, fallbackMax),
      endY: clamp(Math.max(endY, startY + 1), 0, fallbackMax),
    };

    const weights = [];
    for (let i = 0; i < activationPoints.length - 1; i += 1) {
      const fromId = activationPoints[i].id;
      const toId = activationPoints[i + 1].id;

      let w = 1;
      if (fromId === 'projects' && toId === 'experience') w = 1.0;
      if (fromId === 'experience' && toId === 'education') w = 1.4;
      if (fromId === 'education' && toId === 'skills') w = 1.5;
      weights.push(w);
    }

    let totalWeighted = 0;
    for (let i = 0; i < activationPoints.length - 1; i += 1) {
      const span = Math.max(1, activationPoints[i + 1].y - activationPoints[i].y);
      totalWeighted += span * (weights[i] ?? 1);
    }

    sectionScaleRef.current = {
      points: activationPoints,
      weights,
      totalWeighted: Math.max(1, totalWeighted),
    };
  };

  useEffect(() => {
    let frameId = null;

    const scrollYToRatio = (scrollY) => {
      const { points, weights, totalWeighted } = sectionScaleRef.current;
      if (!points.length) {
        const { startY, endY } = sectionRangeRef.current;
        return clamp((scrollY - startY) / Math.max(1, endY - startY), 0, 1);
      }

      const y = clamp(scrollY, points[0].y, points[points.length - 1].y);
      let acc = 0;

      for (let i = 0; i < points.length - 1; i += 1) {
        const a = points[i].y;
        const b = points[i + 1].y;
        const w = weights[i] ?? 1;
        const span = Math.max(1, b - a);

        if (y <= b) {
          const local = (y - a) / span;
          acc += local * span * w;
          return clamp(acc / totalWeighted, 0, 1);
        }

        acc += span * w;
      }

      return 1;
    };

    const updateThumb = () => {
      frameId = null;
      const track = scrollTrackRef.current;
      const thumb = scrollThumbRef.current;
      if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) return;

      computeSectionRange();
      const current = window.scrollY;
      const t = scrollYToRatio(current);

      const trackRect = track.getBoundingClientRect();
      const thumbHeight = thumb.offsetHeight || 46;
      const usable = Math.max(1, trackRect.height - thumbHeight);
      const top = t * usable;
      thumb.style.top = `${top}px`;
    };

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateThumb);
    };

    const onResize = () => {
      updateThumb();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    updateThumb();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (rafScrollToRef.current !== null) window.cancelAnimationFrame(rafScrollToRef.current);
    };
  }, [sections]);

  const scrollToRatio = (ratio) => {
    const clamped = clamp(ratio, 0, 1);
    const { points, weights, totalWeighted } = sectionScaleRef.current;
    const hasScale = points.length && totalWeighted > 0 && weights;
    const targetY = hasScale
      ? (() => {
          let remaining = clamped * totalWeighted;
          for (let i = 0; i < points.length - 1; i += 1) {
            const a = points[i].y;
            const b = points[i + 1].y;
            const w = weights[i] ?? 1;
            const span = Math.max(1, b - a);
            const weightedSpan = span * w;
            if (remaining <= weightedSpan) {
              const local = remaining / weightedSpan;
              return a + local * span;
            }
            remaining -= weightedSpan;
          }
          return points[points.length - 1].y;
        })()
      : (() => {
          const { startY, endY } = sectionRangeRef.current;
          return startY + clamped * Math.max(1, endY - startY);
        })();

    if (rafScrollToRef.current !== null) {
      window.cancelAnimationFrame(rafScrollToRef.current);
    }

    rafScrollToRef.current = window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      rafScrollToRef.current = null;
    });
  };

  const handleTrackPointerDown = (event) => {
    const track = scrollTrackRef.current;
    const thumb = scrollThumbRef.current;
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) return;
    if (!event) return;

    event.preventDefault();
    computeSectionRange();
    if (typeof track.setPointerCapture === 'function' && typeof event.pointerId === 'number') {
      track.setPointerCapture(event.pointerId);
    }

    const rect = track.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight || 46;
    const usable = Math.max(1, rect.height - thumbHeight);
    const localY = event.clientY - rect.top - thumbHeight / 2;
    const ratio = Math.max(0, Math.min(1, localY / usable));

    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      trackTop: rect.top,
      trackHeight: rect.height,
    };

    scrollToRatio(ratio);
  };

  const handleTrackPointerMove = (event) => {
    const track = scrollTrackRef.current;
    const thumb = scrollThumbRef.current;
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) return;
    if (!event) return;
    if (!dragStateRef.current.isDragging) return;
    if (typeof event.pointerId === 'number' && dragStateRef.current.pointerId !== event.pointerId) return;

    event.preventDefault();
    const rect = track.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight || 46;
    const usable = Math.max(1, rect.height - thumbHeight);
    const localY = event.clientY - rect.top - thumbHeight / 2;
    const ratio = Math.max(0, Math.min(1, localY / usable));
    scrollToRatio(ratio);
  };

  const handleTrackPointerUp = (event) => {
    if (!event) return;
    if (!dragStateRef.current.isDragging) return;
    if (typeof event.pointerId === 'number' && dragStateRef.current.pointerId !== event.pointerId) return;

    event.preventDefault();
    dragStateRef.current.isDragging = false;
    dragStateRef.current.pointerId = null;
  };

  const handleTrackMouseDown = (event) => {
    const track = scrollTrackRef.current;
    const thumb = scrollThumbRef.current;
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) return;
    if (!event) return;

    event.preventDefault();
    computeSectionRange();

    const rect = track.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight || 46;
    const usable = Math.max(1, rect.height - thumbHeight);

    const ratioFromClientY = (clientY) => {
      const localY = clientY - rect.top - thumbHeight / 2;
      return Math.max(0, Math.min(1, localY / usable));
    };

    dragStateRef.current = {
      isDragging: true,
      pointerId: -1,
      trackTop: rect.top,
      trackHeight: rect.height,
    };

    scrollToRatio(ratioFromClientY(event.clientY));

    const onMove = (moveEvent) => {
      if (!dragStateRef.current.isDragging) return;
      scrollToRatio(ratioFromClientY(moveEvent.clientY));
    };

    const onUp = () => {
      dragStateRef.current.isDragging = false;
      dragStateRef.current.pointerId = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <aside className="section-navigator" aria-label="Section navigation">
      <div className="section-navigator__items" aria-hidden="true">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`section-navigator__item ${
              activeId === section.id ? 'is-active' : ''
            }`}
          >
            <span className="section-navigator__label">
              {section.label}
            </span>
          </div>
        ))}
      </div>

      <div
        ref={scrollTrackRef}
        className="section-navigator__scroll"
        role="scrollbar"
        aria-label="Section scroll"
        tabIndex={-1}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
        onPointerCancel={handleTrackPointerUp}
        onMouseDown={handleTrackMouseDown}
      >
        <div
          ref={scrollThumbRef}
          className="section-navigator__thumb"
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={handleTrackPointerUp}
          onMouseDown={handleTrackMouseDown}
        />
      </div>
    </aside>
  );
}
