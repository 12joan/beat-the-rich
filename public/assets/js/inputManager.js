// Keeps track of which keys and mouse buttons are currently down

const keyState = {}
const buttonState = {}

// Update state with each event
window.addEventListener('keydown', event => {
  keyState[event.key] = true
})

window.addEventListener('keyup', event => {
  keyState[event.key] = false
})

window.addEventListener('mousedown', event => {
  buttonState[event.button] = true
})

window.addEventListener('mouseup', event => {
  buttonState[event.button] = false
})

const MOUSE_BUTTONS = {
  LEFT: 0,
  RIGHT: 2,
}

// Getter functions
const getKey = key => Boolean(keyState[key])
const getMouseButton = button => Boolean(buttonState[button])

export default { MOUSE_BUTTONS, getKey, getMouseButton }
