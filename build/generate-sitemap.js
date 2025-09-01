const fs = require('fs')
const path = require('path')

// 获取文件的最后修改时间
function getFileLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime.toISOString().split('T')[0]
  } catch (error) {
    // 如果文件不存在，返回当前日期
    return new Date().toISOString().split('T')[0]
  }
}

// 根据页面类型确定优先级
function getPagePriority(docDir, fileName) {
  if (fileName === 'readme') return '0.9'  // 主要文档页面
  if (fileName === 'config' || fileName === 'interceptor') return '0.8'  // 重要配置页面
  if (fileName === 'faq' || fileName === 'compare') return '0.6'  // FAQ和比较页面
  return '0.7'  // 其他文档页面
}

// 根据页面类型确定更新频率
function getChangeFreq(fileName) {
  if (fileName === 'readme') return 'weekly'    // 主要文档可能经常更新
  if (fileName === 'faq') return 'monthly'      // FAQ相对稳定
  if (fileName === 'compare') return 'monthly'  // 比较页面相对稳定
  return 'weekly'  // 其他页面默认每周
}

// 读取文档结构生成 sitemap
function generateSitemap() {
  const siteUrl = 'https://flyio-js.vercel.app'
  const staticDir = path.resolve(__dirname, '../static')
  const distDir = path.resolve(__dirname, '../dist')

  let urls = []

  // 添加主页 - 使用 index.html 的修改时间
  const indexPath = path.resolve(__dirname, '../template.html')
  urls.push({
    loc: siteUrl + '/',
    lastmod: getFileLastModified(indexPath),
    changefreq: 'weekly',
    priority: '1.0'
  })

  // 添加语言选择页面 - 使用当前时间（动态页面）
  urls.push({
    loc: siteUrl + '/language',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  })

  // 扫描文档目录
  const docDirs = ['flyio', 'flyio-en']

  docDirs.forEach(docDir => {
    const docPath = path.join(staticDir, 'doc', docDir)
    const menusPath = path.join(docPath, 'menus.json')

    if (fs.existsSync(menusPath)) {
      try {
        const menus = JSON.parse(fs.readFileSync(menusPath, 'utf8'))

        if (menus.dirs) {
          menus.dirs.forEach(dir => {
            if (dir.list) {
              dir.list.forEach(item => {
                // 获取实际文件路径
                const mdFilePath = path.join(docPath, `${item.file}.md`)

                urls.push({
                  loc: `${siteUrl}/doc/${docDir}/${item.file}`,
                  lastmod: getFileLastModified(mdFilePath),
                  changefreq: getChangeFreq(item.file),
                  priority: getPagePriority(docDir, item.file)
                })
              })
            }
          })
        }
      } catch (error) {
        console.warn(`无法解析 ${menusPath}:`, error.message)
      }
    }
  })

  // 生成 XML
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
  const xmlUrlset = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  let xmlContent = xmlHeader + xmlUrlset

  urls.forEach(url => {
    xmlContent += '  <url>\n'
    xmlContent += `    <loc>${url.loc}</loc>\n`
    xmlContent += `    <lastmod>${url.lastmod}</lastmod>\n`
    xmlContent += `    <changefreq>${url.changefreq}</changefreq>\n`
    xmlContent += `    <priority>${url.priority}</priority>\n`
    xmlContent += '  </url>\n'
  })

  xmlContent += '</urlset>'

  // 写入 sitemap.xml 到 static 和 dist 目录
  const sitemapPath = path.join(staticDir, 'sitemap.xml')
  const distSitemapPath = path.join(distDir, 'sitemap.xml')

  fs.writeFileSync(sitemapPath, xmlContent)
  console.log(`✓ Sitemap 已生成: ${sitemapPath}`)

  // 确保 dist 目录存在
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  fs.writeFileSync(distSitemapPath, xmlContent)
  console.log(`✓ Sitemap 已复制到: ${distSitemapPath}`)

  console.log(`✓ 总共生成了 ${urls.length} 个 URL`)
}

// 执行生成
generateSitemap()

module.exports = generateSitemap
