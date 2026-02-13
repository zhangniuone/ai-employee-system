const axios = require('axios');
const logger = require('./logger');

/**
 * AI 工具类
 * 封装多模型调用
 */
class AI {
  constructor() {
    this.model = process.env.DEFAULT_MODEL || 'kimi';
  }

  async generate(prompt, options = {}) {
    const model = options.model || this.model;
    
    switch (model) {
      case 'kimi':
        return this.callKimi(prompt, options);
      case 'claude':
        return this.callClaude(prompt, options);
      case 'openai':
        return this.callOpenAI(prompt, options);
      case 'qwen':
        return this.callQwen(prompt, options);
      default:
        throw new Error(`不支持的模型: ${model}`);
    }
  }

  async callKimi(prompt, options) {
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      throw new Error('未配置 Kimi API Key');
    }

    try {
      const response = await axios.post(
        'https://api.moonshot.cn/v1/chat/completions',
        {
          model: 'moonshot-v1-8k',
          messages: [
            { role: 'system', content: '你是一个专业的内容创作助手。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        text: response.data.choices[0].message.content,
        model: 'kimi'
      };
    } catch (error) {
      logger.error('Kimi API 调用失败:', error.message);
      throw error;
    }
  }

  async callClaude(prompt, options) {
    // TODO: 实现 Claude API 调用
    throw new Error('Claude API 暂未实现');
  }

  async callOpenAI(prompt, options) {
    // TODO: 实现 OpenAI API 调用
    throw new Error('OpenAI API 暂未实现');
  }

  async callQwen(prompt, options) {
    // TODO: 实现通义千问 API 调用
    throw new Error('Qwen API 暂未实现');
  }
}

module.exports = AI;