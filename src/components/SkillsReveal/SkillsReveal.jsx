import { useEffect, useRef } from 'react';
import './SkillsReveal.css';

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function rangeProgress(progress, start, end) {
  return clamp((progress - start) / (end - start));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

const SKILL_GROUPS = [
  {
    title: 'AI / ML',
    items: [
      'Agentic AI & Generative AI',
      'LangChain & LangGraph',
      'Natural Language Processing (NLP)',
      'Deep Learning & TensorFlow',
      'Hugging Face Transformers',
    ],
  },
  {
    title: 'Data / Search',
    items: [
      'Vector Databases & FAISS',
      'MongoDB & PostgreSQL',
      'OpenCV Computer Vision',
    ],
  },
  {
    title: 'Programming',
    items: [
      'Python',
      'C++',
      'SQL',
    ],
  },
  {
    title: 'Tools & Cloud',
    items: [
      'Excel',
      'Docker',
      'REST API Development',
      'GitHub Version Control',
      'Google Colab',
      'VS Code',
      'Codex',
      'Cursor'
    ],
  },
  {
    title: 'Automation',
    items: [
      'n8n Workflow Automation',
    ],
  },
  {
    title: 'Relevant Coursework',
    items: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Operating Systems',
      'Database Management Systems (DBMS)',
      'Generative AI',
      'Natural Language Processing',
    ],
  },
];

export default function SkillsReveal() {
  const groupRef = useRef(null);
  const sectionRefs = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const update = () => {
      frameId = null;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = window.scrollY / maxScroll;

      const phaseStart = 0.22;
      const revealStart = phaseStart + 0.01;
      const revealEnd = revealStart + 0.14;
      const travelEnd = revealEnd + 0.20;
      const enterOpacity = Math.max(0.3, rangeProgress(progress, phaseStart, revealStart + 0.04));
      const travelProgress = rangeProgress(progress, phaseStart, travelEnd);
      const groupLift = 52 - travelProgress * 980;
      const lineRevealStart = revealStart + 0.02;
      const lineRevealEnd = lineRevealStart + 0.08;
      const lineProgress = easeOutCubic(
        rangeProgress(progress, lineRevealStart, lineRevealEnd),
      );

      if (groupRef.current) {
        groupRef.current.style.opacity = `${enterOpacity}`;
        groupRef.current.style.transform = `translateY(${groupLift}px)`;
      }

      if (groupRef.current && lineRef.current) {
        const lineTop = groupRef.current.offsetTop + groupRef.current.offsetHeight + 24;
        lineRef.current.style.top = `${lineTop}px`;
        lineRef.current.style.opacity = `${enterOpacity}`;
        lineRef.current.style.transform = `translateY(${groupLift}px) scaleX(${lineProgress})`;
      }

      SKILL_GROUPS.forEach((_, index) => {
        const itemStart = revealStart + index * 0.024;
        const itemEnd = itemStart + 0.08;
        const local = rangeProgress(progress, itemStart, itemEnd);
        const reveal = easeOutCubic(local);
        const section = sectionRefs.current[index];

        if (!section) return;

        section.style.opacity = `${reveal * enterOpacity}`;
        section.style.transform = `translateY(${20 * (1 - reveal)}px) scale(${0.965 + reveal * 0.035})`;
        // section.style.boxShadow = `0 ${10 + reveal * 8}px ${20 + reveal * 12}px rgba(0, 0, 0, ${0.07 + reveal * 0.09})`;
        section.style.boxShadow = 'none';
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
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="skills-reveal" aria-label="Skills reveal">
      <div ref={groupRef} className="skills-reveal__group">
        {SKILL_GROUPS.map((group, index) => (
          <section
            key={group.title}
            ref={(element) => {
              sectionRefs.current[index] = element;
            }}
            className="skills-reveal__section"
            onMouseMove={handleMouseMove}
          >
            <h3 className="skills-reveal__title">{group.title}</h3>
            <div className="skills-reveal__chips">
              {group.items.map((skill) => (
                <span 
                  key={skill} 
                  className="skills-reveal__chip"
                  onMouseMove={handleMouseMove}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div ref={lineRef} className="skills-reveal__line" />
    </section>
  );
}
