'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { REFRESH_FREQUENCIES, CANVAS_SIZES, Theme } from '@/types/settings';

interface SettingsPanelProps {
  onClose: () => void;
  onBackdropClick: () => void;
}

export default function SettingsPanel({ onClose, onBackdropClick }: SettingsPanelProps) {
  const {
    refreshFrequency,
    showDetailsBeforeClick,
    theme,
    canvasSize,
    onlyHighlighted,
    updateRefreshFrequency,
    updateShowDetailsBeforeClick,
    updateTheme,
    updateCanvasSize,
    updateOnlyHighlighted,
    resetSettings,
  } = useSettings();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="settings-backdrop"
        onClick={onBackdropClick}
      />

      {/* Settings Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="settings-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close-button" onClick={onClose} aria-label="Close settings">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          {/* Refresh Frequency Section */}
          <div className="settings-section">
            <label className="settings-label">Refresh Frequency</label>
            <div className="settings-description">
              How often the artwork should automatically change
            </div>
            <select
              className="settings-select"
              value={refreshFrequency}
              onChange={(e) => updateRefreshFrequency(Number(e.target.value) as any)}
            >
              {REFRESH_FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Canvas Size Section */}
          <div className="settings-section">
            <label className="settings-label">Canvas Size</label>
            <div className="settings-description">
              Adjust the size of the artwork display canvas
            </div>
            <select
              className="settings-select"
              value={canvasSize}
              onChange={(e) => updateCanvasSize(e.target.value as any)}
            >
              {CANVAS_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label} ({size.dimensions})
                </option>
              ))}
            </select>
          </div>

          {/* Artwork Details Section */}
          <div className="settings-section">
            <label className="settings-label">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={showDetailsBeforeClick}
                onChange={(e) => updateShowDetailsBeforeClick(e.target.checked)}
              />
              <span>Show Details Before Click</span>
            </label>
            <div className="settings-description">
              Display artwork metadata (title, artist, etc.) before clicking on a piece
            </div>
          </div>

          {/* Highlighted Only Section */}
          <div className="settings-section">
            <label className="settings-label">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={onlyHighlighted}
                onChange={(e) => updateOnlyHighlighted(e.target.checked)}
              />
              <span>Only Highlighted Works</span>
            </label>
            <div className="settings-description">
              Display only highlighted artworks from the museum's permanent collection
            </div>
          </div>

          {/* Theme Section */}
          <div className="settings-section">
            <label className="settings-label">Theme</label>
            <div className="settings-description">Choose your preferred color scheme</div>
            <div className="settings-radio-group">
              <label className="settings-radio-label">
                <input
                  type="radio"
                  className="settings-radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => updateTheme('light' as Theme)}
                />
                <span>Light Mode</span>
                <div className="theme-preview light-preview" />
              </label>
              <label className="settings-radio-label">
                <input
                  type="radio"
                  className="settings-radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => updateTheme('dark' as Theme)}
                />
                <span>Dark Mode</span>
                <div className="theme-preview dark-preview" />
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="settings-section">
            <button className="settings-reset-button" onClick={resetSettings}>
              Reset to Defaults
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
