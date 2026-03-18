import { Mail, Phone, Copy, Check } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import './ContactSection.css';

const CONTACTS = [
  {
    label: 'Email',
    value: 'harshnpng@gmail.com',
    href: 'mailto:harshnpng@gmail.com',
    icon: Mail,
  },
  {
    label: 'Call',
    value: '+91-6200887791',
    href: 'tel:+916200887791',
    icon: Phone,
  },
];

export default function ContactSection() {
  const [particles, setParticles] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const particleIdRef = useRef(0);
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a new particle
    const createParticle = () => {
      const id = particleIdRef.current++;
      const size = Math.random() * 4 + 2; // 2px to 6px
      const tx = (Math.random() - 0.5) * 80; // random X travel
      const ty = (Math.random() - 0.5) * 80 - 40; // random Y travel, skewed upwards

      const newParticle = {
        id,
        x,
        y,
        size,
        tx,
        ty,
        color: Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(160, 200, 255, 0.6)',
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remove the particle after the animation completes
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    };

    // Spawn a burst of 3-4 particles simultaneously
    const amount = Math.floor(Math.random() * 2) + 3; 
    for (let i = 0; i < amount; i++) {
      createParticle();
    }
  }, []);

  const handleCopy = (e, id, value) => {
    e.preventDefault(); // Prevent opening the link
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section 
      className="contact-section" 
      aria-label="Contact information"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={containerRef}
        className="contact-section__inner glass-panel"
      >
        {/* Render Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="contact-section__particle"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
            }}
          />
        ))}

        <p className="contact-section__eyebrow">Contact</p>
        <h2 className="contact-section__title">Get in touch</h2>
        <p className="contact-section__copy">
          Reach out directly by email or phone.
        </p>

        <div className="contact-section__actions">
          {CONTACTS.map(({ label, value, href, icon: Icon }) => (
            <a
              key={href}
              className="contact-section__action"
              href={href}
            >
              <span className="contact-section__icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="contact-section__meta">
                <span className="contact-section__label">{label}</span>
                <span className="contact-section__value-wrapper">
                  <span className="contact-section__value">{value}</span>
                  <button 
                    className="contact-section__copy-btn"
                    onClick={(e) => handleCopy(e, href, value)}
                    title="Copy to clipboard"
                    aria-label={`Copy ${label}`}
                  >
                    {copiedId === href ? (
                      <Check size={14} className="contact-section__copy-icon is-copied" />
                    ) : (
                      <Copy size={14} className="contact-section__copy-icon" />
                    )}
                  </button>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
