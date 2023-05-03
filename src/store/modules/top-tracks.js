import axios from 'axios';

const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY

export default {
  state: {
    topTracks: null,
    loading: false
  },
  mutations: {
    SET_TOP_TRACKS(state, topTracks) {
      state.topTracks = topTracks
    },
    SET_TOP_TRACKS_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchTopTracks({ commit }) {
      commit('SET_TOP_TRACKS_LOADING', true)

      try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json`)
        const topTracks = response.data.tracks.track;

        topTracks.sort((a, b) => Number(b.playcount) - Number(a.playcount));

        commit('SET_TOP_TRACKS', topTracks)
        commit('SET_TOP_TRACKS_LOADING', false)
      } catch (error) {
        console.error(error)
        commit('SET_TOP_TRACKS_LOADING', false)
      }
    }
  }
}
