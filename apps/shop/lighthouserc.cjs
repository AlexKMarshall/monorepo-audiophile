module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/headphones',
        'http://localhost:3000/product/xx99-mark-ii-headphones',
      ],
      startServerCommand: 'pnpm start',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
