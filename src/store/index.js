import { createStore } from 'vuex'
import topTracksModule from './modules/top-tracks'
import topArtistsModule from './modules/top-artist'
import topTagsModule from './modules/top-tags'

const store = createStore({
  modules: {
    topTracks: topTracksModule,
    topArtists: topArtistsModule,
    topTags: topTagsModule
  },
})

export default store
