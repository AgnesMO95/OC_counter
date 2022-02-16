import { ActionTypes } from "../types";


export interface mediaState{

}

const intitialState: mediaState ={};

export default function mediaReducer(state: mediaState = intitialState, action: ActionTypes/*{type, payload}*/): mediaState {
    switch(action.type){
        default:
            return state;
    }
}