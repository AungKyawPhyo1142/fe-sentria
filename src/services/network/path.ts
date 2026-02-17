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
        // get create() {
        //   return `${this.default}/create`
        // },
        getReportById(id: string) {
          return `${this.default}/${id}`
        },
        get createReport() {
          return `${this.default}/create`
        },
        deleteReport(id: string) {
          return `${this.default}/delete/${id}`
        },
        editReport(id: string) {
          return `${this.default}/update/${id}`
        },
        voteOnReport(id: string) {
          return `${this.default}/vote/${id}`
        },
      }
    },
    get location() {
      return {
        get reverseGeocode() {
          return `/location/reverse-geocode`
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
    get activity() {
      return {
        get default() {
          return '/activity'
        },
        get getAll() {
          return `${this.default}`
        },
        getById(id: string) {
          return `${this.default}/${id}`
        },
        get create() {
          return `${this.default}`
        },
        get update() {
          return `${this.default}/:id`
        },
        get delete() {
          return `${this.default}/:id`
        },
      }
    },
    get favorites() {
      return {
        get default() {
          return '/favorites'
        },
        get toggle() {
          return `${this.default}/toggle`
        },
        get getFavorites() {
          return `${this.default}`
        },
        getFavByType(postType: string) {
          return `${this.default}/${postType}`
        },
      }
    },
  },
}
