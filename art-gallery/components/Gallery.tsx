'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtPiece } from '@/types/art';
import { getEnrichedPainting } from '@/lib/apis';
import ArtDisplay from './ArtDisplay';
import MetadataLabel from './MetadataLabel';
import ExpandedInfo from './ExpandedInfo';
import { useFrameSelector } from '@/hooks/useFrameSelector';

const ROTATION_INTERVAL = 45000; // 45 seconds (between 30-60)

export default function Gallery() {
  const [currentArt, setCurrentArt] = useState<ArtPiece | null>(null);
  const [nextArt, setNextArt] = useState<ArtPiece | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const { currentFrame, selectRandomFrame } = useFrameSelector();

  // Fetch initial artwork
  useEffect(() => {
    loadArtwork();
  }, []);

  // Set up rotation interval
  useEffect(() => {
    if (!currentArt) return;

    const interval = setInterval(() => {
      rotateArtwork();
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [currentArt, nextArt]);

  const loadArtwork = async (preload = false) => {
    try {
      setError(null);
      const artPiece = await getEnrichedPainting();

      if (!artPiece) {
        setError('No artwork found. Please try again.');
        return;
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
            onClick={handleArtworkClick}
            frameStyle={currentFrame}
            isExpanded={false}
            isTransitioning={isTransitioning}
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
              onClick={handleArtworkClick}
              frameStyle={currentFrame}
              isExpanded={true}
              isTransitioning={isTransitioning}
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
    </div>
  );
}
