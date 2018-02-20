import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

import meetup from './meetup'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        meetup: meetup,
        user: user,
        shared: shared
    }
})