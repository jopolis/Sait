import pixTorem from "./pixToRem.js";
const MatchMedia  = {
    mobile: window.matchMedia(`(width <= ${pixTorem(767.98)}rem)`),
}

export default MatchMedia 