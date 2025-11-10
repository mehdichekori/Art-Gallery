'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsPanel from './SettingsPanel';

export default function SettingsCog() {
  const [showCog, setShowCog] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isMouseOnScreen, setIsMouseOnScreen] = useState(false);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  // Handle mouse entering/leaving the document
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsMouseOnScreen(true);
      setShowCog(true);
      setLastMouseMove(Date.now());
    };

    const handleMouseLeave = () => {
      setIsMouseOnScreen(false);
      setShowCog(false);
      setShowPanel(false);
    };

    const handleMouseMove = () => {
      setLastMouseMove(Date.now());
      if (isMouseOnScreen) {
        setShowCog(true);
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseOnScreen]);

  // Hide cog after 5 seconds of no movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMouseOnScreen && Date.now() - lastMouseMove > 5000) {
        setShowCog(false);
        setShowPanel(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMouseOnScreen, lastMouseMove]);

  const handleCogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPanel(!showPanel);
  };

  const handleBackdropClick = () => {
    setShowPanel(false);
  };

  return (
    <>
      <AnimatePresence>
        {showCog && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="settings-cog-button"
            onClick={handleCogClick}
            aria-label="Open settings"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPanel && (
          <SettingsPanel onClose={() => setShowPanel(false)} onBackdropClick={handleBackdropClick} />
        )}
      </AnimatePresence>
    </>
  );
}
