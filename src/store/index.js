import { createStore } from 'vuex'
import topTracksModule from './modules/top-tracks'
import topArtistsModule from './modules/top-artist'

const store = createStore({
  modules: {
    topTracks: topTracksModule,
    topArtists: topArtistsModule
  },
})

export default store
