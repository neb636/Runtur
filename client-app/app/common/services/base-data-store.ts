
import * as _ from 'lodash';



export class BaseDataStore {

    _settings: any;
    _subscribers: any;
    _privateStore: any;

    constructor(storeSettingsOverride = {}) {

        this._settings = {};
        this._subscribers = {};
        this._privateStore = {};

        if (this._settings.resetOnLogout) {
            this._resetOnLogout.call(this);
        }
    }


    createSchema(data) {
        Object.assign(this._privateStore, data);
    }

    getStore() {
        return this._settings.clone ? _.cloneDeep(this._privateStore) : this._privateStore;
    }

    getStoreKey(key) {
        let isValidKey = _.has(this._privateStore, key);

        if (!isValidKey) {
            throw new Error(`Store schema does not have key ${key}`);
        }

        return this._settings.clone ? _.cloneDeep(this._privateStore[key]) : this._privateStore[key];
    }

    updateKeys(keysToUpdate) {

        _.forEach(keysToUpdate, (value, key) => {
            let isValidKey = _.has(this._privateStore, key);

            if (!isValidKey) {
                throw new Error(`Store schema does not have key ${key}`);
            }

            this._privateStore[key] = value;
        });

        this._notifyChange();
    }

    subscribe(subscriberCallback) {
        const SUBSCRIBER_ID = _.uniqueId();

        this._registerSubscriber(subscriberCallback, SUBSCRIBER_ID);
    }

    applyHook(methodName, runPosition, onHookCallback) {
        let originalMethod = this[methodName];
        var slice = [].slice;

        function wrappedFunction() {
            let args = slice.call(arguments);

            if (runPosition === "before") {
                onHookCallback.call(this, methodName, args);
                return originalMethod.apply(this, arguments);
            }
            else if (runPosition === "after") {
                originalMethod.apply(this, arguments);
                return onHookCallback.call(this, methodName, args);
            }
        }

        this[methodName] = wrappedFunction;
    }

    _registerSubscriber(subscriberCallback, SUBSCRIBER_ID) {

        // Let subscriber know current data
        subscriberCallback(this._privateStore);

        // Add subscriber to subscribers array
        this._subscribers[SUBSCRIBER_ID] = subscriberCallback;

        // Send warning if too many subscribers
        if (Object.keys(this._subscribers).length > this._settings.maxSubscribers) {
            throw new Error(`Possible memory leak. Max subscribers reached in store`);
        }
    }

    _removeSubscriber(subscriberId) {
        delete this._subscribers[subscriberId];
    }

    _notifyChange() {

        _.forEach(this._subscribers, subscriberCallback => {
            let data = this.getStore();
            subscriberCallback(data);
        });
    }

    _resetOnLogout() { }
}