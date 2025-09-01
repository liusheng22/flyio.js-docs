<template>
  <div style="display: none;">
    <!-- 该组件不渲染任何可见内容，只用于在head中注入结构化数据 -->
  </div>
</template>

<script>
export default {
  name: "StructuredData",
  props: {
    type: {
      type: String,
      required: true,
    },
    title: String,
    description: String,
    url: String,
    image: String,
    author: {
      type: String,
      default: "liusheng22",
    },
    publisher: {
      type: String,
      default: "Flyio.js Documentation",
    },
    datePublished: String,
    dateModified: String,
  },
  data() {
    return {
      scriptElement: null,
    };
  },
  watch: {
    // 监听所有props变化以重新生成JSON-LD
    type: {
      immediate: true,
      handler() {
        this.updateStructuredData();
      },
    },
    title: {
      immediate: true,
      handler() {
        this.updateStructuredData();
      },
    },
    description: {
      immediate: true,
      handler() {
        this.updateStructuredData();
      },
    },
    url: {
      immediate: true,
      handler() {
        this.updateStructuredData();
      },
    },
    image: {
      immediate: true,
      handler() {
        this.updateStructuredData();
      },
    },
  },
  methods: {
    updateStructuredData() {
      // 清理旧的结构化数据
      this.removeExistingScript();

      // 创建基础结构化数据对象
      var structuredData = {};

      if (this.type === "WebSite") {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: this.title || "Flyio.js Documentation",
          url: this.url || "https://flyio-js.vercel.app",
          description: this.description,
          author: {
            "@type": "Person",
            name: this.author,
          },
          publisher: {
            "@type": "Organization",
            name: this.publisher,
            logo: {
              "@type": "ImageObject",
              url: "https://flyio-js.vercel.app/static/v.png",
            },
          },
        };
      } else if (this.type === "Article") {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: this.title,
          description: this.description,
          url: this.url,
          image: this.image,
          author: {
            "@type": "Person",
            name: this.author,
          },
          publisher: {
            "@type": "Organization",
            name: "Flyio.js Documentation",
            logo: {
              "@type": "ImageObject",
              url: "https://flyio-js.vercel.app/static/v.png",
            },
          },
          datePublished:
            this.datePublished || new Date().toISOString().split("T")[0],
          dateModified:
            this.dateModified || new Date().toISOString().split("T")[0],
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": this.url,
          },
        };
      } else if (this.type === "SoftwareApplication") {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: this.title || "Flyio.js",
          description: this.description,
          url: this.url,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          programmingLanguage: "JavaScript",
          license: "MIT",
        };
      }

      // 添加新的结构化数据
      var script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-structured-data", "true");
      // 使用简单的手动 JSON 序列化，避免 babel runtime 问题
      script.textContent = this.simpleStringify(structuredData);
      document.head.appendChild(script);

      // 保存引用以便清理
      this.scriptElement = script;
    },

    simpleStringify(obj) {
      // 手动构建JSON字符串，避免babel transform-runtime问题
      return this.buildJsonString(obj, 0);
    },

    buildJsonString(obj, indent) {
      var spaces = "";
      for (var i = 0; i < indent * 2; i++) {
        spaces += " ";
      }
      var nextSpaces = "";
      for (var j = 0; j < (indent + 1) * 2; j++) {
        nextSpaces += " ";
      }

      if (obj === null) return "null";
      if (obj === undefined) return "undefined";
      if (obj === true) return "true";
      if (obj === false) return "false";

      // 处理字符串
      if (Object.prototype.toString.call(obj) === "[object String]") {
        return '"' + obj.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
      }

      // 处理数字
      if (Object.prototype.toString.call(obj) === "[object Number]") {
        return String(obj);
      }

      // 处理数组
      if (Object.prototype.toString.call(obj) === "[object Array]") {
        if (obj.length === 0) return "[]";
        var items = [];
        for (var k = 0; k < obj.length; k++) {
          items.push(nextSpaces + this.buildJsonString(obj[k], indent + 1));
        }
        return "[\n" + items.join(",\n") + "\n" + spaces + "]";
      }

      // 处理对象
      if (Object.prototype.toString.call(obj) === "[object Object]") {
        var pairs = [];
        for (var key in obj) {
          if (
            obj.hasOwnProperty &&
            obj.hasOwnProperty(key) &&
            obj[key] !== undefined
          ) {
            pairs.push(
              nextSpaces +
              '"' +
              key +
              '": ' +
              this.buildJsonString(obj[key], indent + 1)
            );
          }
        }
        if (pairs.length === 0) return "{}";
        return "{\n" + pairs.join(",\n") + "\n" + spaces + "}";
      }

      return '""';
    },

    removeExistingScript() {
      // 移除之前的结构化数据脚本
      var existingScripts = document.querySelectorAll(
        'script[data-structured-data="true"]'
      );
      for (var i = 0; i < existingScripts.length; i++) {
        var script = existingScripts[i];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
      this.scriptElement = null;
    },
  },

  beforeDestroy() {
    this.removeExistingScript();
  },
};
</script>
