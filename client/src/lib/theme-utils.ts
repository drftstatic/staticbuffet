// Single identity theme: EBN Hijack — dark charcoal, signal-lime accents,
// live-broadcast aesthetic. The brandSkin parameter survives on these helpers
// only to avoid churning every call site; it is ignored.
export type BrandSkin = 'ebn';

const THEME = {
  text: 'text-lime-300',
  textSecondary: 'text-purple-300',
  textMuted: 'text-cyan-400',
  bg: 'bg-black/95',
  bgSecondary: 'bg-purple-950/80',
  hover: 'hover:bg-purple-900/60',
  border: 'border-lime-400/60',
  borderSecondary: 'border-purple-500/40',
  accent: 'text-lime-300',
  accentBg: 'bg-purple-600',
} as const;

export const getThemeClasses = (_brandSkin?: BrandSkin) => THEME;

export const getButtonClasses = (
  brandSkin?: BrandSkin,
  variant: 'primary' | 'secondary' | 'ghost' = 'primary'
): string => {
  switch (variant) {
    case 'secondary':
      return `${THEME.bg} ${THEME.text} ${THEME.hover} border ${THEME.borderSecondary}`;
    case 'ghost':
      return `transparent ${THEME.text} ${THEME.hover} border ${THEME.borderSecondary}`;
    case 'primary':
    default:
      return `${THEME.accentBg} text-white ${THEME.hover} border ${THEME.border}`;
  }
};

export const getPanelClasses = (_brandSkin?: BrandSkin): string =>
  `${THEME.bgSecondary} border ${THEME.border} rounded-lg`;

export const getTextClasses = (
  _brandSkin?: BrandSkin,
  type: 'primary' | 'secondary' | 'muted' = 'primary'
): string => {
  switch (type) {
    case 'secondary':
      return THEME.textSecondary;
    case 'muted':
      return THEME.textMuted;
    case 'primary':
    default:
      return THEME.text;
  }
};
