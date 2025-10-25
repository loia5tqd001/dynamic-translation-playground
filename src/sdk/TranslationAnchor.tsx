import React, { useEffect } from 'react';
import type { TranslationAnchorProps } from './types';
import {
  useIncrementVisibilityCounter,
  useDecrementVisibilityCounter,
} from './GlobalTranslationProvider';

/**
 * TranslationAnchor - Wrap this around dynamic content areas
 *
 * This component manages button visibility by incrementing/decrementing a counter.
 * When mounted with dynamic content (translation_status === 1), it increments the counter.
 * When unmounted, it decrements the counter.
 * The translation button is visible when counter > 0.
 *
 * Usage patterns:
 * 1. One API, one anchor:
 *    <TranslationAnchor translation_status={api.translation_status}>
 *      <DynamicContent />
 *    </TranslationAnchor>
 *
 * 2. One API, multiple anchors (for separate dynamic sections):
 *    <TranslationAnchor translation_status={api.translation_status}>
 *      <DynamicSection1 />
 *    </TranslationAnchor>
 *    <TranslationAnchor translation_status={api.translation_status}>
 *      <DynamicSection2 />
 *    </TranslationAnchor>
 *
 * 3. Multiple APIs, nested anchors:
 *    <TranslationAnchor translation_status={api1.translation_status}>
 *      <TranslationAnchor translation_status={api2.translation_status}>
 *        <DynamicContent />
 *      </TranslationAnchor>
 *    </TranslationAnchor>
 */
export const TranslationAnchor = ({
  children,
  translation_status,
}: TranslationAnchorProps) => {
  const incrementCounter = useIncrementVisibilityCounter();
  const decrementCounter = useDecrementVisibilityCounter();

  useEffect(() => {
    // Only increment if translation_status is 1 (has dynamic content)
    if (translation_status === 1) {
      incrementCounter();
    }

    // Cleanup: decrement on unmount or when translation_status changes
    return () => {
      if (translation_status === 1) {
        decrementCounter();
      }
    };
  }, [translation_status, incrementCounter, decrementCounter]);

  return <>{children}</>;
};
