import BaseComponent from "./BaseComponent.js";
import MatchMedia from "./MatchMedia.js";

const rootSelector = "[data-js-select]"

 
class select extends BaseComponent {
    selectors = {
        root: rootSelector,
        originalControl: "[data-js-select-original-control]",
        button: "[data-js-select-button]",
        dropdown: "[data-js-select-dropdown]",
        option: "[data-js-select-option]",
    }

    stateClasses = {
        isExpanded: "is-expanded",
        isSelected: "is-selected",
        isCurrent: "is-current",
        isOnTheLeftSide: "is-on-the-left-side",
        isOnTheRightSide: "is-on-the-right-side",
    }

    stateAttributes = {
        ariaEpanded: "aria-expanded",
        ariaESelected: "aria-selected",
        ariaActiveDescendant: "aria-activedescendant",
    }

    initialState = {
        isExpanded: false,
        currentOptionIndex:null,
        selectedOptionElement: null,
    }

    constructor(rootElement){
        super()
        this.rootElement = rootElement
        this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl)
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown)
        this.optionElement = this.dropdownElement.querySelectorAll(this.selectors.option)
        this.state = this.getproxyState({
            ...this.initialState,
            currentOptionIndex: this.originalControlElement.selectedIndex,
            selectedOptionElement: this.optionElement[this.originalControlElement.selectedIndex],

        })
        this.fixDropdownPosition()
        this.updateTabeIndexes()
        this.bindEvents()
    }

    updateUi(){
        const {
            isExpanded,
            currentOptionIndex,
            selectedOptionElement}            
            = this.state

            const newSelectedOptionValue = selectedOptionElement.textContent.trim()

            const updateOriginalControl = () => {
                this.originalControlElement.value = newSelectedOptionValue
            }

            const updateButton = () => {
                this.buttonElement.textContent =  newSelectedOptionValue
                this.buttonElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
                this.buttonElement.setAttribute(this.stateAttributes.ariaEpanded, isExpanded)
                this.buttonElement.setAttribute(
                    this.stateAttributes.ariaActiveDescendant,
                    this.optionElement[currentOptionIndex].id
                    )
            }

            const updateDropdown = () => {
                this.dropdownElement.classList.toggle(this.stateClasses.isExpanded, isExpanded)
            }

            const updateOptions = () => {
                this.optionElement.forEach((optionElement, index) => {
                 const isCurrent = currentOptionIndex === index
                 const isSelected = selectedOptionElement === optionElement    

                 optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent)
                 optionElement.classList.toggle(this.stateClasses.isSelected, isSelected)
                 optionElement.setAttribute(this.stateAttributes.ariaESelected, isSelected)
              })
            }

            updateOriginalControl()
            updateButton()
            updateDropdown()
            updateOptions()
    }

    fixDropdownPosition(){
        const viewportWidth = document.documentElement.clientWidth
        const halfViewportX = viewportWidth / 2
        const {width , x} = this.buttonElement.getBoundingClientRect()
        const buttonCenterX = x + width / 2
        const isButtonOnTheLeftViewportSide = buttonCenterX < halfViewportX

        this.dropdownElement.classList.toggle(
            this.stateClasses.isOnTheLeftSide,
            isButtonOnTheLeftViewportSide
        )

        this.dropdownElement.classList.toggle(
            this.stateClasses.isOnTheRightSide,
            !isButtonOnTheLeftViewportSide
        )
    }

    toggleExpandedState()  {
        this.state.isExpanded = !this.state.isExpanded
    }

    expand () {
        this.state.isExpanded = true
    }
    collapse () {
        this.state.isExpanded = false
    }

    updateTabeIndexes(isMobileDevais = MatchMedia.mobile.matches){
               
        this.originalControlElement.tabIndex = isMobileDevais ? 0 : -1
        this.buttonElement.tabIndex = isMobileDevais ? -1 : 0
    }

    onClick= (event) => {
        const {target} = event
        const isOutsideDropdownClick = target.closest(this.selectors.dropdown) !== this.dropdownElement
        const isButtonClick = target === this.buttonElement

        if (!isButtonClick && isOutsideDropdownClick) {
            this.collapse()
            return
        }

        const isOptionClick = target.matches(this.selectors.option)

        if (isOptionClick) {
            this.state.selectedOptionElement = target
            this.state.currentOptionIndex = [...this.optionElement].findIndex((optionElement) => optionElement === target)
            this.collapse()
        }
    }

    originalControlChange = () => {
        this.state.selectedOptionElement = this.optionElement[this.originalControlElement.selectedIndex]
    }

    selectCurrentOption() {
        this.state.selectedOptionElement = this.optionElement[this.state.currentOptionIndex]
    }

    onButtonClick = () => {
        this.toggleExpandedState()
    }

    onMobileMatchMediaChange = (event) => {
        this.updateTabeIndexes(event.matches)
    }

    get isNeedToExpand() {
        const inButtonFocused = document.activeElement === this.buttonElement

        return  (!this.state.isExpanded && inButtonFocused)
    }

    ArrowUpKeyDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        if(this.state.currentOptionIndex > 0) {
            this.state.currentOptionIndex--
        }
    }
    onArrowDownKeyDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        if(this.state.currentOptionIndex < this.optionElement.length - 1) {
            this.state.currentOptionIndex++
        }
    }
    onSpaceKeuDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }

        this.selectCurrentOption()
        this.collapse()
    }
    onEnterKeuDown = () => {
        if (this.isNeedToExpand) {
            this.expand()
            return
        }
        this.selectCurrentOption()
        this.collapse()
    }

    onKeyDown = (event) => {
        const {code} = event

        const action = {
            ArrowUp: this.ArrowUpKeyDown,
            ArrowDown: this.onArrowDownKeyDown,
            Space: this.onSpaceKeuDown,
            Enter: this.onEnterKeuDown
        }[code]

        if(action) {
            event.preventDefault()
            action()
        }
    }

    bindEvents() {
        MatchMedia.mobile.addEventListener("change", this.onMobileMatchMediaChange)
        this.buttonElement.addEventListener("click", this.onButtonClick)
        document.addEventListener('click', this.onClick)
        this.originalControlElement.addEventListener('change', this.originalControlChange)
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }
    
}

class selectCollection{
    constructor() {
        this.init()
    }

    init(){
        document.querySelectorAll(rootSelector).forEach((element) =>{
            new select(element)
        })
    }
}

export default selectCollection

