import axios from 'axios'
import type {
  RainforestSearchResponse,
  GPTGenerateRequest,
  GPTGenerateResponse
} from './amazon.type'

/**
 * Rainforest API 服务
 * 用于搜索 Amazon 商品
 * 
 * 使用说明：
 * 1. 需要在环境变量中配置 VITE_RAINFOREST_API_KEY
 * 2. API 文档：https://www.rainforestapi.com/docs
 */
class RainforestService {
  private apiKey: string
  private baseURL = 'https://api.rainforestapi.com/request'

  constructor() {
    // 从环境变量读取 API Key
    this.apiKey = import.meta.env.VITE_RAINFOREST_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('Rainforest API Key 未配置，请在 .env 文件中设置 VITE_RAINFOREST_API_KEY')
    }
  }

  /**
   * 搜索 Amazon 商品
   * @param keyword 搜索关键词
   * @param limit 返回商品数量限制，默认20
   * @returns 搜索结果
   */
  async searchProducts(keyword: string, limit: number = 20): Promise<RainforestSearchResponse> {
    if (!this.apiKey) {
      throw new Error('Rainforest API Key 未配置，请在环境变量中设置 VITE_RAINFOREST_API_KEY')
    }

    try {
      const response = await axios.get<RainforestSearchResponse>(this.baseURL, {
        params: {
          api_key: this.apiKey,
          type: 'search',
          amazon_domain: 'amazon.com',
          search_term: keyword,
          output: 'json',
          page: 1,
          sort_by: 'bestseller_rankings',
          include_products_count: 20,
          products_per_page: 20,
          // 注意：Rainforest API 的实际参数可能不同，需要根据实际API文档调整
        },
        timeout: 30000
      })

      // 限制返回数量
      if (response.data.search_results && response.data.search_results.length > limit) {
        response.data.search_results = response.data.search_results.slice(0, limit)
      }

      return response.data
    } catch (error: any) {
      console.error('Rainforest API 调用失败:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        '调用 Rainforest API 失败，请检查网络连接和 API Key 配置'
      )
    }
  }
}

/**
 * GPT API 服务
 * 用于生成 Amazon Listing 内容
 * 
 * 使用说明：
 * 1. 需要在环境变量中配置 VITE_OPENAI_API_KEY
 * 2. 或者配置 VITE_GPT_API_URL 和 VITE_GPT_API_KEY（如果使用其他GPT服务）
 */
class GPTService {
  private apiKey: string
  private apiURL: string

  constructor() {
    // 优先使用自定义 GPT API URL，否则使用 OpenAI
    this.apiURL = import.meta.env.VITE_GPT_API_URL || 'https://api.openai.com/v1/chat/completions'
    this.apiKey = import.meta.env.VITE_GPT_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('GPT API Key 未配置，请在 .env 文件中设置 VITE_GPT_API_KEY 或 VITE_OPENAI_API_KEY')
    }
  }

  /**
   * 生成 Amazon Listing 内容
   * @param request 生成请求参数
   * @returns 生成的 Listing 内容
   */
  async generateListing(request: GPTGenerateRequest): Promise<GPTGenerateResponse> {
    if (!this.apiKey) {
      throw new Error('GPT API Key 未配置，请在环境变量中设置 VITE_GPT_API_KEY 或 VITE_OPENAI_API_KEY')
    }

    try {
      // 构建提示词
      const prompt = this.buildPrompt(request)

      // 调用 GPT API
      const response = await axios.post(
        this.apiURL,
        {
          model: import.meta.env.VITE_GPT_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: '你是一名专业的Amazon产品Listing撰写专家，擅长根据竞争对手的产品信息生成高质量的Listing内容。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      )

      // 解析响应
      const content = response.data.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('GPT API 返回内容为空')
      }

      // 解析 JSON 格式的响应
      const listing = this.parseListingResponse(content)
      
      return { listing }
    } catch (error: any) {
      console.error('GPT API 调用失败:', error)
      throw new Error(
        error.response?.data?.error?.message || 
        error.message || 
        '调用 GPT API 失败，请检查网络连接和 API Key 配置'
      )
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(request: GPTGenerateRequest): string {
    const productsInfo = request.products
      .map((p, index) => {
        return `商品 ${index + 1}:
          - 标题: ${p.title}
          - ASIN: ${p.asin}
          - 评分: ${p.rating || 'N/A'}
          - 评论数: ${p.ratings_total || 0}`
        })
        .join('\n\n')

      return `请根据以下信息生成一个 Amazon 产品 Listing：

            关键词：${request.keyword}

            参考商品信息（前3个高评论数商品）：
            ${productsInfo}

            请生成一份完整的 Listing，要求：
            1. 标题：简洁有力，包含关键词，不超过200字符
            2. 五点描述：5个要点，每个要点不超过300字符，突出产品卖点和优势
            3. 产品描述：详细的产品描述，包含关键词，不超过1000字符
            4. 使用英文回复

            请以 JSON 格式返回，格式如下：
            {
              "title": "产品标题",
              "bulletPoints": ["要点1", "要点2", "要点3", "要点4", "要点5"],
              "description": "产品描述内容"
            }
            只返回 JSON，不要包含其他文字说明。`
  }

  /**
   * 解析 GPT 响应内容
   */
  private parseListingResponse(content: string): {
    title: string
    bulletPoints: string[]
    description: string
  } {
    try {
      // 尝试提取 JSON（可能包含 markdown 代码块）
      let jsonStr = content.trim()
      
      // 如果包含代码块，提取 JSON 部分
      const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      } else {
        // 尝试提取第一个 JSON 对象
        const braceMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (braceMatch) {
          jsonStr = braceMatch[0]
        }
      }

      const parsed = JSON.parse(jsonStr)
      
      // 验证必需字段
      if (!parsed.title || !parsed.bulletPoints || !parsed.description) {
        throw new Error('GPT 返回的 JSON 格式不完整')
      }

      // 确保 bulletPoints 是数组且最多5个
      if (!Array.isArray(parsed.bulletPoints)) {
        parsed.bulletPoints = [parsed.bulletPoints]
      }
      parsed.bulletPoints = parsed.bulletPoints.slice(0, 5)

      return {
        title: parsed.title,
        bulletPoints: parsed.bulletPoints,
        description: parsed.description
      }
    } catch (error) {
      console.error('解析 GPT 响应失败:', error)
      throw new Error('GPT 返回的内容格式不正确，无法解析为 JSON')
    }
  }
}

// 导出服务实例
export const rainforestService = new RainforestService()
export const gptService = new GPTService()

// 导出便捷方法
/**
 * 搜索 Amazon 商品
 */
export const searchAmazonProducts = (keyword: string, limit: number = 20) => {
  return rainforestService.searchProducts(keyword, limit)
}

/**
 * 生成 Amazon Listing
 */
export const generateAmazonListing = (request: GPTGenerateRequest) => {
  return gptService.generateListing(request)
}

