import { useMediaQuery as useReactResponsiveMediaQuery } from 'react-responsive';

/**
 * Custom wrapper around react-responsive useMediaQuery to maintain
 * consistent API with previous hook and prevent hydration issues.
 * Defaults to 768px for mobile.
 */
export function useMediaQuery(query = '(max-width: 768px)') {
  const matches = useReactResponsiveMediaQuery({ query });
  return matches;
}
