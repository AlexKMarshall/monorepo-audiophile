module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/headphones'],
      startServerCommand: 'pnpm start',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
