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
    get report() {
      return {
        get default() {
          return '/report'
        },
        getReports() {
          return `${this.default}`
        },
        getReportById(id: string) {
          return `${this.default}/${id}`
        },
        get createReport() {
          return `${this.default}/create`
        },
      }
    },
    get resources() {
      return {
        get default() {
          return '/resource'
        },
        get getAll() {
          return `${this.default}`
        },
        get getById() {
          return `${this.default}/:id`
        },
        get create() {
          return `${this.default}/create`
        },
        get update() {
          return `${this.default}/update/:id`
        },
        get delete() {
          return `${this.default}/delete/:id`
        },
      }
    },
  },
}
