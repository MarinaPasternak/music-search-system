import axios from 'axios';

const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY

export default {
  state: {
    topTags: null,
    loading: false
  },
  mutations: {
    SET_TOP_TAGS(state, topTags) {
      state.topTags = topTags
    },
    SET_TOP_TAGS_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchTopTags({ commit }) {
      commit('SET_TOP_TAGS_LOADING', true)

      try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=${API_KEY}&limit=20&format=json`)
        const topTags = response.data.tags.tag;

        topTags.sort((a, b) => Number(b.reach) - Number(a.reach));

        commit('SET_TOP_TAGS', topTags)
        commit('SET_TOP_TAGS_LOADING', false)
      } catch (error) {
        console.error(error)
        commit('SET_TOP_TAGS_LOADING', false)
      }
    }
  }
}