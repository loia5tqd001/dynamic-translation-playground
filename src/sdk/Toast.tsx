import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ClientOnlyPortal } from './ClientOnlyPortal'
import type { ToastConfig } from './types'

const DISPLAY_DURATION_MS = 5000

type ToastContextType = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const Toast = ({
  message,
  isVisible,
  bottomSpacing = '72px',
}: {
  message: string | null
  isVisible: boolean
  bottomSpacing: React.CSSProperties['bottom']
}) => {
  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    bottom: bottomSpacing,
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.65)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 13000,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 250ms ease-in-out',
    pointerEvents: isVisible ? 'auto' : 'none',
  }

  const textStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  return (
    <div style={toastStyle}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.3334 8.00002C15.3334 12.0501 12.0502 15.3334 8.00008 15.3334C3.94999 15.3334 0.666748 12.0501 0.666748 8.00002C0.666748 3.94993 3.94999 0.666687 8.00008 0.666687C12.0502 0.666687 15.3334 3.94993 15.3334 8.00002ZM7.58934 10.7845L12.3536 6.02024L11.6465 5.31313L7.00008 9.95958L4.35363 7.31313L3.64653 8.02024L6.41083 10.7845C6.73626 11.11 7.2639 11.11 7.58934 10.7845Z"
          fill="white"
        />
      </svg>
      <span style={textStyle}>{message}</span>
    </div>
  )
}

export const ToastProvider = ({
  children,
  config = {},
}: {
  children: ReactNode
  config: ToastConfig
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    // Clear any existing timer to handle rapid triggers
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }

    setToastMessage(message)
    setIsVisible(true)

    // Set a timer to hide the toast
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false)
    }, DISPLAY_DURATION_MS)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  return (
    <ToastContext.Provider value={useMemo(() => ({ showToast }), [showToast])}>
      {children}
      <ClientOnlyPortal selector={document.body}>
        <Toast
          message={toastMessage}
          isVisible={isVisible}
          bottomSpacing={config.bottomSpacing}
        />
      </ClientOnlyPortal>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
