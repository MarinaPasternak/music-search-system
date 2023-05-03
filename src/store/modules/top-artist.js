import axios from 'axios';

const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY

export default {
  state: {
    topArtists: null,
    loading: false
  },
  mutations: {
    SET_TOP_ARTIST(state, topArtists) {
      state.topArtists = topArtists
    },
    SET_TOP_ARTIST_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchTopArtists({ commit }) {
      commit('SET_TOP_ARTIST_LOADING', true)
      try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json`)
        const topArtists = response.data.artists.artist;

        topArtists.sort((a, b) => Number(b.playcount) - Number(a.playcount));

        commit('SET_TOP_ARTIST', topArtists.slice(0, 10))
        commit('SET_TOP_ARTIST_LOADING', false)
      } catch (error) {
        console.error(error)
        commit('SET_TOP_ARTIST_LOADING', false)
      }
    }
  }
}
