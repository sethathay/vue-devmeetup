import * as firebase from 'firebase'

export default{
    state: {
        loadedMeetups: [
            { imageUrl: 'http://static.asiawebdirect.com/m/bangkok/portals/cambodia/homepage/phnom-penh/pagePropertiesImage/phnom-penh.jpg.jpg', 
                id: '12345', 
                date: new Date(),
                title: 'Meetup in Phnom Penh',
                location: 'Phnom Penh',
                description: 'Description of Meetup'
            },
            { imageUrl: 'https://cambodiatourism.co/wp-content/uploads/2017/03/takeo-3.jpg', 
                id: 'aaaaa',
                date: new Date(), 
                title: 'Meetup in Takeo',
                location: 'Siem Reap',
                description: 'Description of Meetup'
            },
            { imageUrl: 'https://lonelyplanetimages.imgix.net/a/g/hi/t/ece4a0143363eb7f739b25032638804f-siem-reap.jpg?sharp=10&vib=20&w=1200', 
                id: 'bbbbb',
                date: new Date(), 
                title: 'Meetup in Siem Reap',
                location: 'Siem Reap',
                description: 'Description of Meetup'
            }
        ]
    },
    mutations: {
        setLoadedMeetups (state, payload) {
            state.loadedMeetups = payload 
        },
        updateMeetup (state, payload) {
            const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
            })
            if(payload.title){
                meetup.title = payload.title
            }
            if(payload.description){
                meetup.description = payload.description
            }
            if(payload.date){
                meetup.date = payload.date
            }
        },
        createMeetup(state, payload){
            state.loadedMeetups.push(payload)
        }
    },
    actions: {
        loadMeetup ({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')
            .then((data) => {
                const meetups = []
                const obj = data.val()
                for (let key in obj) {
                    meetups.push({
                        id: key,
                        title: obj[key].title,
                        description: obj[key].description,
                        imageUrl: obj[key].imageUrl,
                        date: obj[key].date,
                        location: obj[key].location,
                        creatorId: obj[key].creatorId
                    })
                }
                commit('setLoadedMeetups', meetups)
                commit('setLoading', false)
            })
            .catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        createMeetup({commit, getters}, payload){
            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: getters.user.id
            }
            let imageUrl
            let key
            //Reach out to firebase and store it
            firebase.database().ref('meetups').push(meetup)
            .then((data) => {
                key = data.key
                return key
            })
            .then (key => {
                const fileName = payload.image.name
                const ext = fileName.slice(fileName.lastIndexOf('.'))
                return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
            })
            .then (fileData => {
                imageUrl = fileData.metadata.downloadURLs[0]
                return firebase.database().ref('meetups').child(key).update({
                    imageUrl: imageUrl
                })
            })
            .then (() => {
                commit('createMeetup', { 
                    ...meetup,
                    imageUrl: imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
        },
        updateMeetupData ({commit}, payload) {
            commit('setLoading', true)
            const updateObj = {}
            if (payload.title) {
                updateObj.title = payload.title
            }
            if (payload.description) {
                updateObj.description = payload.description
            }
            if (payload.date) {
                updateObj.date = payload.date
            }
            firebase.database().ref('meetups').child(payload.id).update(
                updateObj
            ).then(() => {
                commit('setLoading', false)
                commit('updateMeetup', payload)
            })
            .catch((error) => {
                console.log(error)
                commit('setLoading', false)
            })
        }
    },
    getters: {
        loadedMeetups(state){
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featureMeetups(state, getters){
            return getters.loadedMeetups.slice(0,5)
        },
        loadedMeetup(state){
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        }
    }
}