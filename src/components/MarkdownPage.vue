<template>
  <div class="markdown-page">
    <SEOMeta
      :title="seoTitle"
      :description="seoDescription"
      :keywords="seoKeywords"
      :canonical="seoCanonical"
      :image="seoImage"
      type="article"
    />
    <StructuredData
      type="Article"
      :title="seoTitle"
      :description="seoDescription"
      :url="seoCanonical"
      :image="seoImage"
    />
    <div class="content fade" v-show="!loading" :style="{opacity:opacity?0:1}">
      <markdown :data="data"></markdown>
      <div
        v-if="current.next||current.pre"
        style="margin-top: 50px; background: #f1f1f1; padding: 12px; font-weight: bold; border-radius: 2px"
      >
        <div v-if="current.next">
          Next： <a :href="`#/doc/${path}/${current.next.file}`" style="text-decoration: none">
          {{current.next.title}}
        </a>
        </div>
        <div v-else>
          已是最后一篇, 您可以打开菜单栏浏览目录。
        </div>
      </div>
      <div id="comments"></div>
    </div>
    <div class="loading" v-if="loading" style="text-align: center; margin-top: 30px">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style lang="stylus">
  .markdown-page {
    margin: 30px auto;
    max-width: 800px;
    padding: 0 20px;
  }

  .content {
    transition: all .2s
  }

  .fade {
    opacity: 0;
  }

  .loading .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #009688;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  #comments {
    border-top #ddd 1px solid
    margin-top 40px
    padding-top 10px
    button {
      margin-bottom: 0;
    }
    .gitment-comment-header {
      background: transparent
    }
  }
</style>
<script>
  import Markdown from './Markdown.vue'
  import SEOMeta from './SEOMeta.vue'
  import StructuredData from './StructuredData.vue'
  import { gitmentConfig } from "../config/gitment.js"

  export default {
    components: {
      Markdown,
      SEOMeta,
      StructuredData
    },
    data: () => ({
      data: "",
      path: "",
      name: "",
      store: store,
      loading: false,
      opacity: false
    }),
    computed: {
      current() {
        return this.store.map[this.name] || {}
      },
      seoTitle() {
        const currentTitle = this.current.title || this.name
        return currentTitle ? `${currentTitle} - Flyio.js Documentation` : 'Flyio.js Documentation'
      },
      seoDescription() {
        // 从 markdown 内容中提取前 160 个字符作为描述
        if (this.data) {
          let cleanText = this.data
            // 移除图片语法 ![alt](url)
            .replace(/!\[.*?\]\(.*?\)/g, '')
            // 移除链接语法，保留链接文本 [text](url) -> text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // 移除代码块
            .replace(/```[\s\S]*?```/g, '')
            // 移除行内代码
            .replace(/`[^`]+`/g, '')
            // 移除标题标记
            .replace(/#{1,6}\s+/g, '')
            // 移除粗体斜体标记
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            // 移除表格分隔符和多余的管道符
            .replace(/\|/g, ' ')
            .replace(/[-:]+/g, '')
            // 移除多余的空白字符和换行
            .replace(/\s+/g, ' ')
            .trim()

          // 提取前160个字符，确保不在单词中间截断
          if (cleanText.length > 160) {
            cleanText = cleanText.substring(0, 160)
            const lastSpace = cleanText.lastIndexOf(' ')
            if (lastSpace > 100) { // 确保不会截取得太短
              cleanText = cleanText.substring(0, lastSpace)
            }
            cleanText += '...'
          }

          return cleanText.length > 0 ? cleanText : 'Flyio.js 是一个轻量级、功能强大的 JavaScript HTTP 请求库'
        }
        return 'Flyio.js 是一个轻量级、功能强大的 JavaScript HTTP 请求库'
      },
      seoKeywords() {
        const baseKeywords = 'Flyio.js, HTTP请求, Ajax, JavaScript, 网络请求'
        const currentTitle = this.current.title
        return currentTitle ? `${baseKeywords}, ${currentTitle}` : baseKeywords
      },
      seoCanonical() {
        return `https://flyio-js.vercel.app/doc/${this.path}/${this.name}`
      },
      seoImage() {
        return 'https://flyio-js.vercel.app/static/v.png'
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.load(to)
      next()
    },
    created: function () {
      this.load(this.$route)
    },
    methods: {
      load(route) {
        if (this.loading) {
          return;
        }

        this.loading = true;
        this.opacity = true;
        this.path = route.params.path;
        this.name = route.params.name
        var start = Date.now();
        var wait = () => {
          var pass = Date.now() - start
          if (pass < 1000) {
            setTimeout(() => {
              this.loading = false;
              setTimeout(() => {
                this.opacity = false
              }, 20)
            }, 800 - pass)
          } else {
            this.loading = false;
            setTimeout(() => {
              this.opacity = false
            }, 100)
          }
        }
        // alert(document.documentElement.scrollTop)
        // alert(document.body.scrollTop)
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        fly.get(`/static/doc/${this.path}/${this.name}.md`).then(d => {
          this.data = d.data;
          wait();
          this.renderComment();

          // 触发预渲染完成事件
          document.dispatchEvent(new Event('render-event'));
        }).catch(e => {
          alert(e.message);
          wait()
        })
      },
      renderComment() {
        var myTheme = {
          render(state, instance) {
            const container = document.createElement('div')
            container.lang = "en-US"
            container.className = 'gitment-container gitment-root-container'
            container.appendChild(instance.renderHeader(state, instance))
            container.appendChild(instance.renderComments(state, instance))
            container.appendChild(instance.renderEditor(state, instance))
            container.appendChild(instance.renderFooter())
            return container
          },
          renderFooter() {
            const container = document.createElement('div')
            container.lang = "en-US"
            container.className = 'gitment-container gitment-footer-container'
            container.innerHTML = `
              Contact me by
              <a class="gitment-footer-project-link" href="https://juejin.im/user/3171444673228840/posts" target="_blank">
                Blog
              </a> or
              <a class="gitment-footer-project-link" href="https://github.com/liusheng22" target="_blank">
                Github
              </a>
            `
            return container
          }
        }
        var gitment = new Gitment({
          id: this.current.title,
          owner: gitmentConfig.owner,
          repo: gitmentConfig.repo,
          theme: myTheme,
          oauth: {
            client_id: gitmentConfig.oauth.client_id,
            client_secret: gitmentConfig.oauth.client_secret,
          },
          labels: gitmentConfig.labels,
          perPage: gitmentConfig.perPage,
          maxCommentHeight: gitmentConfig.maxCommentHeight
        })
        gitment.render('comments')
      }
    }
  }
</script>

