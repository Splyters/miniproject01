import axios from 'axios'
import moment from 'moment'

const getDefaultState = () => ({
  id: null,
  username: null,
  email: null,
  workingTimes: [],
  clocks: []
})

/**
 * This is the current user (the "parent" component. Once the user is fetched, the other data will be assigned to this user)
 */
const user = {
  namespaced: true,
  state: () => (getDefaultState()),

  // Mutations change the state, so it can trigger a re-rendering on some components that are linked.
  mutations: {
    // This is so we can start on fresh grounds when changing user.
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    // USER-SPECIFIC
    updateUser(state, {id, username, email}) {
      state.id = id
      state.username = username
      state.email = email
    },
    // WORKING TIME-SPECIFIC
    addWorkingTime(state, workingTime) {
      state.workingTimes.push(workingTime)
    },
    addMultipleWorkingTimes(state, workingTimes) {
      workingTimes.forEach(wt => state.workingTimes.push(wt))
    },
    updateWorkingTime(state, workingTime) {
      state.workingTimes = state.workingTimes.map(wt => 
        wt.id === workingTime.id ? ({start: workingTime.start, end: workingTime.end, ...wt}) : wt)
    }
    // CLOCK-SPECIFIC

  },

  // Actions discuss with the back-end and trigger mutations
  actions: {
    // USER-SPECIFIC
    async fetchUser({commit}, {id}) {
      try {
        commit('resetState')
        const {data} = await axios.get(`http://localhost:4000/api/users/${id}`)
        commit('updateUser', data)
      } catch(e) {
        throw new Error(e)
      }
    },
    async updateUser({commit, state}, user) {
      try {
        const {data} = await axios.put(`http://localhost:4000/api/users/${state.id}`, {user})
        commit('updateUser', data)
      } catch(e) {
        throw new Error(e)
      }
    },
    // WORKING TIME SPECIFIC
    async fetchWorkingTimesStartEnd({ commit, state }, {start, end}) {
      try {
        const formatted_start = moment(start).format('YYYY-MM-DD%20hh:mm:ss')
        const formatted_end = moment(end).format('YYYY-MM-DD%20hh:mm:ss')
        const url = `http://localhost:4000/api/workingtimes/${state.id}?start=${formatted_start}&end=${formatted_end}`
        const {data} = await axios.get(url)
        commit('addMultipleWorkingTimes', data)
      } catch(e) {
        throw new Error(e)
      }
    },
    async fetchWorkingTime({commit, state}, {id}) {
      try {
        const {data} = await axios.get(`http://localhost:4000/api/workingtimes/${state.id}/${id}`)
        commit('addWorkingTime', data)
      } catch(e) {
        throw new Error(e)
      }
    },
    async createWorkingTime({commit, state}, {start, end}) {
      try{
        const formatted_start = moment(start).format('YYYY-MM-DD%20hh:mm:ss')
        const formatted_end = moment(end).format('YYYY-MM-DD%20hh:mm:ss')
        const {data} = await axios.post(`http://localhost:4000/api/workingtimes/${state.id}`, {working_time: {start: formatted_start, end: formatted_end}})
        commit('addWorkingTime', data)
      } catch(e) {
        throw new Error(e)
      }
    },
    async updateWorkingTime({commit}, workingTime) {
      try{
        let working_time = {}
        if (workingTime.start) working_time.start = moment(workingTime.start).format('YYYY-MM-DD%20hh:mm:ss')
        if (workingTime.end) working_time.end = moment(workingTime.end).format('YYYY-MM-DD%20hh:mm:ss')
        const {data} = await axios.put(`http://localhost:4000/api/workingtimes/${workingTime.id}`, {working_time})
        commit('updateWorkingTime', data)
      } catch(e) {
        throw new Error(e)
      }
    }
    
  },
  getters: {
    getUser(state) {
      return state
    }
  }
}

export default user