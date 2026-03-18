import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase } from 'lucide-react';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  { id: 1, role: 'Senior Frontend Developer', company: 'Tech Corp', year: '2022 - Present' },
  { id: 2, role: 'UI/UX Engineer', company: 'Design Studio', year: '2020 - 2022' },
  { id: 3, role: 'Web Developer', company: 'Startup Inc', year: '2018 - 2020' },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const bagRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  // Clear refs array on re-render
  cardsRef.current = [];

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline pinned to this section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%', // Scroll for 200vh
          pin: true,
          scrub: true, // Smooth scrub
        }
      });

      // 1. Initial State: Bag is hidden above, Cards are inside the bag (scale 0)
      gsap.set(bagRef.current, { y: -500, opacity: 0 });
      gsap.set(cardsContainerRef.current, { y: -500, opacity: 0 });
      gsap.set(cardsRef.current, { y: 0, scale: 0, opacity: 0, rotation: 0 });

      // 2. Animate Bag dropping down
      // tl.to(bagRef.current, {
      //   y: 0,
      //   opacity: 1,
      //   duration: 2,
      //   ease: 'bounce.out'
      // });
      tl.to([bagRef.current, cardsContainerRef.current], {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'bounce.out'
      });

      // 3. Animate Cards popping out of the bag
      cardsRef.current.forEach((card, index) => {
        // Calculate spread to make them look scattered
        const xOffset = (index - 1) * 220; // Spread horizontally (-220, 0, 220)
        const yOffset = -150 - (Math.abs(index - 1) * 20); // Arc effect
        const rot = (index - 1) * 15; // Rotate outwards

        tl.to(card, {
          y: yOffset,
          x: xOffset,
          scale: 1,
          opacity: 1,
          rotation: rot,
          duration: 1.5,
          ease: 'back.out(1.7)'
        }, '-=0.5'); // Overlap animations slightly
      });

    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  return (
    <section ref={sectionRef} className="experience-section">
      <div className="experience-container">
        <h2 className="section-title">My Journey</h2>
        
        <div className="animation-area">
          {/* The Bag */}
          <div ref={bagRef} className="portfolio-bag flex-center">
            <Briefcase size={80} color="#fff" />
            <div className="bag-label">Experience</div>
          </div>

          {/* The Flashcards */}
          <div ref={cardsContainerRef} className="cards-container">
            {experiences.map((exp, i) => (
              <div 
                key={exp.id} 
                ref={addToRefs} 
                className="experience-card glass-panel"
                style={{ zIndex: 10 + i }}
              >
                <div className="card-year">{exp.year}</div>
                <h3 className="card-role">{exp.role}</h3>
                <p className="card-company">{exp.company}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
