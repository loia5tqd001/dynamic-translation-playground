import { type ReactNode, useEffect } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Reusable Drawer Component
 * Features:
 * - Slide-in animation from right
 * - Backdrop with fade-in
 * - Prevents body scroll when open
 * - Responsive on mobile
 * - Accessible close button
 */
export const Drawer = ({ isOpen, onClose, title, children }: DrawerProps) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="drawer-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9000,
          animation: 'fadeIn 0.3s ease',
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Close drawer"
      />

      {/* Drawer */}
      <div
        className="drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '500px',
          maxWidth: '100vw',
          background: 'white',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: 9500,
          overflowY: 'auto',
          overflowX: 'hidden',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        <div style={{ padding: '16px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '12px',
              gap: '8px',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 20px)' }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '4px 8px',
                color: '#6b7280',
                minWidth: '40px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }

          /* Reset any global styles that might interfere with drawer layout */
          .drawer {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          /* Ensure drawer children don't inherit unwanted margins from global CSS */
          .drawer > div {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .drawer {
              left: 0 !important;
              right: 0 !important;
              width: 100vw !important;
              max-width: 100vw !important;
              overflow-x: hidden !important;
            }

            /* Ensure drawer content doesn't create horizontal scroll */
            .drawer > div {
              padding: 12px !important;
              max-width: 100%;
              overflow-x: hidden;
              box-sizing: border-box;
            }

            /* Improve touch targets on mobile */
            .drawer button {
              min-height: 44px !important;
              min-width: 44px !important;
            }

            /* Better content spacing on mobile */
            .content-card {
              padding: 12px !important;
              max-width: 100%;
              overflow-x: hidden;
              box-sizing: border-box;
            }

            /* Better readability on mobile */
            .drawer strong {
              font-size: 15px !important;
              line-height: 1.6 !important;
              word-wrap: break-word;
            }

            /* Ensure all text content wraps properly */
            .drawer * {
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
          }

          /* Extra small mobile devices */
          @media (max-width: 375px) {
            .drawer > div {
              padding: 10px !important;
            }

            .content-card {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </>
  )
}
