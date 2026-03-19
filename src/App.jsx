import { useEffect, useState } from 'react';
import Particles from './components/Particles/Particles';
import AchievementsReveal from './components/AchievementsReveal/AchievementsReveal';
import Sidebar from './components/Sidebar/Sidebar';
import ScrollSequence from './components/ScrollSequence/ScrollSequence';
import Chatbot from './components/Chatbot/Chatbot';
import EducationReveal from './components/EducationReveal/EducationReveal';
import ExperienceReveal from './components/ExperienceReveal/ExperienceReveal';
import ProjectCardFlight from './components/ProjectCardFlight/ProjectCardFlight';
import MobileProjectSwipe from './components/MobileProjectSwipe/MobileProjectSwipe';
import SectionNavigator from './components/SectionNavigator/SectionNavigator';
import SkillsReveal from './components/SkillsReveal/SkillsReveal';
import ContactSection from './components/ContactSection/ContactSection';
import FloatingSocials from './components/FloatingSocials/FloatingSocials';
import NewsPanel from './components/NewsPanel/NewsPanel';
import './App.css';

const projectScrollPages = 5;
const mobileBreakpoint = 768;

const navigationSections = [
  { id: 'projects', label: 'Projects', trackSelector: '#projects .scroll-sequence', activationOffset: 0, scrollOffset: -50 },
  { id: 'experience', label: 'Experience', trackSelector: '#experience .experience-reveal__row', activationOffset: -300, scrollOffset: 500 },
  { id: 'education', label: 'Education', trackSelector: '#education .education-reveal__group', activationOffset: 60, scrollOffset: 280 },
  { id: 'skills', label: 'Skills', trackSelector: '#skills .skills-reveal__group', activationOffset: 150, scrollOffset: 250 },
  { id: 'achievements', label: 'Achievements', trackSelector: '#achievements .achievements-reveal__group', activationOffset: 0, scrollOffset: -50 },
  { id: 'contact', label: 'Contact', trackSelector: '#contact .contact-section__inner', activationOffset: 0, scrollOffset: -50 },
];

function MobileSectionHeading({ title }) {
  return (
    <div className="mobile-section-heading">
      <h2 className="mobile-section-heading__title">{title}</h2>
    </div>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= mobileBreakpoint);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      {/* Always-visible background layer */}
      <Particles count={60} />

      {/* Scroll-progress sidebar */}
      <Sidebar />
      
      {/* Expanding Social Links Menu */}
      <FloatingSocials />

      {/* Chat assistant centered near top initially */}
      <Chatbot />
      {!isMobile && <ProjectCardFlight />}
      <SectionNavigator sections={navigationSections} />
      
      {/* Live Tech News Panel (Disappears on scroll) */}
      <NewsPanel />

      <main
        className={`main-content${isMobile ? ' main-content--mobile' : ''}`}
        style={{ '--project-scroll-pages': `${projectScrollPages}` }}
      >
        <div id="projects">
          {isMobile && <MobileSectionHeading title="Projects" />}
          {!isMobile ? (
            <ScrollSequence
              frameCount={176}
              folder="/frames"
              ext="webp"
              scrollPages={projectScrollPages}
            />
          ) : (
            <MobileProjectSwipe />
          )}
        </div>

        {/* Reveal content now flows down the page */}
        <div id="experience">
          {isMobile && <MobileSectionHeading title="Experience" />}
          <ExperienceReveal />
        </div>
        <div className="post-experience-stack">
          <div id="education">
            {isMobile && <MobileSectionHeading title="Education" />}
            <EducationReveal />
          </div>
          <div id="skills">
            {isMobile && <MobileSectionHeading title="Skills" />}
            <SkillsReveal />
          </div>
          <div id="achievements">
            {isMobile && <MobileSectionHeading title="Achievements" />}
            <AchievementsReveal />
          </div>
          <div id="contact">
            {isMobile && <MobileSectionHeading title="Contact" />}
            <ContactSection />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
