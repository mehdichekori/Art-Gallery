export type RefreshFrequency = 5000 | 15000 | 30000 | 60000 | 300000 | 600000 | 900000 | 1800000 | 3600000;

export const REFRESH_FREQUENCIES: { value: RefreshFrequency; label: string }[] = [
  { value: 5000, label: '5 seconds' },
  { value: 15000, label: '15 seconds' },
  { value: 30000, label: '30 seconds' },
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '60 minutes' },
];

export type CanvasSize = 'small' | 'medium' | 'large' | 'extra-large';

export const CANVAS_SIZES: { value: CanvasSize; label: string; dimensions: string }[] = [
  { value: 'small', label: 'Small', dimensions: '400x300' },
  { value: 'medium', label: 'Medium', dimensions: '600x450' },
  { value: 'large', label: 'Large', dimensions: '800x600' },
  { value: 'extra-large', label: 'Extra Large', dimensions: '1000x750' },
];

export const getCanvasDimensions = (size: CanvasSize): { width: number; height: number } => {
  const dimensions: Record<CanvasSize, { width: number; height: number }> = {
    'small': { width: 400, height: 300 },
    'medium': { width: 600, height: 450 },
    'large': { width: 800, height: 600 },
    'extra-large': { width: 1000, height: 750 },
  };
  return dimensions[size];
};

export type Theme = 'light' | 'dark';

export interface Settings {
  refreshFrequency: RefreshFrequency;
  showDetailsBeforeClick: boolean;
  theme: Theme;
  canvasSize: CanvasSize;
  onlyHighlighted: boolean;
}

export const defaultSettings: Settings = {
  refreshFrequency: 15000, // 15 seconds
  showDetailsBeforeClick: false,
  theme: 'light',
  canvasSize: 'extra-large',
  onlyHighlighted: true,
};
