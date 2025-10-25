export type TranslationStatus = 0 | 1;

export type TranslatedField<T = string> = {
  original: T;
  translated?: T;
};

// Product Info API response (static - no translation needed)
export type ProductInfoData = {
  product_id: string;
  product_name: string;
  price: string;
  stock: number;
  sku: string;
};

// Shop Info API response (static - no translation needed)
export type ShopInfoData = {
  shop_name: string;
  shop_rating: number;
  total_products: number;
  response_rate: string;
  response_time: string;
};

// Product Reviews API response (dynamic - has translations)
export type ProductReviewsData = {
  translation_status: TranslationStatus;
  average_rating: number;
  total_reviews: number;
  reviews: Array<{
    id: string;
    username: string;
    rating: number;
    comment: string;
    comment_tr?: string;
    date: string;
  }>;
};

// Voucher Info API response (dynamic - has translations, 1 API → 2 Anchors pattern)
export type VoucherInfoData = {
  translation_status: TranslationStatus;
  available_vouchers: Array<{
    id: string;
    code: string;
    discount: string;
    title: string;
    title_tr?: string;
    min_spend: string;
  }>;
  voucher_terms: {
    terms: string;
    terms_tr?: string;
    expiry: string;
  };
};
