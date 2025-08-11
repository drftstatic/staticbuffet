export type BrandSkin = 'testcard' | 'waffle' | 'ebn' | 'ozzy' | 'hogan' | 'dx' | 'maxheadroom' | 'mario' | 'dakota' | 'blondie';

export const getThemeClasses = (brandSkin: BrandSkin) => {
  switch (brandSkin) {
    case 'testcard':
      return {
        text: 'text-blue-400',
        textSecondary: 'text-blue-300',
        textMuted: 'text-blue-200/70',
        bg: 'bg-blue-500/20',
        bgSecondary: 'bg-blue-600/10',
        hover: 'hover:bg-blue-500/30',
        border: 'border-blue-500/50',
        borderSecondary: 'border-blue-400/30',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-400'
      };
    case 'waffle':
      return {
        text: 'text-amber-800',
        textSecondary: 'text-amber-700',
        textMuted: 'text-amber-600',
        bg: 'bg-amber-100/50',
        bgSecondary: 'bg-yellow-50/50',
        hover: 'hover:bg-amber-100/70',
        border: 'border-amber-400/50',
        borderSecondary: 'border-yellow-300/30',
        accent: 'text-amber-600',
        accentBg: 'bg-amber-400'
      };
    case 'ebn':
      return {
        text: 'text-lime-400',
        textSecondary: 'text-lime-300',
        textMuted: 'text-lime-200/70',
        bg: 'bg-lime-500/20',
        bgSecondary: 'bg-gray-800/50',
        hover: 'hover:bg-lime-500/30',
        border: 'border-lime-500/50',
        borderSecondary: 'border-lime-400/30',
        accent: 'text-lime-400',
        accentBg: 'bg-lime-500'
      };
    case 'ozzy':
      return {
        text: 'text-red-400',
        textSecondary: 'text-red-300',
        textMuted: 'text-red-200/70',
        bg: 'bg-red-600/20',
        bgSecondary: 'bg-black/80',
        hover: 'hover:bg-red-600/30',
        border: 'border-red-500/50',
        borderSecondary: 'border-red-400/30',
        accent: 'text-red-400',
        accentBg: 'bg-red-500'
      };
    case 'hogan':
      return {
        text: 'text-yellow-400',
        textSecondary: 'text-yellow-300',
        textMuted: 'text-yellow-200/70',
        bg: 'bg-yellow-500/20',
        bgSecondary: 'bg-gray-800/50',
        hover: 'hover:bg-yellow-500/30',
        border: 'border-yellow-500/50',
        borderSecondary: 'border-yellow-400/30',
        accent: 'text-yellow-400',
        accentBg: 'bg-yellow-500'
      };
    case 'dx':
      return {
        text: 'text-pink-400',
        textSecondary: 'text-pink-300',
        textMuted: 'text-pink-200/70',
        bg: 'bg-pink-600/20',
        bgSecondary: 'bg-pink-900/50',
        hover: 'hover:bg-pink-600/30',
        border: 'border-pink-500/50',
        borderSecondary: 'border-pink-400/30',
        accent: 'text-pink-400',
        accentBg: 'bg-pink-500'
      };
    case 'maxheadroom':
      return {
        text: 'text-cyan-400',
        textSecondary: 'text-cyan-300',
        textMuted: 'text-cyan-200/70',
        bg: 'bg-cyan-500/20',
        bgSecondary: 'bg-gray-800/50',
        hover: 'hover:bg-cyan-500/30',
        border: 'border-cyan-500/50',
        borderSecondary: 'border-cyan-400/30',
        accent: 'text-cyan-400',
        accentBg: 'bg-cyan-500'
      };
    case 'mario':
      return {
        text: 'text-red-400',
        textSecondary: 'text-red-300',
        textMuted: 'text-red-200/70',
        bg: 'bg-red-600/20',
        bgSecondary: 'bg-red-900/50',
        hover: 'hover:bg-red-600/30',
        border: 'border-red-500/50',
        borderSecondary: 'border-red-400/30',
        accent: 'text-red-400',
        accentBg: 'bg-red-500'
      };
    case 'dakota':
      return {
        text: 'text-stone-400',
        textSecondary: 'text-stone-300',
        textMuted: 'text-stone-200/70',
        bg: 'bg-stone-600/20',
        bgSecondary: 'bg-gray-800/50',
        hover: 'hover:bg-stone-600/30',
        border: 'border-stone-500/50',
        borderSecondary: 'border-stone-400/30',
        accent: 'text-stone-400',
        accentBg: 'bg-stone-500'
      };
    case 'blondie':
      return {
        text: 'text-amber-600',
        textSecondary: 'text-amber-500',
        textMuted: 'text-amber-400',
        bg: 'bg-amber-100/50',
        bgSecondary: 'bg-amber-50/50',
        hover: 'hover:bg-amber-100/70',
        border: 'border-amber-400/50',
        borderSecondary: 'border-amber-300/30',
        accent: 'text-amber-600',
        accentBg: 'bg-amber-500'
      };
    default:
      return getThemeClasses('testcard');
  }
};

// Apply consistent theme classes to common element patterns
export const getButtonClasses = (brandSkin: BrandSkin, variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
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

export const getPanelClasses = (brandSkin: BrandSkin) => {
  const theme = getThemeClasses(brandSkin);
  return `${theme.bgSecondary} border ${theme.border} rounded-lg`;
};

export const getTextClasses = (brandSkin: BrandSkin, type: 'primary' | 'secondary' | 'muted' = 'primary') => {
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