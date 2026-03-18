import { useRef, useState } from 'react';
import './MobileProjectSwipe.css';

const CARD_IMAGES = [
  '/project-cards/0001.webp',
  '/project-cards/0002.webp',
  '/project-cards/0003.webp',
  '/project-cards/0004.webp',
  '/project-cards/0005.webp',
];

const SWIPE_THRESHOLD = 64;
const SWIPE_RATIO = 1.15;

export default function MobileProjectSwipe() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState(null);
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    tracking: false,
  });

  const totalCards = CARD_IMAGES.length;
  const isLastCard = activeIndex === totalCards - 1;

  const beginTransition = (direction) => {
    if (transition) return;

    if (direction === 'forward') {
      if (isLastCard) {
        document.getElementById('experience')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        return;
      }

      setTransition({
        from: activeIndex,
        to: activeIndex + 1,
        direction,
      });
      return;
    }

    if (direction === 'backward' && activeIndex > 0) {
      setTransition({
        from: activeIndex,
        to: activeIndex - 1,
        direction,
      });
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch || transition) return;

    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      tracking: true,
    };
  };

  const handleTouchEnd = (event) => {
    if (!touchRef.current.tracking || transition) return;

    const touch = event.changedTouches?.[0];
    touchRef.current.tracking = false;
    if (!touch) return;

    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_RATIO;

    if (!isHorizontalSwipe) return;

    if (deltaX < 0) {
      beginTransition('forward');
      return;
    }

    beginTransition('backward');
  };

  const completeTransition = () => {
    if (!transition) return;

    setActiveIndex(transition.to);
    setTransition(null);
  };

  return (
    <section
      className="mobile-project-swipe"
      aria-label="Project cards"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mobile-project-swipe__inner">
        <div className="mobile-project-swipe__viewport">
          {!transition && (
            <article className="mobile-project-swipe__card mobile-project-swipe__card--current">
              <img
                src={CARD_IMAGES[activeIndex]}
                alt={`Project card ${activeIndex + 1}`}
                className="mobile-project-swipe__image"
              />
            </article>
          )}

          {transition && (
            <>
              <article
                className={`mobile-project-swipe__card mobile-project-swipe__card--exit mobile-project-swipe__card--exit-${transition.direction}`}
              >
                <img
                  src={CARD_IMAGES[transition.from]}
                  alt={`Project card ${transition.from + 1}`}
                  className="mobile-project-swipe__image"
                />
              </article>

              <article
                className={`mobile-project-swipe__card mobile-project-swipe__card--enter mobile-project-swipe__card--enter-${transition.direction}`}
                onAnimationEnd={completeTransition}
              >
                <img
                  src={CARD_IMAGES[transition.to]}
                  alt={`Project card ${transition.to + 1}`}
                  className="mobile-project-swipe__image"
                />
              </article>
            </>
          )}
        </div>

        <div className="mobile-project-swipe__footer">
          <div className="mobile-project-swipe__progress" aria-label={`Project ${activeIndex + 1} of ${totalCards}`}>
            {CARD_IMAGES.map((image, index) => (
              <span
                key={image}
                className={`mobile-project-swipe__dot ${index === activeIndex ? 'is-active' : ''}`}
              />
            ))}
          </div>
          <p className="mobile-project-swipe__status">
            {String(activeIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
            {isLastCard ? ' - next left swipe goes to Experience' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
