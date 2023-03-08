export const state = () => ({
  pagination: {
    descending: false,
    page: 1,
    rowsPerPage: 5,
    sortBy: 'createdAt',
    totalItems: 0,
    search: ''
  },
  items: []
})

export const mutations = {
  setPagination (state, payload) {
    state.pagination = payload
  },
  storeItems (state, data) {
    state.items = data
    state.pagination['totalItems'] = data.length
  }
}

export const getters = {
  pagination (state) {
    return state.pagination
  },
  items (state) {
    return state.items
  }
}

export const actions = {
  async queryItems ({ commit, state }) {
    try {
      const { sortBy, descending, page, rowsPerPage } = state.pagination
      let queryParams = ''
      const order = (descending) ? 'desc' : 'asc'

      if (rowsPerPage > 0) {
        queryParams = `?__limit=${rowsPerPage}&__offset=${page - 1}&`
      } else {
        queryParams = `?`
      }

      if (sortBy) {
        queryParams += `__sort_by=${sortBy}.${order}`
      }

      const { status, data } = await this.$axios.get(`/api/ratings${queryParams}`)

      if (status === 200 && data.success) {
        commit('storeItems', data.data)
      }
    } catch (error) {
      console.error(error)
    }
  },
  async deleteItem ({ dispatch }, { payload, key }) {
    let params = ''

    try {
      for (let index = 0; index < payload.length; index++) {
        params += await payload[index][key]
        if (index < (payload.length - 1)) {
          params += await ','
        }
      }

      const { status, data } = await this.$axios.delete(`/api/ratings/${params}`)

      if (status === 200 && data.success) {
        dispatch('queryItems')
      }

      return data
    } catch (error) {
      return {
        success: false,
        response: 'Undefined error in store.'
      }
    }
  },
  async addItem ({ dispatch }, { payload }) {
    try {
      const { status, data } = await this.$axios.post(`/api/ratings`, payload)

      if (status === 201 && data.success) {
        dispatch('queryItems')
      }

      return data
    } catch (error) {
      return {
        success: false,
        response: 'Undefined error in store.'
      }
    }
  },
  async updateItem ({ dispatch }, { payload, id }) {
    try {
      const { status, data } = await this.$axios.put(`/api/ratings/${id}`, payload)

      if (status === 201 && data.success) {
        dispatch('queryItems')
      }

      return data
    } catch (error) {
      return {
        success: false,
        response: 'Undefined error in store.'
      }
    }
  }
}
