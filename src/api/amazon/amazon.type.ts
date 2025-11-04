/**
 * Amazon 商品相关的类型定义
 */

// Rainforest API 搜索响应中的商品信息
export interface RainforestProduct {
  asin: string // Amazon商品ASIN
  title: string // 商品标题
  link: string // 商品链接
  image: string // 商品图片
  rating?: number // 评分
  ratings_total?: number // 总评论数
  price?: {
    value?: number
    currency?: string
  }
  is_prime?: boolean // 是否Prime
  fulfillment?: {
    type?: string // FBA, FBM等
  }
  bestseller_badge?: boolean // 是否畅销
  variant?: string // 变体信息
  [key: string]: any // 其他可能的字段
}

// Rainforest API 搜索响应
export interface RainforestSearchResponse {
  search_results?: RainforestProduct[] // 搜索结果列表
  search_metadata?: {
    amazon_url?: string
    created_at?: string
    status?: string
  }
  request_info?: {
    credits_used?: number
  }
  [key: string]: any
}

// GPT 生成的 Listing 内容
export interface GeneratedListing {
  title: string // 标题
  bulletPoints: string[] // 五点描述（数组，最多5个）
  description: string // 产品描述
}

// GPT API 请求参数
export interface GPTGenerateRequest {
  products: Array<{
    title: string
    asin: string
    rating?: number
    ratings_total?: number
    [key: string]: any
  }> // 前3个商品的详细信息
  keyword: string // 用户输入的关键词
}

// GPT API 响应
export interface GPTGenerateResponse {
  listing: GeneratedListing
  [key: string]: any
}

