// Gitment 评论系统配置
export const gitmentConfig = {
  // GitHub 用户信息
  owner: 'liusheng22', // 替换为你的 GitHub 用户名
  repo: 'flyio', // 替换为你的仓库名，用于存储评论

  // GitHub OAuth 应用配置
  oauth: {
    client_id: 'd8649cd5a3c2155c01fe', // 替换为你的 GitHub OAuth Client ID
    // client_secret 从环境变量读取，不在代码中暴露
    client_secret: process.env.GITHUB_CLIENT_SECRET || '',
  },

  // 评论主题
  theme: 'default', // 可选: 'default', 'github', 'github-light'

  // 其他配置
  labels: ['comment'], // 评论标签
  perPage: 20, // 每页显示评论数
  maxCommentHeight: 250, // 评论最大高度
}
