export const AppConstantRoutes = {
  paths: {
    get auth() {
      return {
        get default() {
          return '/auth'
        },
        get login() {
          return `${this.default}/login`
        },
        get register() {
          return `${this.default}/register`
        },
      }
    },
    get home() {
      return '/home'
    },
    get example() {
      return {
        get default() {
          return '/example'
        },
      }
    },
  },
}
