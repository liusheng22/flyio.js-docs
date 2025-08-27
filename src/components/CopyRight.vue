<template>
  <div style='color: #aaa; text-align: center; margin-top: 40px; padding-bottom: 30px;'>
    Copyright &copy; liusheng22 {{new Date().getFullYear()}}
    <a v-if="store.menus.git" :href="store.menus.git" style="margin-left: 10px; color: #aaa; text-decoration: none;">GitHub</a>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        store:store
      }
    }
  }
</script>
