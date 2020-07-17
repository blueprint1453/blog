const mode = process.env.NODE_ENV
let base = mode === 'development' ? '/' : '/blog/'
module.exports = {
  base: base,
  cache: true,
  title: 'blueprint的博客',
  description: '专注于前端技术栈',
  themeConfig: {
    nav: [{ text: "主页", link: "/" },
    { text: "前端", link: "/web/" },
    { text: "算法", link: "/algorithm/" },
    { text: "nodejs", link: "/nodejs/" },
    { text: "数据库", link: "/database/" },
    // { text: "开发工具", link: "/tools/" },
    { text: "面试问题", link: "/interview/" },

    ],
    // sidebar: 'auto',
    sidebarDepth: 2,
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: false,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: false,
    sidebar: {
      collapsable: false,
      '/web/': ['', 'js-basics', 'api-polyfill','promise', 'browser', 'css', 'js-lib'],
      // fallback
      // '/': [
      //   '',        /* / */
      //   'nodejs', /* /contact.html */
      //   'algorithm',    /* /about.html */
      //   'database',
      //   'tools',
      //   'interview',
      // ]
    }
  },
}
