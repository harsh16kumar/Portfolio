import Particles from './components/Particles/Particles';
import AchievementsReveal from './components/AchievementsReveal/AchievementsReveal';
import Sidebar from './components/Sidebar/Sidebar';
import ScrollSequence from './components/ScrollSequence/ScrollSequence';
import Chatbot from './components/Chatbot/Chatbot';
import EducationReveal from './components/EducationReveal/EducationReveal';
import ExperienceReveal from './components/ExperienceReveal/ExperienceReveal';
import ProjectCardFlight from './components/ProjectCardFlight/ProjectCardFlight';
import SectionNavigator from './components/SectionNavigator/SectionNavigator';
import SkillsReveal from './components/SkillsReveal/SkillsReveal';
import ContactSection from './components/ContactSection/ContactSection';
import FloatingSocials from './components/FloatingSocials/FloatingSocials';
import NewsPanel from './components/NewsPanel/NewsPanel';
import './App.css';

const projectScrollPages = 5;

const navigationSections = [
  { id: 'projects', label: 'Projects', trackSelector: '#projects .scroll-sequence', activationOffset: 0, scrollOffset: -50 },
  { id: 'experience', label: 'Experience', trackSelector: '#experience .experience-reveal__row', activationOffset: -300, scrollOffset: 500 },
  { id: 'education', label: 'Education', trackSelector: '#education .education-reveal__group', activationOffset: 60, scrollOffset: 280 },
  { id: 'skills', label: 'Skills', trackSelector: '#skills .skills-reveal__group', activationOffset: 150, scrollOffset: 250 },
  { id: 'achievements', label: 'Achievements', trackSelector: '#achievements .achievements-reveal__group', activationOffset: 0, scrollOffset: -50 },
  { id: 'contact', label: 'Contact', trackSelector: '#contact .contact-section__inner', activationOffset: 0, scrollOffset: -50 },
];

function App() {
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
      <ProjectCardFlight />
      <SectionNavigator sections={navigationSections} />
      
      {/* Live Tech News Panel (Disappears on scroll) */}
      <NewsPanel />

      <main
        className="main-content"
        style={{ '--project-scroll-pages': `${projectScrollPages}` }}
      >
        <div id="projects">
          <ScrollSequence
            frameCount={176}
            folder="/frames"
            ext="png"
            scrollPages={projectScrollPages}
          />
        </div>

        {/* Reveal content now flows down the page */}
        <div id="experience">
          <ExperienceReveal />
        </div>
        <div className="post-experience-stack">
          <div id="education">
            <EducationReveal />
          </div>
          <div id="skills">
            <SkillsReveal />
          </div>
          <div id="achievements">
            <AchievementsReveal />
          </div>
          <div id="contact">
            <ContactSection />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
