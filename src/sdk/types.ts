import { ReactNode } from 'react';

export type TranslationStatus = 0 | 1;

export type TranslationButtonConfig = {
  verticalSpacing?: 'top' | 'bottom';
  spacingValue?: React.CSSProperties['top'] | React.CSSProperties['bottom'];
  zIndex?: React.CSSProperties['zIndex'];
  onTranslationStateChange?: (isTranslated: boolean) => void;
  refCallback?: (el: Element | null, isTranslated: boolean) => void;
};

export type TransifyConfig = {
  translateText?: string;
  seeOriginalText?: string;
  updateToastText?: string;
};

export type ToastConfig = {
  bottomSpacing?: React.CSSProperties['bottom'];
};

export type GlobalTranslationProviderProps = {
  children: ReactNode;
  /**
   * The config for the "See Original"/"Translate" button
   */
  buttonConfig?: TranslationButtonConfig;
  /**
   * Please provide the translation texts for the button and toast
   */
  transifyConfig?: TransifyConfig;
  /**
   * The config for the toast
   */
  toastConfig?: ToastConfig;
};

export type TranslationAnchorProps = {
  children: ReactNode;
  /**
   * The translation status from your API response
   * 1 = translation successful, 0 = translation failed/not available
   */
  translation_status?: TranslationStatus;
};
