export default {
    root: '.',
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
  