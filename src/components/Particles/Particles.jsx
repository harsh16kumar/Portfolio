import { useEffect, useRef } from 'react';
import './Particles.css';

export default function Particles({ count = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    // Resize canvas to always fill the full viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track scroll delta to push particles
    const onScroll = () => {
      const currentY = window.scrollY;
      scrollVelocity += (lastScrollY - currentY) * 0.12; // up = positive, down = negative
      lastScrollY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Build particles
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.8 + 0.2,          // tiny: radius 0.2 – 1.0
      vx: (Math.random() - 0.5) * 1.2,       // 4× faster horizontal
      vy: (Math.random() - 0.5) * 1.2,       // 4× faster vertical
      opacity: Math.random() * 0.2 + 0.8,    // 0.8 – 1.0 → pure bright white
      // twinkle phase so each star pulses independently
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dampen scroll velocity each frame
      scrollVelocity *= 0.88;

      for (const p of particles) {
        // Twinkle
        p.phase += p.speed;
        const twinkle = 0.6 + 0.4 * Math.sin(p.phase); // 0.6 – 1.0

        // Move
        p.x += p.vx;
        p.y += p.vy + scrollVelocity; // scroll pushes stars up/down

        // Wrap around
        if (p.x < 0)            p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0)            p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw a lightweight star without allocating gradients every frame.
        const alpha = p.opacity * twinkle;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}
