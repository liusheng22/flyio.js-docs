<template>
  <div class="document-app">
    <div class="sidebar" :class="{ 'sidebar-open': drawer }">
      <div class="menu-section">
        <div class="menu-item" v-for="(item, i) in comMenus" :key="i" @click="go(item)">
          <span class="menu-icon">
            <i class="material-icons">{{ item.icon }}</i>
          </span>
          <span class="menu-title">{{ item.title }}</span>
        </div>
      </div>

      <!--文档列表菜单-->
      <div class="menu-section" v-if="store.menus">
        <div class="menu-group" v-for="(dir, i) in store.menus.dirs" :key="i">
          <div class="menu-group-header" @click="toggleGroup(i)">
            <span class="menu-icon">
              <i class="material-icons">{{ dir.icon || "folder" }}</i>
            </span>
            <span class="menu-title">{{ dir.title }}</span>
            <span class="arrow" :class="{ 'arrow-down': openGroups[i] }">▶</span>
          </div>

          <div class="submenu" v-show="openGroups[i]">
            <div class="submenu-item"
              v-for="subItem in dir.list"
              :key="subItem.title"
              :class="{ 'active': subItem.file == $route.params.name }"
              @click="$router.push({path:`/doc/${path}/${subItem.file}`})">
              {{ subItem.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="toolbar" :class="store.menus.toolbarClass || 'teal'" v-show="show">
        <button class="menu-btn" @click="drawer = !drawer">☰</button>
        <h1 class="toolbar-title">{{ store.title }}</h1>
        <div class="toolbar-spacer"></div>
        <a v-if="store.menus.git" :href="store.menus.git" class="github-link">GitHub</a>
      </div>

      <div class="content">
        <router-view style="min-height: calc(100vh - 210px);"></router-view>
        <copy-right></copy-right>
      </div>
    </div>
  </div>
</template>

<script>
  import CopyRight from "../CopyRight.vue"
  export default {
    components: {
      CopyRight
    },
    data () {
      return {
        clipped: false,
        drawer: true, // 默认打开 sidebar
        items: [
          { icon: 'home', title: 'Home page' , route:"/"}
        ],
        store: store,
        show:false,
        path:"",
        openGroups: {}
      }
    },
    beforeRouteUpdate(to,from,next){
      this.load(to)
      next()
    },
    created(){
      this.load(this.$route)
    },
    computed:{
      comMenus(){
        return this.items.concat(this.store.menus.menus||[]);
      }
    },
    methods:{
      toggleGroup(index) {
        this.$set(this.openGroups, index, !this.openGroups[index]);
      },
      go(item){
        if(item.route.startsWith("http")){
          location.href=item.route;
        }else{
          this.$router.push({path:item.route})
        }
      },
      load(route){
        this.path=route.params.path;
        fly.get(`/static/doc/${this.path}/menus.json`).then(d=>{

          var pre;
          var map={};
          d.data.dirs.forEach((e, index)=>{
            // 默认展开所有文档组
            this.$set(this.openGroups, index, true);

            e.list.forEach(item=>{
              if(pre){
                pre.next=item;
                item.pre=pre;
              }
              pre=map[item.file]=item;
            })
          })
          store.menus=d.data;
          store.map=map;

          setTimeout(()=>{
            this.show=true;
          },18);
          store.title=store.menus&&store.menus.pageTitle||"文档中心";
          document.getElementsByTagName('title')[0].innerText=store.title;
        })
      }
    }
  }
</script>
<style lang="stylus">
  .document-app {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 280px;
    background: #f5f5f5;
    border-right: 1px solid #ddd;
    transform: translateX(0); // 默认显示
    transition: transform 0.3s ease;
    position: fixed;
    height: calc(100vh - 65px);
    z-index: 1000;
    top: 65px;
    overflow-y: auto;
  }

  .sidebar:not(.sidebar-open) {
    transform: translateX(-100%);
  }

  .sidebar-header {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    text-align: right;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }

  .menu-section {
    padding: 10px 0;
  }

  .menu-item, .menu-group-header {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s;
    white-space: nowrap; // 防止文字换行
  }

  .menu-item:hover, .menu-group-header:hover {
    background: #e0e0e0;
  }

  .menu-icon {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }

  .menu-title {
    flex: 1;
    white-space: nowrap; // 防止文字换行
    overflow: hidden; // 隐藏溢出内容
    text-overflow: ellipsis; // 显示省略号
  }

  .arrow {
    transition: transform 0.2s;
  }

  .arrow-down {
    transform: rotate(90deg);
  }

  .submenu {
    background: #fafafa;
  }

  .submenu-item {
    padding: 10px 20px 10px 50px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submenu-item:hover {
    background: #e8e8e8;
  }

  .submenu-item.active {
    background: #009688;
    color: white;
  }

  .main-content {
    flex: 1;
    margin-left: 280px; // 默认给 sidebar 留出空间
    transition: margin-left 0.3s ease;
  }

  .sidebar:not(.sidebar-open) + .main-content {
    margin-left: 0;
  }

  .toolbar {
    background: #009688;
    color: white;
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .menu-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-right: 15px;
  }

  .toolbar-title {
    margin: 0;
    font-size: 20px;
    font-weight: normal;
  }

  .toolbar-spacer {
    flex: 1;
  }

  .github-link {
    color: white;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 4px;
    background: rgba(255,255,255,0.1);
  }

  .content {
    margin-top: 64px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
    }

    .sidebar-open + .main-content {
      margin-left: 0;
    }
  }
</style>
