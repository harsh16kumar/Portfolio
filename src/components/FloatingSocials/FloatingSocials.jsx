import { useState } from 'react';
import { Share2, Linkedin, Github, Code2, X, FileText } from 'lucide-react';
import './FloatingSocials.css';

const SOCIAL_LINKS = [
  {
    id: 'resume',
    icon: FileText,
    url: 'https://drive.google.com/file/d/1fbLkDu4D_LM2CBoNk3xhmOCHO2UqrZSQ/view?usp=sharing',
    label: 'Resume',
    color: '#ef4444' // Red color to stand out for Resume/PDF
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/harsh-kumar-535aa024a',
    label: 'LinkedIn',
    color: '#0A66C2'
  },
  {
    id: 'github',
    icon: Github,
    url: 'https://github.com/harsh16kumar',
    label: 'GitHub',
    color: '#333333'
  },
  {
    id: 'leetcode',
    icon: Code2,
    url: 'https://leetcode.com/u/harshnpng/',
    label: 'LeetCode',
    color: '#FFA116'
  }
];

export default function FloatingSocials() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-socials">
      <div className={`floating-socials__menu ${isOpen ? 'is-open' : ''}`}>
        {SOCIAL_LINKS.map((link, index) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-socials__link"
            aria-label={link.label}
            title={link.label}
            style={{
              '--index': index,
              '--hover-color': link.color
            }}
          >
            <link.icon size={20} />
          </a>
        ))}
      </div>

      <button
        className={`floating-socials__toggle ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close social links" : "Open social links"}
        aria-expanded={isOpen}
      >
        <div className="floating-socials__toggle-inner">
          <Share2 className="floating-socials__icon-open" size={24} />
          <X className="floating-socials__icon-close" size={24} />
        </div>
      </button>
    </div>
  );
}
