'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';
import { getEnrichedPainting } from '@/lib/apis';
import ArtDisplay from './ArtDisplay';
import MetadataLabel from './MetadataLabel';
import ExpandedInfo from './ExpandedInfo';
import SettingsCog from './SettingsCog';
import { useFrameSelector } from '@/hooks/useFrameSelector';
import { useSettings } from '@/hooks/useSettings';

export default function Gallery() {
  const [currentArt, setCurrentArt] = useState<ArtPiece | null>(null);
  const [nextArt, setNextArt] = useState<ArtPiece | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set());
  const [totalHighlights, setTotalHighlights] = useState<number>(0);
  const [hasCheckedAllHighlights, setHasCheckedAllHighlights] = useState(false);
  const { currentFrame, selectRandomFrame } = useFrameSelector();
  const { refreshFrequency, canvasSize, onlyHighlighted, updateOnlyHighlighted } = useSettings();

  // Fetch initial artwork
  useEffect(() => {
    loadArtwork();
  }, []);

  // Set up rotation interval
  useEffect(() => {
    if (!currentArt) return;

    const interval = setInterval(() => {
      rotateArtwork();
    }, refreshFrequency);

    return () => clearInterval(interval);
  }, [currentArt, nextArt, refreshFrequency]);

  // Auto-disable highlights when we've shown enough of them
  useEffect(() => {
    if (onlyHighlighted && highlightIds.size > 0 && highlightIds.size % 50 === 0) {
      // After showing 50, 100, 150, etc. highlights, there's a chance we've seen most/all
      // Disable highlights to show the full collection
      console.log(`Shown ${highlightIds.size} highlights, switching to full collection`);
      updateOnlyHighlighted(false);
      setHasCheckedAllHighlights(true);
    }
  }, [highlightIds.size, onlyHighlighted, updateOnlyHighlighted]);

  const loadArtwork = async (preload = false) => {
    try {
      setError(null);
      const artPiece = await getEnrichedPainting(onlyHighlighted);

      if (!artPiece) {
        setError('No artwork found. Please try again.');
        return;
      }

      // Track highlight IDs and check if we've shown all highlights
      if (onlyHighlighted && artPiece.objectId) {
        setHighlightIds(prev => {
          const newSet = new Set(prev);
          newSet.add(artPiece.objectId!);
          return newSet;
        });

        // Auto-disable highlights when we've shown all available ones
        if (!hasCheckedAllHighlights) {
          setHasCheckedAllHighlights(true);
          // We'll check after a few highlights have been shown
        }
      }

      if (preload) {
        setNextArt(artPiece);
      } else {
        setCurrentArt(artPiece);
        // Preload next artwork
        setNextArt(null);
        loadArtwork(true);
      }
    } catch (err) {
      setError('Failed to load artwork. Please try again.');
      console.error('Error loading artwork:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const rotateArtwork = async () => {
    if (!nextArt) {
      // If we don't have a preloaded next artwork, load it
      loadArtwork(true);
      return;
    }

    setIsTransitioning(true);

    // Smooth transition with fade out and in
    setTimeout(() => {
      setCurrentArt(nextArt);
      setNextArt(null);
      selectRandomFrame();

      // Delay turning off transitioning to allow for fade-in animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);

      // Start loading the next artwork
      loadArtwork(true);
    }, 600);
  };

  const handleArtworkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedInfo(true);
  };

  const handleCloseExpanded = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedInfo(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseExpanded();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading gallery...</p>
      </div>
    );
  }

  if (error || !currentArt) {
    return (
      <div className="error-screen">
        <p>{error || 'No artwork available'}</p>
        <button onClick={() => loadArtwork()}>Try Again</button>
      </div>
    );
  }

  return (
    <div
      className="gallery-container"
      onClick={expandedInfo ? (e) => {
        // Close on any click on screen when panel is open
        handleBackdropClick(e);
      } : undefined}
    >
      <AnimatePresence mode="wait">
        {currentArt && !expandedInfo && (
          <ArtDisplay
            key={currentArt.objectId || currentArt.title}
            artPiece={currentArt}
            onClick={(e) => handleArtworkClick(e)}
            frameStyle={currentFrame}
            isExpanded={false}
            canvasSize={canvasSize}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentArt && !isTransitioning && !expandedInfo && (
          <MetadataLabel artPiece={currentArt} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentArt && expandedInfo && (
          <div className="artwork-with-panel-container" onClick={(e) => e.stopPropagation()}>
            <ArtDisplay
              artPiece={currentArt}
              onClick={(e) => handleArtworkClick(e)}
              frameStyle={currentFrame}
              isExpanded={true}
              canvasSize={canvasSize}
            />
            <ExpandedInfo
              artPiece={currentArt}
              isOpen={expandedInfo}
              onClose={handleCloseExpanded}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Preload indicator */}
      {nextArt && <div style={{ display: 'none' }} />}

      {/* Settings Cog */}
      <SettingsCog />
    </div>
  );
}
