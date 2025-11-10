export interface ArtPiece {
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
  museum: string;
  description?: string;
  objectId?: string;
  wikiUrl?: string;
  objectUrl?: string;
  dimensions?: string;
  culture?: string;
  period?: string;
  classification?: string;
  creditLine?: string;
  department?: string;
  primaryImageSmall?: string;
  isHighlight?: boolean;
}

export interface MetMuseumObject {
  objectID: number;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  artistNationality?: string;
  artistBeginDate?: string;
  artistEndDate?: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  repository: string;
  objectURL: string;
  culture?: string;
  period?: string;
  classification?: string;
  creditLine?: string;
  department?: string;
}

export interface WikipediaSummary {
  extract: string;
  content_urls?: {
    desktop?: {
      page: string;
    };
  };
}
