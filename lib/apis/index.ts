import { ArtPiece } from '@/types/art';
import {
  getRandomMetPainting,
  getWikipediaSummary,
  getWikipediaPageTitleFromWikidata,
} from './met';

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
  console.log('[Enrich] Starting enrichment', { onlyHighlighted });
  const painting = await getRandomPainting(onlyHighlighted);

  if (!painting) {
    console.log('[Enrich] No painting found');
    return null;
  }

  console.log('[Enrich] Got painting:', painting.title, 'by', painting.artist);
  console.log('[Enrich] Wikidata URLs - object:', painting.objectWikidataUrl, 'artist:', painting.artistWikidataUrl);

  try {
    let workSummary: any = null;
    let authorSummary: any = null;
    let workWikiUrl: string | undefined;
    let authorWikiUrl: string | undefined;

    // First, try to get Wikipedia summary for the artwork using Wikidata ID
    if (painting.objectWikidataUrl) {
      console.log('[Enrich] Attempting to fetch work info via Wikidata');
      try {
        const workPageTitle = await getWikipediaPageTitleFromWikidata(painting.objectWikidataUrl);
        if (workPageTitle) {
          workSummary = await getWikipediaSummary(workPageTitle);
          workWikiUrl = workSummary?.content_urls?.desktop?.page;
          console.log('[Enrich] Work summary obtained via Wikidata');
        } else {
          console.log('[Enrich] No work page title from Wikidata');
        }
      } catch (error) {
        console.warn('[Enrich] Failed to fetch work summary from Wikidata:', error);
      }
    } else {
      console.log('[Enrich] No object Wikidata URL available');
    }

    // Also try to get Wikipedia summary for the artist using Wikidata ID
    if (painting.artistWikidataUrl) {
      console.log('[Enrich] Attempting to fetch artist info via Wikidata');
      try {
        const artistPageTitle = await getWikipediaPageTitleFromWikidata(painting.artistWikidataUrl);
        if (artistPageTitle) {
          authorSummary = await getWikipediaSummary(artistPageTitle);
          authorWikiUrl = authorSummary?.content_urls?.desktop?.page;
          console.log('[Enrich] Artist summary obtained via Wikidata');
        } else {
          console.log('[Enrich] No artist page title from Wikidata');
        }
      } catch (error) {
        console.warn('[Enrich] Failed to fetch author summary from Wikidata:', error);
      }
    } else {
      console.log('[Enrich] No artist Wikidata URL available');
    }

    // If Wikidata method didn't work, try fallback to using title/name directly
    if (!workSummary && !authorSummary) {
      console.log('[Enrich] Wikidata method failed, trying fallback to title/name');
      try {
        // Try work title
        const workTitle = painting.title;
        console.log('[Enrich] Fetching work by title:', workTitle);
        workSummary = await getWikipediaSummary(workTitle);
        workWikiUrl = workSummary?.content_urls?.desktop?.page;

        // Try artist name
        const artistName = painting.artist.replace(/\s*\([^)]*\)\s*/g, '').trim();
        console.log('[Enrich] Fetching artist by name:', artistName);
        authorSummary = await getWikipediaSummary(artistName);
        authorWikiUrl = authorSummary?.content_urls?.desktop?.page;
      } catch (error) {
        console.warn('[Enrich] Fallback Wikipedia fetch also failed:', error);
      }
    }

    // If we have a work summary, combine it with the author summary
    if (workSummary && workSummary.extract) {
      let combinedDescription = workSummary.extract;

      // Add author summary after work summary if available
      if (authorSummary && authorSummary.extract) {
        combinedDescription += '\n\n' + authorSummary.extract;
        console.log('[Enrich] Combined work + author summaries');
      } else {
        console.log('[Enrich] Using only work summary');
      }

      // Use the work summary's Wikipedia URL as the primary wiki URL
      const result = {
        ...painting,
        description: combinedDescription,
        wikiUrl: workWikiUrl,
      };
      console.log('[Enrich] Returning painting with work summary first');
      return result;
    }

    // If no work summary, fall back to author summary
    if (authorSummary && authorSummary.extract) {
      const result = {
        ...painting,
        description: authorSummary.extract,
        wikiUrl: authorWikiUrl,
      };
      console.log('[Enrich] Returning painting with author summary only');
      return result;
    }

    console.log('[Enrich] No Wikipedia summaries obtained, returning painting without enrichment');
  } catch (error) {
    console.error('[Enrich] Error enriching painting with Wikipedia:', error);
  }

  return painting;
}
