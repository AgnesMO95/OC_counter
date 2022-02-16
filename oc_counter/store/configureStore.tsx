import { combineReducers } from 'redux'
import mediaReducer from './reducers/mediaReducer'


//combines all the reducers if we would have more
const rootReducer = combineReducers({
  mediaReducer: mediaReducer,
})

export default rootReducer