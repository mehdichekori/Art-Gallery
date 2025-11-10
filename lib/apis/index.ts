import { ArtPiece } from '@/types/art';
import { getRandomMetPainting, getWikipediaSummary } from './met';

/**
 * Get a random painting from The Met Museum
 */
export async function getRandomPainting(onlyHighlighted = false): Promise<ArtPiece | null> {
  return getRandomMetPainting(onlyHighlighted);
}

/**
 * Get enriched painting with Wikipedia context
 */
export async function getEnrichedPainting(onlyHighlighted = false): Promise<ArtPiece | null> {
  const painting = await getRandomPainting(onlyHighlighted);

  if (!painting) {
    return null;
  }

  try {
    // Try to get Wikipedia summary for context - use artist name only
    // as it's more likely to have a Wikipedia page than the artwork itself
    const artistName = painting.artist.replace(/\s*\([^)]*\)\s*/g, '').trim();
    const wikiSummary = await getWikipediaSummary(artistName);

    if (wikiSummary && wikiSummary.extract) {
      return {
        ...painting,
        description: wikiSummary.extract,
        wikiUrl: wikiSummary.content_urls?.desktop?.page,
      };
    }
  } catch (error) {
    console.error('Error enriching painting with Wikipedia:', error);
  }

  return painting;
}
