import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from './Toast'
import type { TransifyConfig, TranslationButtonConfig } from './types'

type TranslationButtonProps = TranslationButtonConfig &
  TransifyConfig & {
    isTranslated: boolean
    onToggle: () => void
  }

const STORAGE_KEY = 'translation-button-position'
const DRAG_THRESHOLD = 5 // Minimum pixels to be considered a drag

export const TranslationButton = ({
  verticalSpacing = 'bottom',
  spacingValue = '100px',
  translateText = 'Translate',
  seeOriginalText = 'See Original',
  updateToastText = 'Language updated',
  zIndex = 10000, // Higher than drawer (9500)
  onTranslationStateChange,
  refCallback,
  isTranslated,
  onToggle,
}: TranslationButtonProps) => {
  const { showToast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)

  // Load persisted position from localStorage
  const [dragPosition, setDragPosition] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? parseFloat(saved) : null
    } catch {
      return null
    }
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const dragStartY = useRef<number>(0)
  const dragStartPosition = useRef<number>(0)

  const handleTranslationToggle = (e: React.MouseEvent) => {
    // Only toggle if not dragging AND didn't move during the interaction
    if (hasMoved) return
    e.stopPropagation()
    onToggle()
    onTranslationStateChange?.(!isTranslated)
    showToast(updateToastText)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    e.preventDefault()
    setIsDragging(true)
    setHasMoved(false)
    dragStartY.current = e.clientY

    // Get current position
    const currentPosition =
      dragPosition ??
      (typeof spacingValue === 'number'
        ? spacingValue
        : parseFloat(spacingValue))
    dragStartPosition.current = currentPosition
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setHasMoved(false)
    dragStartY.current = e.touches[0].clientY

    // Get current position
    const currentPosition =
      dragPosition ??
      (typeof spacingValue === 'number'
        ? spacingValue
        : parseFloat(spacingValue))
    dragStartPosition.current = currentPosition
  }

  const calculateNewPosition = useCallback(
    (clientY: number) => {
      const deltaY = clientY - dragStartY.current
      const windowHeight = window.innerHeight

      // Calculate new position based on vertical spacing direction
      let newPosition: number
      if (verticalSpacing === 'bottom') {
        newPosition = dragStartPosition.current - deltaY
      } else {
        newPosition = dragStartPosition.current + deltaY
      }

      // Clamp position to viewport bounds (min 20px, max 80% of viewport)
      return Math.max(20, Math.min(windowHeight * 0.8, newPosition))
    },
    [verticalSpacing],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      // Check if moved beyond threshold
      const deltaY = Math.abs(e.clientY - dragStartY.current)
      if (deltaY > DRAG_THRESHOLD) {
        setHasMoved(true)
      }

      const newPosition = calculateNewPosition(e.clientY)
      setDragPosition(newPosition)

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, newPosition.toString())
      } catch {
        // Ignore storage errors
      }
    },
    [isDragging, calculateNewPosition],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault() // Prevent page scroll

      // Check if moved beyond threshold
      const deltaY = Math.abs(e.touches[0].clientY - dragStartY.current)
      if (deltaY > DRAG_THRESHOLD) {
        setHasMoved(true)
      }

      const newPosition = calculateNewPosition(e.touches[0].clientY)
      setDragPosition(newPosition)

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, newPosition.toString())
      } catch {
        // Ignore storage errors
      }
    },
    [isDragging, calculateNewPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    // Reset hasMoved after a short delay to prevent immediate toggle
    setTimeout(() => setHasMoved(false), 100)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    // Reset hasMoved after a short delay to prevent immediate toggle
    setTimeout(() => setHasMoved(false), 100)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ])

  const currentPosition =
    dragPosition ??
    (typeof spacingValue === 'number' ? spacingValue : parseFloat(spacingValue))

  return (
    <button
      type="button"
      ref={(el) => {
        if (el) buttonRef.current = el
        refCallback?.(el, isTranslated)
      }}
      style={{
        position: 'fixed',
        right: 0,
        [verticalSpacing]: `${currentPosition}px`,
        background: 'white',
        padding: '8px 10px',
        zIndex,
        border: 'none',
        borderRadius: '40px 0 0 40px',
        color: 'rgba(0, 0, 0, 0.65)',
        boxShadow: '0 0 16px 0 #0000001F',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none', // Prevent default touch actions
      }}
      onClick={handleTranslationToggle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <title>Translation</title>
        <path
          d="M7.53267 9.91667H11.7175M7.53267 9.91667L6.41675 12.25M7.53267 9.91667L9.20409 6.42192C9.33878 6.14034 9.4061 5.99952 9.49827 5.95502C9.57836 5.91634 9.67181 5.91634 9.7519 5.95502C9.84407 5.99952 9.91138 6.14034 10.0461 6.42192L11.7175 9.91667M11.7175 9.91667L12.8334 12.25M1.16675 2.91667H4.66675M4.66675 2.91667H6.70842M4.66675 2.91667V1.75M6.70842 2.91667H8.16675M6.70842 2.91667C6.41902 4.64175 5.74743 6.20445 4.76332 7.5159M4.76332 7.5159C5.11163 7.78289 5.47611 8.00613 5.83342 8.16667M4.76332 7.5159C3.97434 6.91122 3.26836 6.08218 2.91675 5.25M4.76332 7.5159C3.82725 8.76336 2.60842 9.78355 1.16675 10.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isTranslated ? seeOriginalText : translateText}
    </button>
  )
}
