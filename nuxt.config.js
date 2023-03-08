import bodyParser from 'body-parser'

export default {
  server: {
    host: '0.0.0.0'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Bina Darma TV',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Aplikasi Streaming Bina Darma TV' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'nuxt-device-detect'
  ],
  /*
  ** Axios
  */
  axios: {
    proxy: true
    // baseURL: 'http://btv.binadarma.ac.id'
  },
  proxy: {
    '/api/': 'http://103.98.120.24:3000/'
  },
  /*
  ** Auth
  */
  auth: {
    cookie: {
      prefix: 'wys.',
      expires: 1
    },
    localStorage: false,
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: 'token.accessToken' }
        }
      }
    },
    redirect: {
      login: '/backend/login',
      home: '/backend'
    }
  },
  plugins: [
    '~/plugins/vuetify.js',
    {
      src: '~/plugins/vue2-siema.js',
      ssr: false
    },
    {
      src: '~/plugins/simple-uploader.js',
      ssr: false
    },
    {
      src: '~/plugins/nuxt-video-player.js',
      ssr: false
    }
  ],
  css: [
    '~/assets/style/app.styl',
    '~/assets/roboto-fontface/css/roboto/roboto-fontface.css',
    '~/assets/material-design-icons/material-design-icons.css',
    'video.js/dist/video-js.css'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** Server Middleware
  */
  serverMiddleware: [
    bodyParser.json({
      limit: '50gb',
      extended: true
    }),
    '~/api'
  ]
}
