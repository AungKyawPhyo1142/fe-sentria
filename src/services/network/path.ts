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
      }
    },
  },
}
