import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroSequence.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSequence({ frameCount = 100, imagePath = '/sequence' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef([]);
  // Object to hold the current frame index for GSAP to animate
  const seqObjRef = useRef({ frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    contextRef.current = canvas.getContext('2d');
    const ctx = contextRef.current;

    // Optional: make canvas high-dpi aware
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Preload images
    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Assuming sequence format: 0001.jpg, 0002.jpg ... or 1.jpg
        // For flexibility, let's use a padded format if needed!
        // Adjust the padded number logic if frames are named differently.
        const paddedIndex = i.toString().padStart(4, '0');
        img.src = `${imagePath}/${paddedIndex}.jpg`; 
        imagesRef.current.push(img);
      }
    };

    preloadImages();

    // Helper to draw image covering the canvas (like object-fit: cover)
    const renderImage = (index) => {
      const img = imagesRef.current[index];
      if (img && img.complete) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate aspect ratio for 'cover'
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
           drawHeight = canvas.width / imgRatio;
           offsetY = -(drawHeight - canvas.height) / 2;
        } else {
           drawWidth = canvas.height * imgRatio;
           offsetX = -(drawWidth - canvas.width) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    // Draw first frame when the first image loads
    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = () => renderImage(0);
    } else {
      setTimeout(() => renderImage(0), 100);
    }

    // Handle Window Resize 
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderImage(Math.round(seqObjRef.current.frame));
    };
    window.addEventListener('resize', handleResize);

    // Setup GSAP ScrollTrigger
    const st = gsap.to(seqObjRef.current, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%', // Scrolls for 300% of viewport height
        pin: true,
        scrub: 0.5, // Smooth scrubbing
      },
      onUpdate: () => renderImage(Math.round(seqObjRef.current.frame))
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (st.scrollTrigger) st.scrollTrigger.kill();
      st.kill();
    };
  }, [frameCount, imagePath]);

  return (
    <section ref={containerRef} className="hero-sequence-container">
      <div className="sequence-overlay">
        <h2>The Journey Begins</h2>
        <p>Scroll down to explore my experiences</p>
      </div>
      <canvas ref={canvasRef} className="sequence-canvas" />
    </section>
  );
}
