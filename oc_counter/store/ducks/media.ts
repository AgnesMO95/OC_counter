//imports
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../store'

//types
interface addFileToList {
  type: typeof ADD_FILE_TO_LIST
  payload: File
}

type mediaTypes = addFileToList

type ActionTypes = mediaTypes

//constants
const ADD_FILE_TO_LIST = 'oc_counter/media/ADD_FILE_TO_LIST'

//reducer

interface mediaState {
  //fileList: Array[]
  //its an array of files
  fileList: File[]
}

const intitialState: mediaState = {
  fileList: [],
}

export default function mediaReducer(
  state: mediaState = intitialState,
  action: ActionTypes //{type, payload}
): mediaState {
  switch (action.type) {
    case ADD_FILE_TO_LIST:
      console.log(action.payload)
      return {
        ...state,
        fileList: state.fileList.concat(action.payload), //state.fileList.filter(file => file !== action.payload),
      }
    default:
      return state
  }
}

//actions
export function addFileToList(file: File): ActionTypes {
  return { type: ADD_FILE_TO_LIST, payload: file }
}
