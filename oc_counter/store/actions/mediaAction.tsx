import { RootStateOrAny } from 'react-redux'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../store'
import { ActionTypes, addFileToList, ADD_FILE_TO_LIST } from '../types'

type MyType = ThunkAction<void, AppState, unknown, ActionTypes>

export const uploadAction /**: ActionTypes */ =
  (mediaFiles: any): MyType /** type of what to return :addFileToList*/ =>
  async (dispatch, getState) => {
    //type: ADD_FILE_TO_LIST

    const data = getState().media
    let files = [mediaFiles]

    if (files && files.length > 0) {
      //check if the file already are uploaded
      const existingFiles = data.fileList.map(f => f.name)
      files.filter(f => !existingFiles.includes(f.name))

      return dispatch({ type: ADD_FILE_TO_LIST, payload: files })
    }
  }

export const sendAction = () => async (dispatch: any, getState: any) => {
  const files = getState().media.fileList

  var from = new FormData()

  console.log(files)
}
