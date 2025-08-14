import { useToast } from '@/hooks/use-toast';

export interface SearchErrorInfo {
  type: 'network' | 'api' | 'rate-limit' | 'validation' | 'service-unavailable' | 'unknown';
  message: string;
  userMessage: string;
  suggestions: string[];
  canRetry: boolean;
  retryDelay?: number;
}

export class SearchErrorAnalyzer {
  static analyzeError(error: Error | string): SearchErrorInfo {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const lowerMessage = errorMessage.toLowerCase();

    // Network/Connection errors
    if (lowerMessage.includes('network') || lowerMessage.includes('failed to fetch') || lowerMessage.includes('connection')) {
      return {
        type: 'network',
        message: errorMessage,
        userMessage: '🌐 Connection Issue - Archive.org may be temporarily slow',
        suggestions: [
          'Check your internet connection',
          'Archive.org servers may be experiencing high traffic',
          'Try again in a few moments',
          'Consider using simpler search terms'
        ],
        canRetry: true,
        retryDelay: 3000
      };
    }

    // Rate limiting
    if (lowerMessage.includes('rate limited') || lowerMessage.includes('429') || lowerMessage.includes('too many requests')) {
      return {
        type: 'rate-limit',
        message: errorMessage,
        userMessage: '⏱️ Slow down - Archive.org needs a breather!',
        suggestions: [
          'Wait 10-15 seconds before searching again',
          'Archive.org limits how fast we can search their free database',
          'Consider refining your search to be more specific',
          'This helps keep the service free for everyone'
        ],
        canRetry: true,
        retryDelay: 10000
      };
    }

    // API/Service errors
    if (lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503') || lowerMessage.includes('504')) {
      return {
        type: 'service-unavailable',
        message: errorMessage,
        userMessage: '🏛️ Archive.org is having technical difficulties',
        suggestions: [
          'Archive.org servers are temporarily overloaded',
          'This is common during peak hours (US evenings)',
          'Try again in 5-10 minutes',
          'Archive.org maintains millions of free videos - occasional hiccups happen!'
        ],
        canRetry: true,
        retryDelay: 30000
      };
    }

    // Validation errors
    if (lowerMessage.includes('empty') || lowerMessage.includes('validation') || lowerMessage.includes('invalid')) {
      return {
        type: 'validation',
        message: errorMessage,
        userMessage: '📝 Search terms need adjustment',
        suggestions: [
          'Enter at least 2 characters',
          'Try common words like "nature", "music", or "documentary"',
          'Avoid special characters or very short terms',
          'Browse our suggested searches for inspiration'
        ],
        canRetry: false
      };
    }

    // JSON/parsing errors (usually API issues)
    if (lowerMessage.includes('json') || lowerMessage.includes('parse') || lowerMessage.includes('unexpected token')) {
      return {
        type: 'api',
        message: errorMessage,
        userMessage: '🔧 Archive.org sent scrambled data',
        suggestions: [
          'Archive.org\'s response format was unexpected',
          'This usually resolves itself quickly',
          'Try a different search term',
          'If this persists, Archive.org may be updating their systems'
        ],
        canRetry: true,
        retryDelay: 5000
      };
    }

    // Generic fallback
    return {
      type: 'unknown',
      message: errorMessage,
      userMessage: '🤔 Something unexpected happened',
      suggestions: [
        'Static Buffet is a free tool that searches Archive.org\'s massive database',
        'Archive.org occasionally experiences high traffic or maintenance',
        'Try a different search term or wait a moment',
        'Most issues resolve themselves within a few minutes'
      ],
      canRetry: true,
      retryDelay: 5000
    };
  }

  static getEducationalMessage(errorInfo: SearchErrorInfo): string {
    const baseEducation = `
💡 About Static Buffet:
• Free tool searching Archive.org's public domain videos
• Archive.org hosts millions of videos from libraries, museums, and archives
• Occasional slowdowns are normal for free services handling massive data
• All content is legally free to use and remix
    `.trim();

    return baseEducation;
  }

  static shouldShowRetryButton(errorInfo: SearchErrorInfo): boolean {
    return errorInfo.canRetry && errorInfo.type !== 'validation';
  }

  static getRetryDelay(errorInfo: SearchErrorInfo): number {
    return errorInfo.retryDelay || 2000;
  }
}

export function useSmartErrorToast() {
  const { toast } = useToast();

  return (error: Error | string, options: { 
    showEducation?: boolean;
    allowRetry?: boolean;
    onRetry?: () => void;
  } = {}) => {
    const errorInfo = SearchErrorAnalyzer.analyzeError(error);
    
    const description = [
      errorInfo.userMessage,
      '',
      ...errorInfo.suggestions.map(s => `• ${s}`),
      ...(options.showEducation ? ['', SearchErrorAnalyzer.getEducationalMessage(errorInfo)] : [])
    ].join('\n');

    toast({
      title: "Search Issue",
      description,
      variant: errorInfo.type === 'rate-limit' ? 'default' : 'destructive',
      duration: errorInfo.type === 'rate-limit' ? 8000 : 6000,
      action: options.allowRetry && SearchErrorAnalyzer.shouldShowRetryButton(errorInfo) ? {
        altText: "Retry search",
        onClick: () => {
          if (options.onRetry) {
            setTimeout(options.onRetry, 1000); // Brief delay before retry
          }
        }
      } : undefined
    });

    // Return error info for further handling if needed
    return errorInfo;
  };
}