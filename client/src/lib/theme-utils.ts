export type BrandSkin = 'testcard' | 'waffle' | 'ebn' | 'ozzy' | 'hogan' | 'dx' | 'maxheadroom' | 'mario' | 'dakota' | 'blondie' | 'diner';

export const getThemeClasses = (brandSkin: BrandSkin): {
  text: string;
  textSecondary: string;
  textMuted: string;
  bg: string;
  bgSecondary: string;
  hover: string;
  border: string;
  borderSecondary: string;
  accent: string;
  accentBg: string;
} => {
  switch (brandSkin) {
    case 'testcard':
      return {
        text: 'text-white',
        textSecondary: 'text-cyan-300',
        textMuted: 'text-yellow-300',
        bg: 'bg-black/95',
        bgSecondary: 'bg-blue-900/90',
        hover: 'hover:bg-red-900/50',
        border: 'border-cyan-400/60',
        borderSecondary: 'border-magenta-400/40',
        accent: 'text-cyan-300',
        accentBg: 'bg-red-600'
      };
    case 'waffle':
      return {
        text: 'text-yellow-900',
        textSecondary: 'text-yellow-800',
        textMuted: 'text-yellow-700',
        bg: 'bg-yellow-300/95',
        bgSecondary: 'bg-yellow-200/90',
        hover: 'hover:bg-yellow-400/50',
        border: 'border-yellow-800/60',
        borderSecondary: 'border-yellow-700/50',
        accent: 'text-yellow-800',
        accentBg: 'bg-yellow-700'
      };
    case 'ebn':
      return {
        text: 'text-lime-300',
        textSecondary: 'text-purple-300',
        textMuted: 'text-cyan-400',
        bg: 'bg-black/95',
        bgSecondary: 'bg-purple-950/80',
        hover: 'hover:bg-purple-900/60',
        border: 'border-lime-400/60',
        borderSecondary: 'border-purple-500/40',
        accent: 'text-lime-300',
        accentBg: 'bg-purple-600'
      };
    case 'ozzy':
      return {
        text: 'text-red-300',
        textSecondary: 'text-white',
        textMuted: 'text-gray-400',
        bg: 'bg-black/95',
        bgSecondary: 'bg-red-950/80',
        hover: 'hover:bg-red-900/60',
        border: 'border-red-500/60',
        borderSecondary: 'border-red-600/40',
        accent: 'text-red-400',
        accentBg: 'bg-red-700'
      };
    case 'hogan':
      return {
        text: 'text-white',
        textSecondary: 'text-yellow-300',
        textMuted: 'text-gray-300',
        bg: 'bg-black/95',
        bgSecondary: 'bg-black/90',
        hover: 'hover:bg-yellow-500/20',
        border: 'border-yellow-400/50',
        borderSecondary: 'border-white/30',
        accent: 'text-yellow-400',
        accentBg: 'bg-yellow-500'
      };
    case 'dx':
      return {
        text: 'text-green-400',
        textSecondary: 'text-green-300',
        textMuted: 'text-green-500',
        bg: 'bg-black/95',
        bgSecondary: 'bg-gray-900/90',
        hover: 'hover:bg-green-950/60',
        border: 'border-green-500/40',
        borderSecondary: 'border-green-600/30',
        accent: 'text-green-400',
        accentBg: 'bg-green-600'
      };
    case 'maxheadroom':
      return {
        text: 'text-orange-300',
        textSecondary: 'text-yellow-300',
        textMuted: 'text-orange-400',
        bg: 'bg-black/95',
        bgSecondary: 'bg-gray-900/90',
        hover: 'hover:bg-orange-950/60',
        border: 'border-orange-500/60',
        borderSecondary: 'border-yellow-500/40',
        accent: 'text-orange-400',
        accentBg: 'bg-orange-600'
      };
    case 'mario':
      return {
        text: 'text-red-300',
        textSecondary: 'text-blue-300',
        textMuted: 'text-red-400',
        bg: 'bg-blue-950/90',
        bgSecondary: 'bg-blue-900/85',
        hover: 'hover:bg-red-900/50',
        border: 'border-red-500/40',
        borderSecondary: 'border-blue-500/30',
        accent: 'text-red-400',
        accentBg: 'bg-red-600'
      };
    case 'dakota':
      return {
        text: 'text-white',
        textSecondary: 'text-gray-200',
        textMuted: 'text-gray-400',
        bg: 'bg-slate-800/95',
        bgSecondary: 'bg-slate-700/90',
        hover: 'hover:bg-slate-600/50',
        border: 'border-white/30',
        borderSecondary: 'border-gray-400/20',
        accent: 'text-white',
        accentBg: 'bg-slate-600'
      };
    case 'blondie':
      return {
        text: 'text-pink-300',
        textSecondary: 'text-cyan-300',
        textMuted: 'text-purple-400',
        bg: 'bg-black/95',
        bgSecondary: 'bg-purple-950/80',
        hover: 'hover:bg-pink-950/60',
        border: 'border-pink-500/60',
        borderSecondary: 'border-cyan-500/40',
        accent: 'text-pink-400',
        accentBg: 'bg-pink-600'
      };
    case 'diner':
      return {
        text: 'text-red-800',
        textSecondary: 'text-red-700',
        textMuted: 'text-red-600',
        bg: 'bg-yellow-50/95',
        bgSecondary: 'bg-red-50/90',
        hover: 'hover:bg-red-100/50',
        border: 'border-red-600/40',
        borderSecondary: 'border-red-500/30',
        accent: 'text-red-700',
        accentBg: 'bg-red-700'
      };
    default:
      return getThemeClasses('testcard');
  }
};

// Apply consistent theme classes to common element patterns
export const getButtonClasses = (brandSkin: BrandSkin, variant: 'primary' | 'secondary' | 'ghost' = 'primary'): string => {
  const theme = getThemeClasses(brandSkin);
  
  switch (variant) {
    case 'primary':
      return `${theme.accentBg} text-white ${theme.hover} border ${theme.border}`;
    case 'secondary':
      return `${theme.bg} ${theme.text} ${theme.hover} border ${theme.borderSecondary}`;
    case 'ghost':
      return `transparent ${theme.text} ${theme.hover} border ${theme.borderSecondary}`;
    default:
      return getButtonClasses(brandSkin, 'primary');
  }
};

export const getPanelClasses = (brandSkin: BrandSkin): string => {
  const theme = getThemeClasses(brandSkin);
  return `${theme.bgSecondary} border ${theme.border} rounded-lg`;
};

export const getTextClasses = (brandSkin: BrandSkin, type: 'primary' | 'secondary' | 'muted' = 'primary'): string => {
  const theme = getThemeClasses(brandSkin);
  
  switch (type) {
    case 'primary':
      return theme.text;
    case 'secondary':
      return theme.textSecondary;
    case 'muted':
      return theme.textMuted;
    default:
      return theme.text;
  }
};