export const state = () => ({
  diskInfo: {}
})

export const mutations = {
  storeDiskInfo (state, data) {
    state.diskInfo = data
  }
}

export const getters = {
  diskInfo (state) {
    return state.diskInfo
  }
}

export const actions = {
  async fetchDiskInfo ({ commit }, { payload }) {
    try {
      const { data } = await this.$axios.post(`/api/sysoverview/disk`, payload)

      commit('storeDiskInfo', data.result)
    } catch (error) {
      console.error(error)
    }
  }
}
