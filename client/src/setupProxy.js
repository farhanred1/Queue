const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: {
        '^/api2': '',
      },
    })
  );
};
