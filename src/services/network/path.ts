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
        getReports() {
          return `/report`
        },
      }
    },
    get user() {
      return {
        get default() {
          return '/users'
        },
        get getProfile() {
          return `${this.default}/:id`
        },

        get updateProfile() {
          return `${this.default}/:id`
        },
      }
    },
  },
}
