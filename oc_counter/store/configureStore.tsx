import { combineReducers } from 'redux'
//import mediaReducer from './reducers/mediaReducer'
import mediaReducer from './ducks/media'

//combines all the reducers if we would have more
const rootReducer = combineReducers({
  media: mediaReducer,
})

export default rootReducer
