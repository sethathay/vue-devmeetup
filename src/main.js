import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import DateFilter from './filters/date'
import * as firebase from 'firebase'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-dialog', EditMeetupDialog)
Vue.component('app-edit-date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-time-dialog', EditMeetupTimeDialog)
Vue.component('app-register-dialog', RegisterDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created(){
    firebase.initializeApp({
      apiKey: 'AIzaSyCgTcaeGAmFZWxbxFUR6ncSbU8AOr5kBaQ',
      authDomain: 'devmeetup-dbcac.firebaseapp.com',
      databaseURL: 'https://devmeetup-dbcac.firebaseio.com',
      projectId: 'devmeetup-dbcac',
      storageBucket: 'gs://devmeetup-dbcac.appspot.com'
    })
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetup')
  }
})
