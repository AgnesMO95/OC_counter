import { ADD_FILE_TO_LIST, ActionTypes } from '../types'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../store'

export interface mediaState {
  //fileList: Array[]
  //its an array of files
  fileList: File[]
}

const intitialState: mediaState = {
  fileList: [],
}

export default (
  state: mediaState = intitialState,
  action: ActionTypes, //{type, payload}
  { payload }: any
): mediaState => {
  switch (action.type) {
    case ADD_FILE_TO_LIST:
      //console.log(payload)
      return {
        ...state,
        fileList: state.fileList.filter(file => file.name !== payload),
      }
    default:
      return state
  }
}

/*
export default function mediaReducer(
  state: mediaState = intitialState,
  action: ActionTypes //{type, payload}
): mediaState {
  switch (action.type) {
    case ADD_FILE_TO_LIST:
      //console.log(payload)
      return {
        ...state,
        //fileList: state.fileList.filter(file => file.name !== payload),
      }
    default:
      return state
  }
}
*/
