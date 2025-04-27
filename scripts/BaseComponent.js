class BaseComponent{
    getproxyState(initialState) {
        return new Proxy( initialState, {
            get: (target, prop) => {
                return target[prop]
            },
            set: (target, prop, newValue ) => {
                const oldValue = target[prop]
                target[prop] = newValue
                if (oldValue !== newValue ){
                    this.updateUi()
                }
    
                    
                return true
            },
        })
    }
}

export default BaseComponent
