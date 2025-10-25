import React, { useEffect, useState } from 'react';
import { TranslationAnchor, TextTr } from '../sdk';
import { fetchProductQA } from '../mockApi';
import type { ProductQAData } from '../mockApi/types';

/**
 * Product Q&A Drawer (Customer Service Team)
 * Pattern: Dynamic content in drawer/popup
 * Demonstrates that translation button only shows when drawer is open
 * and contains visible dynamic content with translation_status = 1
 */
export const ProductQADrawer = ({
  isOpen,
  onClose,
  shouldSucceed,
}: {
  isOpen: boolean;
  onClose: () => void;
  shouldSucceed: boolean;
}) => {
  const [data, setData] = useState<ProductQAData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchProductQA(shouldSucceed).then((response) => {
        setData(response);
        setLoading(false);
      });
    }
  }, [isOpen, shouldSucceed]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
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
        }}
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
              ❓ Product Q&A
            </h2>
            <button
              onClick={onClose}
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

          {loading && (
            <div className="loading" style={{ padding: '20px' }}>
              Loading Q&A...
            </div>
          )}

          {!loading && data && (
            <>
              <div className="status-badge" style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {data.translation_status === 1 ? (
                  <span className="status-success" style={{
                    fontSize: '13px',
                    padding: '6px 12px'
                  }}>✓ Translation Available</span>
                ) : (
                  <span className="status-failed" style={{
                    fontSize: '13px',
                    padding: '6px 12px'
                  }}>✗ Translation Failed</span>
                )}
              </div>

              {/* Q&A Content with TranslationAnchor */}
              <TranslationAnchor translation_status={data.translation_status}>
                <div className="content-card">
                  {data.questions.map((qa, index) => (
                    <div
                      key={qa.id}
                      style={{
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: index < data.questions.length - 1 ? '1px solid #e5e7eb' : 'none',
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{
                          color: '#1f2937',
                          fontSize: '15px',
                          display: 'block',
                          lineHeight: '1.6'
                        }}>
                          Q:{' '}
                          <TextTr
                            original={qa.question}
                            translated={qa.question_tr}
                          />
                        </strong>
                      </div>
                      <div style={{
                        color: '#4b5563',
                        paddingLeft: '12px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}>
                        <strong>A:</strong>{' '}
                        <TextTr original={qa.answer} translated={qa.answer_tr} />
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginTop: '8px',
                          paddingLeft: '12px',
                        }}
                      >
                        {qa.date}
                      </div>
                    </div>
                  ))}
                </div>
              </TranslationAnchor>

              <div
                className="team-note"
                style={{
                  marginTop: '20px',
                  background: '#fef3c7',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  💡 <strong>Drawer/Popup Pattern:</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#78350f' }}>
                  • Translation button only shows when drawer is open
                  <br />
                  • Button appears when content has translation_status = 1
                  <br />
                  • Button z-index (10000) is above drawer (9500)
                  <br />
                  • Button is draggable to avoid covering content
                </div>
              </div>
            </>
          )}
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

          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .drawer {
              left: 0 !important;
              right: 0 !important;
              width: 100vw !important;
              max-width: 100vw !important;
            }

            /* Improve touch targets on mobile */
            .drawer button {
              min-height: 44px !important;
              min-width: 44px !important;
            }

            /* Better content spacing on mobile */
            .content-card {
              padding: 12px !important;
            }

            /* Better readability on mobile */
            .drawer strong {
              font-size: 15px !important;
              line-height: 1.6 !important;
            }

            /* Reduce padding on very small screens */
            .drawer > div {
              padding: 12px !important;
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
  );
};
