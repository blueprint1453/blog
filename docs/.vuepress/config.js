const mode = process.env.NODE_ENV
let base = mode === 'development' ? '/' : '/blog/'

// 头部导航
const headNav = [
  // { text: "主页", link: "/" },
  {
    text: "前端",
    items: [
      { text: 'js笔记', link: '/javascript/'},
      { text: 'html和浏览器', link: '/html/' },
      { text: 'css笔记', link: '/css/' },
      { text: '正则', link: '/regexp/' },
    ]
  },
  { text: 'js框架和库', 
    items: [
      { text: 'vue专题', link: '/vue/'},
      { text: 'react专题', link: '/react/'},
    ]
  },
  { text: "算法", link: "/algorithm/" },
  { text: "nodejs", link: "/nodejs/" },
  { text: "数据库", link: "/database/" },
  { text: "面试问题", link: "/interview/" },
  // { text: "GitHub", link: "https://github.com/blueprint1453/blog" },
];

module.exports = {
  base: base,
  cache: true,
  title: 'blueprint的博客',
  description: '专注于前端技术栈',
  themeConfig: {
    nav: headNav,
    sidebarDepth: 3,
    nextLinks: false,
    prevLinks: false,
    smoothScroll: true,
    repo: 'blueprint1453/blog',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitHub',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
     
    sidebar: {
      collapsable: true,
      '/javascript/': ['', 'js-basics', 'api-polyfill', 'promise'],
      '/html/': ['', 'basis', 'http-status', 'performance', 'dom-event', 'timer', 'event-loop'],
      '/css/': ['', 'css-selector', 'css-theory', 'position'],
      '/regexp/': [''],
      '/js-lib/': ['vue', 'react'],
      '/vue/': ['', 'reactive-1', 'reactive-2', 'reactive-3', 'nextTick'],
      '/algorithm/': ['', 'query', 'sort']
    }
  },
  head: [
    ['script', { src: 'https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }],
  ],
  plugins: [
      '@vuepress/back-to-top',
      'demo-block',
      '@vuepress-reco/extract-code',
      '@vuepress/register-components',
        {
          componentsDir: 'components'
        }
    ]
}