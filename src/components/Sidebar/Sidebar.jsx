import { useEffect, useRef } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const onScroll = () => {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // clamp progress 0→1
      const progress  = maxScroll > 0 ? Math.min(1, scrolled / maxScroll) : 0;

      // Move the dot from top:0 to top:(100vh - 48px) — keeps it always inside track
      dot.style.top = `calc(${progress * 100}vh - ${progress * 48}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial position
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside className="sidebar">
      {/* Thin vertical track */}
      <div className="sidebar-track" />

      {/* Moving dot with H – also draggable/clickable for scroll */}
      <button
        type="button"
        className="sidebar-dot"
        ref={dotRef}
        onMouseDown={(e) => {
          e.preventDefault();

          const startY = e.clientY;
          const startScroll = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

          const onMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const ratio = deltaY / window.innerHeight; // drag relative to viewport
            const target = startScroll + ratio * maxScroll;
            window.scrollTo({ top: Math.max(0, Math.min(maxScroll, target)), behavior: 'auto' });
          };

          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };

          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}
        onClick={(e) => {
          // Clicking on the dot itself should not jump; just prevent default
          e.preventDefault();
        }}
      >
        <span>H</span>
      </button>
    </aside>
  );
}
