/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/admin-api/': {
      target: "http://210.28.133.13:21247/admin-api/",
      changeOrigin: true,
      pathRewrite: {'^/admin-api/': ''},
    },
  },
  test: {
    '/admin-api/': {
      //target: "http://210.28.133.13:21247/admin-api/",
      target: "http://10.0.0.8:48080/admin-api/",
      changeOrigin: true,
      pathRewrite: {'^/admin-api': ''},
    },
  },
  prod: {
    '/admin-api/': {
      target: "http://127.0.0.1:23000/admin-api/",
      changeOrigin: true,
      pathRewrite: {'^/admin-api': ''},
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
  },
};
