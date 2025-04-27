const rootSelector = "[data-js-tabs]"

class Tabs {
    selector = {
        root: rootSelector,
        button: "[data-js-tabs-button]",
        content: "[data-js-tabs-content]",
    }

    stateClasses = {
        isActive: "is-active",
    }

    stateAttributes = {
        ariaSelected: "aria-selected",
        tabIndex: "tabindex"
    }

    constructor(rootElement){/*ищет в Dom дереве rootSelectorБ после чего достает оттуда кнопки и контент */
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selector.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selector.content)
        this.state = { /*Перевод дом дерева в массив и поиск в енм нужного индекса с классом isActive, в конце выдает булевое выражение(true false)*/
            activeTabIndex: [...this.buttonElements]
            .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive))
        }

        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
    }

    updateUi() {
        const {activeTabIndex} = this.state

        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex

            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
        })

        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)

        })
    }

    activateTabe(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }

    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1
        this.activateTabe(newTabIndex)
    }
    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1
        this.activateTabe(newTabIndex)
    }
    firstTab = () => {
        this.activateTabe(0)
    }
    lastTab = () => {
        this.activateTabe(this.limitTabsIndex)
    }

    onButtonClick(buttonIndex){
        this.state.activeTabIndex = buttonIndex
        this.updateUi()
    }

    bindEvents() {
        this.buttonElements.forEach((buttonElement , index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })
        this.rootElement.addEventListener('keydown', this.onKeyDowner)
    }

    onKeyDowner = (event) => {
        const {code, metaKey} = event
        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        } [code]

        const isMacHomeKey = metaKey && code === 'ArrowLeft'
        if(isMacHomeKey) {
            this.firstTab()
            this.updateUi()
            return
        }

        const isMacEndKey = metaKey && code === 'ArrowRight'
        if( isMacEndKey) {
            this.lastTab()
            this.updateUi()
            return
        }

        action?.()
        this.updateUi()
    }
}

class TabsCollection {

    constructor() {
        this.init()
    }

    init(){
        document.querySelectorAll(rootSelector).forEach((element) =>{
            new Tabs(element)
        })
    }
}

export default TabsCollection