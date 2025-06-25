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
        get sent() {
          return `${this.default}/verify-email/sent`
        },
        get confirmed() {
          return `${this.default}/verify-email/:token`
        },
      }
    },
    get onboarding() {
      return {
        get default() {
          return '/onboarding'
        },
        get welcome() {
          return `${this.default}/welcome`
        },
        get steps() {
          return `${this.default}/steps`
        },
      }
    },

    get home() {
      return '/home'
    },
    get map() {
      return '/map'
    },
    get profile() {
      return '/profile'
    },
    get example() {
      return {
        get default() {
          return '/example'
        },
      }
    },
    get default() {
      return '/'
    },
  },
}
