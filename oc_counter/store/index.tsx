import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

//STORE - globalized state, holds all the data and state for the application 
//ACTION - describes what you want to do 
//REDUCER - describes how your action transform your state into the next state, check which action you did, and based on the action the reducer are going to modifie the store
//DISPATCH - execute the action to the reducer. Say dispatch this action to the reducer, the reducer will check what to do and the store gets updated 

/* const store = createStore(reducer)
 */

//const initialState = {}  , initialState
const store = createStore(rootReducer, applyMiddleware())

export default store
