import { IServicePointPool } from "../../models/IServicePointPool";
import * as moment from 'moment';
import * as ServicePointActions from '../actions'


export interface IServicePointPoolState {
    servicePointPool: IServicePointPool[];
    loading:boolean;
    loaded:boolean;
    error:Object
  }
  
  export const initialState: IServicePointPoolState = {
    servicePointPool: null,
    loading:null,
    loaded:null,
    error:null
  };

  export function reducer(
      state:IServicePointPoolState = initialState,
      action:ServicePointActions.AllServicePointPoolActions
  ):IServicePointPoolState{
    switch(action.type){
        case ServicePointActions.FETCH_SERVICE_POINT_POOL_INFO:{
            return{
                ...state,             
                loading:true,
                loaded:false,
                error:null
            }
        };
        case ServicePointActions.FETCH_SERVICE_POINT_POOL_INFO_SUCCESS:{
            return{
                ...state,
                servicePointPool:action.payload,             
                loading:false,
                loaded:false
            }
        }; 
        case ServicePointActions.FETCH_SERVICE_POINT_POOL_INFO_FAIL:{
            return{
                ...state,             
                loading:false,
                loaded:false,
                error:action.payload
            }
        }; 


  }
}