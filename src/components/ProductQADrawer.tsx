import { useEffect, useState } from 'react'
import { fetchProductQA } from '../mockApi'
import type { ProductQAData } from '../mockApi/types'
import { TextTr, TranslationAnchor } from '../sdk'
import { Drawer } from './Drawer'

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
  isOpen: boolean
  onClose: () => void
  shouldSucceed: boolean
}) => {
  const [data, setData] = useState<ProductQAData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetchProductQA(shouldSucceed).then((response) => {
        setData(response)
        setLoading(false)
      })
    }
  }, [isOpen, shouldSucceed])

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="❓ Product Q&A">
      {loading && (
        <div className="loading" style={{ padding: '20px' }}>
          Loading Q&A...
        </div>
      )}

      {!loading && data && (
        <>
          <div
            className="status-badge"
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {data.translation_status === 1 ? (
              <span
                className="status-success"
                style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                }}
              >
                ✓ Translation Available
              </span>
            ) : (
              <span
                className="status-failed"
                style={{
                  fontSize: '13px',
                  padding: '6px 12px',
                }}
              >
                ✗ Translation Failed
              </span>
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
                    borderBottom:
                      index < data.questions.length - 1
                        ? '1px solid #e5e7eb'
                        : 'none',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <strong
                      style={{
                        color: '#1f2937',
                        fontSize: '15px',
                        display: 'block',
                        lineHeight: '1.6',
                      }}
                    >
                      Q:{' '}
                      <TextTr
                        original={qa.question}
                        translation={qa.question_tr}
                      />
                    </strong>
                  </div>
                  <div
                    style={{
                      color: '#4b5563',
                      paddingLeft: '12px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    <strong>A:</strong>{' '}
                    <TextTr original={qa.answer} translation={qa.answer_tr} />
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
              lineHeight: '1.6',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              💡 <strong>Drawer/Popup Pattern:</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f' }}>
              • Translation button only shows when drawer is open
              <br />• Button appears when content has translation_status = 1
              <br />• Button z-index (10000) is above drawer (9500)
              <br />• Button is draggable to avoid covering content
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}
