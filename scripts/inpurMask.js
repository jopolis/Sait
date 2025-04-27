const rootSelector = `[data-js-input-mask]`;

class inputMask {

    constructor(rootElement){
        this.rootElement = rootElement
        this.init()
    }

    init(){
         window.IMask(this.rootElement, {
            mask: this.rootElement.dataset.jsInputMask
         })
    }
}
class inputMaskCollection {
    constructor() {
        this.init()
    }

    init(){
        document.querySelectorAll(rootSelector).forEach((element) =>{
            new inputMask(element)
        })
    }
}

export default inputMaskCollection