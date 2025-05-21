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
    get verifyEmail() {
      return {
        get default() {
          return '/verify-email'
        },
        get sent() {
          return `${this.default}/sent`
        },
        get confirmed() {
          return `${this.default}/:token`
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
