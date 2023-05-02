import axios from 'axios';

const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY

export default {
  state: {
    topTracks: []
  },
  mutations: {
    SET_TOP_TRACKS(state, topTracks) {
      state.topTracks = topTracks
    }
  },
  actions: {
    async fetchTopTracks({ commit }) {
      try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json`)
        const topTracks = response.data.tracks.track;

        topTracks.sort((a, b) => b.playcount - a.playcount);

        commit('SET_TOP_TRACKS', topTracks)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
