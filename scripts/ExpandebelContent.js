import pixTorem from "./pixToRem.js"

const rootSelector = "[data-js-expandable-content]"
class ExpandebelContant {
    selectors = {
        root: rootSelector,
        button:"[data-js-expandable-content-button]",
    }

    stateClasses = {
        isActive: "is-expanded",
    }

    animationParams = {
        duration: 500,
        easing: 'ease',
    }

    constructor(rootElement){
        this.rootElement = rootElement
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.bindEvents()
    }

    expand() {
        const {offsetHeight, ScrollHeight} = this.rootElement

        this.rootElement.classList.add(this.stateClasses.isActive)
        this.rootElement.animate([
            {
                maxHeight: `${pixTorem(offsetHeight)}ren`,
            },
            {
                maxHeight: `${pixTorem(ScrollHeight)}rem`,
            },
            
        ], this.animationParams)
    }

    onPlayButtonClick = () => {
        this.expand() 
    }

    bindEvents(){
        this.buttonElement.addEventListener('click', this.onPlayButtonClick)
    }
}
class ExpandebelContantCollection {
    constructor() {
        this.init()
    }

    init(){
        document.querySelectorAll(rootSelector).forEach((element) =>{
            new ExpandebelContant(element)
        })
    }
}

export default ExpandebelContantCollection
