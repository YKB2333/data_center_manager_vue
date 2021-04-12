const importDirective = Vue => {
	// <button v-permission-button="'name"></button>
	Vue.directive('permissionButton', {
		inserted: (el, binding, vnode) => {
			const permissionList = vnode.context.$route.meta && (vnode.context.$route.meta.permission || [])
			if (!permissionList.find(item => item.code === binding.value) || permissionList.length === 0) {
				el.parentNode.removeChild(el)
			}
		}
	})
}
export default importDirective
