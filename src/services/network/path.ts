export const ApiConstantRoutes = {
  paths: {
    get auth() {
      return {
        get default() {
          return `/auth`
        },
        get login() {
          return `${this.default}/login`
        },
        get register() {
          return `${this.default}/register`
        },
        get resendEmail() {
          return `${this.default}/resend-email`
        },
        get verifyEmail() {
          return `${this.default}/verify-email/:token`
        },
      }
    },
  },
}
