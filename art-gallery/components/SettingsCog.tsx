'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsPanel from './SettingsPanel';

export default function SettingsCog() {
  const [showCog, setShowCog] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  // Handle mouse movement to show/hide cog
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setLastMouseMove(Date.now());
      setShowCog(true);

      // Hide cog after 3 seconds of no movement
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - lastMouseMove >= 3000) {
          setShowCog(false);
          setShowPanel(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [lastMouseMove]);

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
