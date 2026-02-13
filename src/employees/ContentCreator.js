const logger = require('../utils/logger');
const AI = require('../utils/ai');

/**
 * 内容创作员工
 * 负责生成各平台的内容
 */
class ContentCreator {
  constructor(config) {
    this.config = config;
    this.ai = new AI();
  }

  getConfig() {
    return this.config;
  }

  async work() {
    logger.info(`📝 [${this.config.name}] 开始内容创作任务`);

    for (const task of this.config.tasks) {
      try {
        switch (task) {
          case 'generate_post':
            await this.generatePost();
            break;
          case 'auto_reply':
            await this.autoReply();
            break;
          default:
            logger.warn(`⚠️ 未知任务类型: ${task}`);
        }
      } catch (error) {
        logger.error(`❌ 任务执行失败: ${task}`, error.message);
      }
    }
  }

  async generatePost() {
    const topic = this.selectTopic();
    const platform = this.config.platform;
    
    logger.info(`🎯 生成${platform}内容: ${topic}`);

    const prompt = this.buildPrompt(topic, platform);
    const content = await this.ai.generate(prompt);

    // 保存到文件
    await this.saveContent(content, platform, topic);
    
    logger.info(`✅ 内容生成完成: ${content.title || '未命名'}`);
    
    return content;
  }

  async autoReply() {
    // 自动回复逻辑
    logger.info('💬 检查待回复消息...');
    // TODO: 实现各平台的回复逻辑
  }

  selectTopic() {
    const topics = this.config.config?.topics || ['AI工具'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  buildPrompt(topic, platform) {
    const templates = {
      xiaohongshu: `请为小红书创作一篇关于"${topic}"的笔记。
要求：
- 标题吸引人，有emoji
- 正文轻松幽默，口语化
- 3-5个关键要点
- 结尾引导互动
- 添加相关话题标签
- 字数控制在${this.config.config?.maxLength || 800}字以内`,

      wechat: `请为公众号创作一篇关于"${topic}"的文章。
要求：
- 有吸引力的标题
- 开篇抓人眼球
- 结构清晰，有干货
- 适合转发分享
- 字数1000-2000字`,

      xianyu: `请为闲鱼商品写一段描述文案。
商品：${topic}
要求：
- 突出卖点
- 营造稀缺感
- 建立信任
- 引导私聊
- 避免违禁词`
    };

    return templates[platform] || templates.xiaohongshu;
  }

  async saveContent(content, platform, topic) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const date = new Date().toISOString().split('T')[0];
    const dir = path.join('./data/content', platform, date);
    await fs.mkdir(dir, { recursive: true });
    
    const filename = `${Date.now()}_${topic.replace(/\s+/g, '_')}.json`;
    const filepath = path.join(dir, filename);
    
    await fs.writeFile(filepath, JSON.stringify({
      topic,
      platform,
      content,
      createdAt: new Date().toISOString()
    }, null, 2));
  }
}

module.exports = ContentCreator;