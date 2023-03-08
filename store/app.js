export const state = () => ({
  layoutCleanModeDark: true
})

export const mutations = {
  TOOGLE_DARK_MODE_CLEAN (state) {
    state.layoutCleanModeDark = !state.layoutCleanModeDark
  }
}
