export default {
  head: {
    title: '天然博客',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/iconfont.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '@/plugins/element-ui', ssr: true},
    {src: '@/assets/js/iconfont', ssr: false},
    {src: '@/plugins/word-cloud', ssr: false},
    {src: '@/plugins/dateformat', ssr: true},
    {src: '@/plugins/outline', ssr: true},
    {src: '@/plugins/highlight', ssr: true},
    {src: '@/plugins/components', ssr: false},
    {src: '@/plugins/md5', ssr: false}
  ],
  target: 'server',
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/portal': {
      target: 'http://8.140.252.56:2023',
      changeOrigin: true
    },
    '/user': {
      target: 'http://8.140.252.56:2023',
      changeOrigin: true
    },
    '/admin': {
      target: 'http://8.140.252.56:2023',
      changeOrigin: true
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  }
}
