import { useState } from 'react'
import { 
  Card, 
  Input, 
  Button, 
  Space, 
  message, 
  Spin,
  Typography,
  Divider,
  List,
  Alert
} from 'antd'
import { 
  SearchOutlined, 
  CopyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { searchAmazonProducts, generateAmazonListing } from '@/api/amazon'
import type { RainforestProduct, GeneratedListing } from '@/api/amazon/amazon.type'

const { Title, Paragraph, Text } = Typography

/**
 * Amazon Listing 生成器页面
 * 
 * 功能说明：
 * 1. 用户输入关键词搜索 Amazon 商品
 * 2. 调用 Rainforest API 获取前20个商品数据
 * 3. 根据评论数筛选出前3个FBA商品
 * 4. 调用 GPT 模型生成模仿 Listing
 * 5. 展示生成的标题、五点描述和产品描述
 */
function Amazon() {
  const [keyword, setKeyword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [listing, setListing] = useState<GeneratedListing | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<RainforestProduct[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)

  /**
   * 处理搜索和生成
   */
  const handleGenerate = async () => {
    if (!keyword.trim()) {
      message.warning('请输入搜索关键词')
      return
    }

    setLoading(true)
    setListing(null)
    setSelectedProducts([])
    setCopiedField(null)

    try {
      // 步骤1: 调用 Rainforest API 获取前20个商品
      message.info('正在搜索商品...')
      const searchResult = await searchAmazonProducts(keyword.trim(), 20)
      
      if (!searchResult.search_results || searchResult.search_results.length === 0) {
        message.warning('未找到相关商品，请尝试其他关键词')
        setLoading(false)
        return
      }

      const products = searchResult.search_results
      message.success(`找到 ${products.length} 个商品，正在筛选...`)

      // 步骤2: 筛选FBM商品并按销量排序，取前3个
      const fbmProducts = products
        .filter(p => {
          console.log(p.product);
          
          const isFBM = p.product.buybox_winner.fulfillment.is_fulfilled_by_third_party;

          return isFBM
        }).slice(0, 3) // 取前3个销量最好的

      if (fbmProducts.length === 0) {
        message.warning('未找到符合条件的FBM商品（需要有评论数），请尝试其他关键词')
        setLoading(false)
        return
      }

      setSelectedProducts(fbmProducts)
      message.success(`已筛选出 ${fbmProducts.length} 个销量最好的FBM商品，正在生成Listing...`)

      // 步骤3: 调用 GPT 生成 Listing
      const listingResult = await generateAmazonListing({
        keyword: keyword.trim(),
        products: fbmProducts.map(p => ({
          title: p.title,
          asin: p.asin,
          rating: p.rating,
          ratings_total: p.ratings_total,
          link: p.link,
          image: p.image
        }))
      })

      setListing(listingResult.listing)
      message.success('Listing 生成成功！')
    } catch (error: any) {
      console.error('生成Listing失败:', error)
      message.error(error.message || '生成Listing失败，请检查网络连接和API配置')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 复制内容到剪贴板
   */
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      message.success('已复制到剪贴板')
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      message.error('复制失败，请手动复制')
    }
  }

  return (
    <div className="p-6 bg-gray-50 overflow-auto h-full">
      <div className="max-w-6xl mx-auto w-full">
        <Title level={2} className="mb-6">Amazon Listing 生成器</Title>
        
        {/* 使用说明 */}
        <Alert
          message="使用说明"
          description={
            <div>
              <p>1. 输入商品关键词进行搜索</p>
              <p>2. 系统会自动获取前20个商品，筛选出销量最好的前3个FBM商品</p>
              <p>3. 基于这些商品信息，使用GPT生成模仿Listing内容</p>
              <p className="mt-2 text-orange-600">
                <strong>注意：</strong>需要配置 Rainforest API Key 和 GPT API Key（详见 README.md）
              </p>
            </div>
          }
          type="info"
          showIcon
          className="mb-6"
        />

        {/* 搜索区域 */}
        <Card className="mb-6">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              size="large"
              placeholder="请输入商品关键词（例如：wireless mouse）"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleGenerate}
              disabled={loading}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleGenerate}
              loading={loading}
            >
              生成 Listing
            </Button>
          </Space.Compact>
        </Card>

        {/* 加载状态 */}
        {loading && (
          <Card className="mb-6 text-center">
            <Spin size="large" tip="正在生成Listing，请稍候..." />
          </Card>
        )}

        {/* 选中的商品信息 */}
        {selectedProducts.length > 0 && (
          <Card title="参考商品（前3个销量最好的FBM商品）" className="mb-6">
            <List
              dataSource={selectedProducts}
              className="overflow-visible"
              renderItem={(product, index) => (
                <List.Item className="!overflow-visible !px-0">
                  <div className="flex items-start gap-4 w-full min-w-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-20 h-20 object-contain border rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <Text 
                        strong 
                        className="block break-words"
                        style={{ 
                          wordBreak: 'break-word', 
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal'
                        }}
                      >
                        {index + 1}. {product.title}
                      </Text>
                      <div className="mt-2 space-y-1">
                        <Text 
                          type="secondary" 
                          className="block break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                        >
                          ASIN: {product.asin}
                        </Text>
                        <Text 
                          type="secondary" 
                          className="block break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                        >
                          评分: {product.rating || 'N/A'} | 评论数: {product.ratings_total?.toLocaleString() || 0}
                        </Text>
                        <a 
                          href={product.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 inline-block break-all"
                        >
                          查看商品 →
                        </a>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* 生成的 Listing 内容 */}
        {listing && (
          <Card title="生成的 Listing 内容" className="mb-6">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 标题 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Title level={4} className="mb-0">标题</Title>
                  <Button
                    type="text"
                    size="small"
                    icon={copiedField === 'title' ? <CheckCircleOutlined /> : <CopyOutlined />}
                    onClick={() => handleCopy(listing.title, 'title')}
                  >
                    {copiedField === 'title' ? '已复制' : '复制'}
                  </Button>
                </div>
                <Paragraph 
                  copyable={false}
                  className="bg-gray-50 p-4 rounded border"
                >
                  {listing.title}
                </Paragraph>
              </div>

              <Divider />

              {/* 五点描述 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Title level={4} className="mb-0">五点描述</Title>
                  <Button
                    type="text"
                    size="small"
                    icon={copiedField === 'bulletPoints' ? <CheckCircleOutlined /> : <CopyOutlined />}
                    onClick={() => handleCopy(listing.bulletPoints.join('\n'), 'bulletPoints')}
                  >
                    {copiedField === 'bulletPoints' ? '已复制' : '复制全部'}
                  </Button>
                </div>
                <List
                  bordered
                  dataSource={listing.bulletPoints}
                  renderItem={(item, index) => (
                    <List.Item>
                      <div className="flex items-start gap-2 w-full">
                        <Text strong className="flex-shrink-0">
                          {index + 1}.
                        </Text>
                        <Text className="flex-1">{item}</Text>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopy(item, `bullet-${index}`)}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              <Divider />

              {/* 产品描述 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Title level={4} className="mb-0">产品描述</Title>
                  <Button
                    type="text"
                    size="small"
                    icon={copiedField === 'description' ? <CheckCircleOutlined /> : <CopyOutlined />}
                    onClick={() => handleCopy(listing.description, 'description')}
                  >
                    {copiedField === 'description' ? '已复制' : '复制'}
                  </Button>
                </div>
                <Paragraph 
                  copyable={false}
                  className="bg-gray-50 p-4 rounded border whitespace-pre-wrap"
                >
                  {listing.description}
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Amazon
