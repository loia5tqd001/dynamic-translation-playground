import React from 'react';
import type { TranslationButtonConfig, TransifyConfig } from './types';
import { useToast } from './Toast';

type TranslationButtonProps = TranslationButtonConfig &
  TransifyConfig & {
    isTranslated: boolean;
    onToggle: () => void;
  };

export const TranslationButton = ({
  verticalSpacing = 'bottom',
  spacingValue = '100px',
  translateText = 'Translate',
  seeOriginalText = 'See Original',
  updateToastText = 'Language updated',
  zIndex = 12000,
  onTranslationStateChange,
  refCallback,
  isTranslated,
  onToggle,
}: TranslationButtonProps) => {
  const { showToast } = useToast();

  const handleTranslationToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
    onTranslationStateChange?.(!isTranslated);
    showToast(updateToastText);
  };

  return (
    <button
      ref={(el) => refCallback?.(el, isTranslated)}
      style={{
        position: 'fixed',
        right: 0,
        [verticalSpacing]: spacingValue,
        background: 'white',
        padding: '6px 8px',
        zIndex,
        border: 'none',
        borderRadius: '40px 0 0 40px',
        color: 'rgba(0, 0, 0, 0.65)',
        boxShadow: '0 0 9px 0 #0000001F',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '14px',
        cursor: 'pointer',
      }}
      onClick={handleTranslationToggle}
    >
      <svg
        width='14'
        height='14'
        viewBox='0 0 14 14'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M7.53267 9.91667H11.7175M7.53267 9.91667L6.41675 12.25M7.53267 9.91667L9.20409 6.42192C9.33878 6.14034 9.4061 5.99952 9.49827 5.95502C9.57836 5.91634 9.67181 5.91634 9.7519 5.95502C9.84407 5.99952 9.91138 6.14034 10.0461 6.42192L11.7175 9.91667M11.7175 9.91667L12.8334 12.25M1.16675 2.91667H4.66675M4.66675 2.91667H6.70842M4.66675 2.91667V1.75M6.70842 2.91667H8.16675M6.70842 2.91667C6.41902 4.64175 5.74743 6.20445 4.76332 7.5159M4.76332 7.5159C5.11163 7.78289 5.47611 8.00613 5.83342 8.16667M4.76332 7.5159C3.97434 6.91122 3.26836 6.08218 2.91675 5.25M4.76332 7.5159C3.82725 8.76336 2.60842 9.78355 1.16675 10.5'
          stroke='currentColor'
          strokeWidth='1'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      {isTranslated ? seeOriginalText : translateText}
    </button>
  );
};
