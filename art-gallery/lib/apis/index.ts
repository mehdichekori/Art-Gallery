import { ArtPiece } from '@/types/art';
import { getRandomMetPainting, getWikipediaSummary } from './met';
import { getRandomRijksmuseumPainting } from './rijksmuseum';

/**
 * Get a random painting from any available source
 */
export async function getRandomPainting(): Promise<ArtPiece | null> {
  // Try both APIs
  const [metPainting, rijksmuseumPainting] = await Promise.allSettled([
    getRandomMetPainting(),
    getRandomRijksmuseumPainting(),
  ]);

  // Collect all successful results
  const paintings: ArtPiece[] = [];

  if (metPainting.status === 'fulfilled' && metPainting.value) {
    paintings.push(metPainting.value);
  }

  if (rijksmuseumPainting.status === 'fulfilled' && rijksmuseumPainting.value) {
    paintings.push(rijksmuseumPainting.value);
  }

  if (paintings.length === 0) {
    return null;
  }

  // Return a random painting from available sources
  return paintings[Math.floor(Math.random() * paintings.length)];
}

/**
 * Get enriched painting with Wikipedia context
 */
export async function getEnrichedPainting(): Promise<ArtPiece | null> {
  const painting = await getRandomPainting();

  if (!painting) {
    return null;
  }

  try {
    // Try to get Wikipedia summary for context
    const wikiSummary = await getWikipediaSummary(`${painting.artist} ${painting.title}`);

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
