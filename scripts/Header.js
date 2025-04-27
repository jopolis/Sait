class Header {

    selector = {
        root: '[data-js-header]' ,
        overlay:  '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
    }

    staeClasses = {
        isActive: 'is-active',
        isLoock: 'is-loock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selector.root)
        this.overlayElement =  document.querySelector(this.selector.overlay)
        this.burgerButtonElement =  document.querySelector(this.selector.burgerButton)
        this.bindEvents()
    }

    onBurgerButtonClick = () => {
        this.burgerButtonElement.classList.toggle(this.staeClasses.isActive)
        this.overlayElement.classList.toggle(this.staeClasses.isActive)
        document.documentElement.classList.toggle(this.staeClasses.isLoock)
    }

    bindEvents(){
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
    }
}

export default Header