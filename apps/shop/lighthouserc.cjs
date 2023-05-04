module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'pnpm start',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
