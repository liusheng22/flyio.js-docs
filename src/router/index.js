import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import MarkdownPage from '../components/MarkdownPage.vue'
import Document from '../components/pages/Document.vue'
import Language from '../components/Language.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/doc/flyio/readme'
    },
    {
      path:"/language",
      component: Language
    },
    {
      path: '/doc', component:Document,
      children:[
        {
          path: ':path/:name',
          component: MarkdownPage
        }
      ]

    }
  ]
})
