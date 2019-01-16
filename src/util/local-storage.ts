import { Injectable } from '@angular/core';
import { UserSelectors, BranchSelectors, ServicePointSelectors, AccountSelectors } from '../store';
import { IAccount } from '../models/IAccount';
import { IBranch } from '../models/IBranch';
import { IServicePoint } from '../models/IServicePoint';
import { IService } from '../models/IService';
import { FLOW_TYPE } from './flow-state';

export enum STORAGE_KEY {
    SETTINGS = "SETTINGS",
    STORE = "STORE",
}

export enum STORAGE_SUB_KEY {
    MOST_FRQUENT_SERVICES = "frequent_services",
    MOST_FRQUENT_SERVICES_APPOINTMENT = "appointment_frquent_services",
    MOST_FRQUENT_SERVICES_CREATE_APPOINTMENT = "create_appointment_frquent_services",
    MULTI_SERVICE_ENABLE_CV = "multi_service_CV",
    MULTI_SERVICE_ENABLE_CA = "multi_service_CA",
    MULTI_SERVICE_ENABLE_AA = "multi_service_AA",
    BRANCH_SKIP = "branch_skip",
    CUSTOMER_SKIP = "customer_skip",
    USER_ID = "user_id",
    REMEMBER_LOGIN = "remember_login",
    ACTIVE_WORKSTATION = "active_workstation",
    ACTIVE_BRANCH = "active_branch",
    SERVICES = "services"
}

export interface IUserService {
    user: number;
    services: IService[];
  }

@Injectable()
export class LocalStorage {

    private currentUser: IAccount;
    private currentBranch: IBranch;
    private currentServicePoint: IServicePoint;
    private isUseDefault: boolean;

    constructor(
        private userSelectors: UserSelectors,
        private branchSelectors: BranchSelectors,
        private servicePointSelectors: ServicePointSelectors,
        private accountSelectors: AccountSelectors
    ) {
        this.userSelectors.user$.subscribe(val => this.currentUser = val);
        this.branchSelectors.selectedBranch$.subscribe(val => this.currentBranch = val);
        this.servicePointSelectors.openServicePoint$.subscribe(val => this.currentServicePoint = val);
        this.accountSelectors.useDefaultStatus$.subscribe(val => this.isUseDefault = val);
    }

    private setValue(key: STORAGE_KEY, val: any){
        localStorage.setItem(key, JSON.stringify(val))
    }

    private getValue(key: STORAGE_KEY){
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    removeItem(key: STORAGE_KEY){
        localStorage.removeItem(key);
    }

    clearValues(){
        localStorage.clear();
    }

    setSettings(key: STORAGE_SUB_KEY, value: any){
        var store = this.getSettings();
        store[key] = value;
        this.setValue(STORAGE_KEY.SETTINGS, store);
    }

    setInitialSettings(){
        this.checkCurrentUser();
        var store = this.getSettings();
        store[STORAGE_SUB_KEY.USER_ID] = this.currentUser.id;
        store[STORAGE_SUB_KEY.ACTIVE_BRANCH] = this.currentBranch.id;
        store[STORAGE_SUB_KEY.ACTIVE_WORKSTATION] = this.currentServicePoint.id;      
        this.setValue(STORAGE_KEY.SETTINGS, store);
    }

    setInitialStoreValues() {
        this.setUserStoreObjectValue(STORAGE_SUB_KEY.REMEMBER_LOGIN, STORAGE_SUB_KEY.REMEMBER_LOGIN, this.isUseDefault);
    }

    getSettingForKey(key: STORAGE_SUB_KEY){
        var store = this.getSettings();
        return store[key];
    }

    getSettings(){
        return this.getValue(STORAGE_KEY.SETTINGS);
    }

    checkCurrentUser(){
        var store = this.getSettings();
        var storedUser = store[STORAGE_SUB_KEY.USER_ID];
        if(storedUser && (storedUser !== this.currentUser.id)){
            this.removeItem(STORAGE_KEY.SETTINGS);
        }
    }

    setStoreValue(key: STORAGE_SUB_KEY, value: any){
        var store = this.getStore();
        var userArray = [];
        if(store[key] === undefined){
            store[key] = userArray;
        }
        else{
            userArray = store[key].filter(val => {
                return val.user !== this.currentUser.id;
            });
        }
        const userObj = { user: this.currentUser.id, services: value }
        userArray.push(userObj);
        store[key] = userArray;
        this.setValue(STORAGE_KEY.STORE, store);
    }

    setUserStoreObjectValue(key: STORAGE_SUB_KEY, objectProperty: any,  value: any){
        var store = this.getStore();
        var userArray = [];
        if(store[key] === undefined){
            store[key] = userArray;
        }
        else{
            userArray = store[key].filter(val => {
                return val.user !== this.currentUser.id;
            });
        }
        let userObj: any = { user: this.currentUser.id };
        userObj[objectProperty] = value;

        userArray.push(userObj);
        store[key] = userArray;
        this.setValue(STORAGE_KEY.STORE, store);
    }

    getUserStoreObjectValue( userId: number, key: STORAGE_SUB_KEY, objectProperty: any, defaultValue = null){
        let store = this.getStore();
        console.log(store);
        
        let storeSub = store[key];
        if(storeSub){
                       
            let userStore = storeSub.filter(val => {
                return val.user === userId;
            }); 

            console.log('userStore');
            console.log(userStore);

            if(userStore && userStore.length > 0) {
                return userStore[0][objectProperty];
            }
            else {
                return defaultValue;
            }           
        }
    }

    getStore(){
        return this.getValue(STORAGE_KEY.STORE);
    }

    getStoreForKey(key: STORAGE_SUB_KEY){
        var store = this.getStore();
        var storeSub = store[key];
        if(storeSub){
            var userStore = storeSub.filter(val => {
                return val.user === this.currentUser.id;
            });
            if(userStore.length > 0){
                return userStore[0].services;
            }
            else {
                return [];
            }
        }
    }

    getStorageKey(flowType: FLOW_TYPE){
        var storageKey = STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES;
    
        switch(flowType) {
          case FLOW_TYPE.CREATE_VISIT:
              storageKey = STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES;
              break;
          case FLOW_TYPE.ARRIVE_APPOINTMENT:
              storageKey = STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES_APPOINTMENT;
              break;
          case FLOW_TYPE.CREATE_APPOINTMENT:
              storageKey = STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES_CREATE_APPOINTMENT;
              break;
          default:
              storageKey = STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES;
        }
        return storageKey;
      }
}