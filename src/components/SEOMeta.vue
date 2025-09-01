<template>
  <div style="display: none;">
    <!-- 这是一个无渲染组件，只用于管理 meta 标签 -->
  </div>
</template>

<script>
export default {
  name: 'SEOMeta',
  props: {
    title: {
      type: String,
      default: 'Flyio.js Documentation'
    },
    description: {
      type: String,
      default: 'Flyio.js 是一个轻量级、功能强大的 JavaScript HTTP 请求库，支持浏览器、Node.js、微信小程序等环境。'
    },
    keywords: {
      type: String,
      default: 'Flyio.js, HTTP请求, Ajax, JavaScript, 网络请求, 微信小程序, Node.js'
    },
    canonical: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: '/static/v.png'
    },
    type: {
      type: String,
      default: 'website'
    },
    author: {
      type: String,
      default: 'liusheng22'
    }
  },
  watch: {
    title: {
      immediate: true,
      handler(newTitle) {
        this.updateTitle(newTitle)
        this.updateOpenGraph('og:title', newTitle)
        this.updateTwitterCard('twitter:title', newTitle)
      }
    },
    description: {
      immediate: true,
      handler(newDesc) {
        this.updateMeta('description', newDesc)
        this.updateOpenGraph('og:description', newDesc)
        this.updateTwitterCard('twitter:description', newDesc)
      }
    },
    keywords: {
      immediate: true,
      handler(newKeywords) {
        this.updateMeta('keywords', newKeywords)
      }
    },
    canonical: {
      immediate: true,
      handler(newCanonical) {
        this.updateCanonical(newCanonical)
        this.updateOpenGraph('og:url', newCanonical)
      }
    },
    image: {
      immediate: true,
      handler(newImage) {
        this.updateOpenGraph('og:image', newImage)
        this.updateTwitterCard('twitter:image', newImage)
      }
    },
    type: {
      immediate: true,
      handler(newType) {
        this.updateOpenGraph('og:type', newType)
      }
    },
    author: {
      immediate: true,
      handler(newAuthor) {
        this.updateMeta('author', newAuthor)
      }
    }
  },
  mounted() {
    // 添加固定的 meta 标签
    this.updateTwitterCard('twitter:card', 'summary_large_image')
    this.updateOpenGraph('og:site_name', 'Flyio.js Documentation')
  },
  methods: {
    updateTitle(title) {
      document.title = title
    },
    updateMeta(name, content) {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    },
    updateOpenGraph(property, content) {
      if (!content) return

      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.content = content
    },
    updateTwitterCard(name, content) {
      if (!content) return

      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    },
    updateCanonical(url) {
      if (!url) return

      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = url
    }
  }
}
</script>
