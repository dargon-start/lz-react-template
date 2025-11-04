# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 项目功能

### Amazon Listing 生成器

一个智能的 Amazon 产品 Listing 生成工具，通过分析竞争对手的产品信息，使用 GPT 模型生成高质量的 Listing 内容。

#### 功能说明

1. **商品搜索**：用户输入关键词，系统调用 Rainforest API 获取前20个相关商品数据
2. **智能筛选**：根据销量（评论数）筛选出前3个FBM（Fulfillment by Merchant，商家自配送）商品作为参考
3. **AI生成**：基于筛选出的商品信息，调用 GPT 模型生成模仿 Listing
4. **内容展示**：返回生成的标题、五点描述和产品描述

#### 使用方法

1. **配置 API Key**

   在项目根目录创建 `.env` 文件，添加以下配置：

   ```env
   # Rainforest API Key（必需）
   VITE_RAINFOREST_API_KEY=your_rainforest_api_key

   # GPT API Key（必需，二选一）
   VITE_OPENAI_API_KEY=your_openai_api_key
   # 或者使用自定义 GPT API
   VITE_GPT_API_URL=https://your-custom-gpt-api.com/v1/chat/completions
   VITE_GPT_API_KEY=your_gpt_api_key

   # GPT 模型名称（可选，默认为 gpt-4o-mini）
   VITE_GPT_MODEL=gpt-4o-mini
   ```

2. **获取 API Key**

   - **Rainforest API**：访问 [Rainforest API](https://www.rainforestapi.com/) 注册账号并获取 API Key
   - **OpenAI API**：访问 [OpenAI Platform](https://platform.openai.com/) 注册账号并获取 API Key

3. **使用流程**

   - 打开页面：在侧边栏菜单中找到 "Amazon Listing 生成器"
   - 输入关键词：在搜索框输入商品关键词（例如：wireless mouse）
   - 点击生成：点击"生成 Listing"按钮
   - 查看结果：系统会自动搜索商品、筛选参考商品，并生成 Listing 内容
   - 复制内容：可以单独复制标题、五点描述或产品描述

#### 技术实现

- **前端框架**：React + TypeScript + Vite
- **UI组件库**：Ant Design
- **API调用**：
  - Rainforest API：用于搜索 Amazon 商品数据
  - OpenAI GPT API：用于生成 Listing 内容
- **代码结构**：
  - `src/api/amazon/`：API 服务层
  - `src/pages/amazon/`：页面组件
  - `src/router/modules/amazon.tsx`：路由配置

#### 注意事项

1. **API Key 安全**：请勿将 `.env` 文件提交到代码仓库，建议添加到 `.gitignore`
2. **API 限制**：Rainforest API 和 OpenAI API 都有使用限制，请注意调用频率
3. **网络连接**：确保网络可以访问 Rainforest API 和 OpenAI API
4. **商品筛选**：系统会筛选出有评论数的FBM商品（商家自配送），如果关键词搜索不到符合条件的商品，请尝试其他关键词

#### 错误处理

- 如果提示 "API Key 未配置"，请检查 `.env` 文件是否正确配置
- 如果提示 "未找到相关商品"，请尝试使用其他关键词
- 如果提示 "未找到符合条件的FBM商品"，说明搜索结果中没有足够评论数的FBM商品
- 如果提示 "调用 API 失败"，请检查网络连接和 API Key 是否有效

#### 后续优化建议

1. 添加商品筛选条件（价格区间、评分范围等）
2. 支持批量生成多个商品的 Listing
3. 添加历史记录功能，保存生成的 Listing
4. 支持自定义 GPT 提示词模板
5. 添加导出功能（导出为 Word、PDF 等格式）

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname
    }
  }
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules
  }
})
```
