import { createStore } from 'vuex'
import topTracksModule from './modules/top-tracks'

const store = createStore({
  modules: {
    topTracks: topTracksModule,
  },
})

export default store
