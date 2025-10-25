import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ClientOnlyPortal } from './ClientOnlyPortal'
import { ToastProvider } from './Toast'
import { TranslationButton } from './TranslationButton'
import type { GlobalTranslationProviderProps } from './types'

const STORAGE_KEY = 'dynamic_translation_is_translated'

// Context for isTranslated state (global, persisted to sessionStorage)
const IsTranslatedContext = createContext<boolean | undefined>(undefined)
const SetIsTranslatedContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {})

// Context for button visibility counter (internal to SDK)
const IncrementVisibilityCounterContext = createContext<() => void>(() => {})
const DecrementVisibilityCounterContext = createContext<() => void>(() => {})

export const GlobalTranslationProvider = ({
  children,
  buttonConfig = {},
  transifyConfig = {},
  toastConfig = {},
  forceTranslated = false,
}: GlobalTranslationProviderProps) => {
  const { hideButton = false } = buttonConfig

  // isTranslated: global state, initialized to true, persisted to sessionStorage
  // When forceTranslated is true, always initialize to true
  const [isTranslated, setIsTranslated] = useState<boolean>(() => {
    if (forceTranslated) return true
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored !== null ? JSON.parse(stored) : true
    } catch {
      return true
    }
  })

  // Visibility counter: starts at 0, button shows when counter > 0
  // Button can be hidden via hideButton prop
  const [visibilityCounter, setVisibilityCounter] = useState<number>(0)
  const isButtonVisible = !hideButton && visibilityCounter > 0

  // Persist isTranslated to sessionStorage (not applicable when forceTranslated is true)
  useEffect(() => {
    if (forceTranslated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(isTranslated))
    } catch {
      // Ignore storage errors
    }
  }, [isTranslated, forceTranslated])

  const incrementVisibilityCounter = useCallback(() => {
    setVisibilityCounter((prev) => prev + 1)
  }, [])

  const decrementVisibilityCounter = useCallback(() => {
    setVisibilityCounter((prev) => Math.max(0, prev - 1))
  }, [])

  const toggleTranslation = useCallback(() => {
    // Don't allow toggling when forceTranslated is true
    if (forceTranslated) return
    setIsTranslated((prev) => !prev)
  }, [forceTranslated])

  // Force isTranslated to true when forceTranslated prop is enabled
  useEffect(() => {
    if (forceTranslated && !isTranslated) {
      setIsTranslated(true)
    }
  }, [forceTranslated, isTranslated])

  return (
    <ToastProvider config={toastConfig}>
      <IsTranslatedContext.Provider value={isTranslated}>
        <SetIsTranslatedContext.Provider value={setIsTranslated}>
          <IncrementVisibilityCounterContext.Provider
            value={incrementVisibilityCounter}
          >
            <DecrementVisibilityCounterContext.Provider
              value={decrementVisibilityCounter}
            >
              {children}
              {isButtonVisible && (
                <ClientOnlyPortal selector={document.body}>
                  <TranslationButton
                    {...buttonConfig}
                    {...transifyConfig}
                    isTranslated={isTranslated}
                    onToggle={toggleTranslation}
                  />
                </ClientOnlyPortal>
              )}
            </DecrementVisibilityCounterContext.Provider>
          </IncrementVisibilityCounterContext.Provider>
        </SetIsTranslatedContext.Provider>
      </IsTranslatedContext.Provider>
    </ToastProvider>
  )
}

// Hook to get isTranslated state
export const useIsTranslated = () => {
  const context = useContext(IsTranslatedContext)
  if (context === undefined) {
    throw new Error(
      'useIsTranslated must be used within GlobalTranslationProvider',
    )
  }
  return context
}

// Hook to set isTranslated state (for advanced use cases)
export const useSetIsTranslated = () => {
  const context = useContext(SetIsTranslatedContext)
  if (context === undefined) {
    throw new Error(
      'useSetIsTranslated must be used within GlobalTranslationProvider',
    )
  }
  return context
}

// Internal hooks for anchor components
export const useIncrementVisibilityCounter = () => {
  const context = useContext(IncrementVisibilityCounterContext)
  if (context === undefined) {
    throw new Error(
      'useIncrementVisibilityCounter must be used within GlobalTranslationProvider',
    )
  }
  return context
}

export const useDecrementVisibilityCounter = () => {
  const context = useContext(DecrementVisibilityCounterContext)
  if (context === undefined) {
    throw new Error(
      'useDecrementVisibilityCounter must be used within GlobalTranslationProvider',
    )
  }
  return context
}

// Hook to get translated text
export const useTextTr = () => {
  const isTranslated = useIsTranslated()
  return useCallback(
    <T extends string | ReactNode>(original: T, translation?: T) =>
      isTranslated ? translation || original : original,
    [isTranslated],
  )
}

// Component alternative to useTextTr hook
export const TextTr = <T extends string | ReactNode>({
  original,
  translation,
}: {
  original: T
  translation?: T
}): T => {
  const getText = useTextTr()
  return getText(original, translation)
}
