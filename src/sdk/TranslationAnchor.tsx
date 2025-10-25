import { useEffect, useRef, useState } from 'react'
import {
  useDecrementVisibilityCounter,
  useIncrementVisibilityCounter,
} from './GlobalTranslationProvider'
import type { TranslationAnchorProps } from './types'

/**
 * TranslationAnchor - Wrap this around dynamic content areas
 *
 * This component manages button visibility by tracking both:
 * 1. Whether it has translated content (translation_status === 1)
 * 2. Whether it's visible in the viewport (using IntersectionObserver)
 *
 * The translation button only shows when at least one anchor is:
 * - Has translation_status === 1 AND
 * - Is visible in the viewport
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
  const incrementCounter = useIncrementVisibilityCounter()
  const decrementCounter = useDecrementVisibilityCounter()
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Track viewport visibility using IntersectionObserver
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      {
        // Trigger when any part of the anchor is visible
        threshold: 0,
        // Add some margin to trigger slightly before entering viewport
        rootMargin: '50px',
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Manage counter based on both translation_status and visibility
  useEffect(() => {
    const shouldCount = translation_status === 1 && isVisible

    if (shouldCount) {
      incrementCounter()
    }

    return () => {
      if (shouldCount) {
        decrementCounter()
      }
    }
  }, [translation_status, isVisible, incrementCounter, decrementCounter])

  return (
    <div
      ref={elementRef}
      className={`translation-anchor ${isVisible ? 'in-viewport' : 'out-viewport'}`}
      data-translation-status={translation_status}
    >
      {children}
    </div>
  )
}
