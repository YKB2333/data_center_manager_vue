const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  permissinRoutes: state => state.user.permissinRoutes,
  appMenuList: state => state.user.appMenuList,
  loading: state => state.app.loading,
  loadingText: state => state.app.loadingText,
}
export default getters
