import type {
  ProductInfoData,
  ProductQAData,
  ProductReviewsData,
  ShippingInfoData,
  ShopInfoData,
  VoucherInfoData,
} from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock API for Product Info (static - no translation)
 */
export const fetchProductInfo = async (): Promise<ProductInfoData> => {
  await delay(500)

  return {
    product_id: 'PROD-2024-001',
    product_name: 'Wireless Bluetooth Headphones - Premium Sound Quality',
    price: '$79.99',
    stock: 156,
    sku: 'WBH-BLK-2024',
  }
}

/**
 * Mock API for Shop Info (static - no translation)
 */
export const fetchShopInfo = async (): Promise<ShopInfoData> => {
  await delay(400)

  return {
    shop_name: 'TechGear Official Store',
    shop_rating: 4.8,
    total_products: 1247,
    response_rate: '98%',
    response_time: 'within 2 hours',
  }
}

/**
 * Mock API for Product Reviews (dynamic - has translations)
 */
export const fetchProductReviews = async (
  shouldSucceed: boolean = true,
): Promise<ProductReviewsData> => {
  await delay(800)

  if (shouldSucceed) {
    return {
      translation_status: 1,
      average_rating: 4.5,
      total_reviews: 128,
      reviews: [
        {
          id: '1',
          username: 'Alex Chen',
          rating: 5,
          comment:
            'Amazing sound quality! Battery lasts all day. Highly recommend for music lovers.',
          comment_tr:
            'Chất lượng âm thanh tuyệt vời! Pin dùng cả ngày. Rất khuyến khích cho người yêu âm nhạc.',
          date: '2024-10-20',
        },
        {
          id: '2',
          username: 'Maria Santos',
          rating: 4,
          comment:
            'Good headphones for the price. Comfortable to wear for long periods.',
          comment_tr:
            'Tai nghe tốt với mức giá này. Thoải mái khi đeo trong thời gian dài.',
          date: '2024-10-18',
        },
        {
          id: '3',
          username: 'John Smith',
          rating: 5,
          comment:
            'Best purchase this year! Connection is stable and sound is crystal clear.',
          comment_tr:
            'Mua hàng tốt nhất năm nay! Kết nối ổn định và âm thanh trong trẻo.',
          date: '2024-10-15',
        },
      ],
    }
  }

  // Translation failed
  return {
    translation_status: 0,
    average_rating: 4.5,
    total_reviews: 128,
    reviews: [
      {
        id: '1',
        username: 'Alex Chen',
        rating: 5,
        comment:
          'Amazing sound quality! Battery lasts all day. Highly recommend for music lovers.',
        date: '2024-10-20',
      },
      {
        id: '2',
        username: 'Maria Santos',
        rating: 4,
        comment:
          'Good headphones for the price. Comfortable to wear for long periods.',
        date: '2024-10-18',
      },
      {
        id: '3',
        username: 'John Smith',
        rating: 5,
        comment:
          'Best purchase this year! Connection is stable and sound is crystal clear.',
        date: '2024-10-15',
      },
    ],
  }
}

/**
 * Mock API for Voucher Info (dynamic - has translations, demonstrates 1 API → 2 Anchors)
 */
export const fetchVoucherInfo = async (
  shouldSucceed: boolean = true,
): Promise<VoucherInfoData> => {
  await delay(600)

  if (shouldSucceed) {
    return {
      translation_status: 1,
      available_vouchers: [
        {
          id: 'V1',
          code: 'TECH20',
          discount: '20% OFF',
          title: 'Tech Gadgets Sale - Save 20% on all electronics',
          title_tr:
            'Giảm giá Thiết bị Công nghệ - Tiết kiệm 20% cho tất cả đồ điện tử',
          min_spend: '$50',
        },
        {
          id: 'V2',
          code: 'FREESHIP',
          discount: 'Free Shipping',
          title: 'Free shipping on orders over $30',
          title_tr: 'Miễn phí vận chuyển cho đơn hàng trên $30',
          min_spend: '$30',
        },
      ],
      voucher_terms: {
        terms:
          'Valid until end of month. Cannot be combined with other offers. One use per customer.',
        terms_tr:
          'Có hiệu lực đến cuối tháng. Không thể kết hợp với các ưu đãi khác. Một lần sử dụng mỗi khách hàng.',
        expiry: '2024-10-31',
      },
    }
  }

  // Translation failed
  return {
    translation_status: 0,
    available_vouchers: [
      {
        id: 'V1',
        code: 'TECH20',
        discount: '20% OFF',
        title: 'Tech Gadgets Sale - Save 20% on all electronics',
        min_spend: '$50',
      },
      {
        id: 'V2',
        code: 'FREESHIP',
        discount: 'Free Shipping',
        title: 'Free shipping on orders over $30',
        min_spend: '$30',
      },
    ],
    voucher_terms: {
      terms:
        'Valid until end of month. Cannot be combined with other offers. One use per customer.',
      expiry: '2024-10-31',
    },
  }
}

/**
 * Mock API for Shipping Info (static - no translation)
 */
export const fetchShippingInfo = async (): Promise<ShippingInfoData> => {
  await delay(450)

  return {
    shipping_methods: [
      {
        id: 'standard',
        name: 'Standard Shipping',
        delivery_time: '5-7 business days',
        cost: '$4.99',
      },
      {
        id: 'express',
        name: 'Express Shipping',
        delivery_time: '2-3 business days',
        cost: '$12.99',
      },
      {
        id: 'overnight',
        name: 'Overnight Delivery',
        delivery_time: '1 business day',
        cost: '$24.99',
      },
    ],
    return_policy: '30-day money-back guarantee',
    tracking_available: true,
  }
}

/**
 * Mock API for Product Q&A (dynamic - has translations, for drawer/popup demo)
 */
export const fetchProductQA = async (
  shouldSucceed: boolean = true,
): Promise<ProductQAData> => {
  await delay(700)

  if (shouldSucceed) {
    return {
      translation_status: 1,
      questions: [
        {
          id: 'Q1',
          question: 'Does this work with iPhone 15?',
          question_tr: 'Cái này có hoạt động với iPhone 15 không?',
          answer:
            'Yes, it is fully compatible with iPhone 15 and all newer models.',
          answer_tr:
            'Có, nó hoàn toàn tương thích với iPhone 15 và tất cả các mẫu mới hơn.',
          date: '2024-10-22',
        },
        {
          id: 'Q2',
          question: 'What is the battery life?',
          question_tr: 'Thời lượng pin là bao lâu?',
          answer: 'Up to 40 hours of continuous playback on a single charge.',
          answer_tr: 'Lên đến 40 giờ phát liên tục trong một lần sạc.',
          date: '2024-10-20',
        },
        {
          id: 'Q3',
          question: 'Is it water resistant?',
          question_tr: 'Có chống nước không?',
          answer:
            'Yes, it has IPX4 water resistance rating for sweat and light rain.',
          answer_tr: 'Có, nó có chuẩn chống nước IPX4 chống mồ hôi và mưa nhẹ.',
          date: '2024-10-18',
        },
      ],
    }
  }

  // Translation failed
  return {
    translation_status: 0,
    questions: [
      {
        id: 'Q1',
        question: 'Does this work with iPhone 15?',
        answer:
          'Yes, it is fully compatible with iPhone 15 and all newer models.',
        date: '2024-10-22',
      },
      {
        id: 'Q2',
        question: 'What is the battery life?',
        answer: 'Up to 40 hours of continuous playback on a single charge.',
        date: '2024-10-20',
      },
      {
        id: 'Q3',
        question: 'Is it water resistant?',
        answer:
          'Yes, it has IPX4 water resistance rating for sweat and light rain.',
        date: '2024-10-18',
      },
    ],
  }
}
