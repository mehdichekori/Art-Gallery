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
}

export interface MetMuseumObject {
  objectID: number;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  medium: string;
  repository: string;
  objectURL: string;
  tags?: Array<{ term: string }>;
}

export interface RijksmuseumObject {
  id: string;
  title: string;
  longTitle: string;
  principalOrFirstMaker: string;
  productionPlaces?: string[];
  label?: {
    description: string;
  };
  webImage: {
    url: string;
  };
}

export interface WikipediaSummary {
  extract: string;
  content_urls?: {
    desktop?: {
      page: string;
    };
  };
}
