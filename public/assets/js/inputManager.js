const inputState = {}

window.addEventListener('keydown', event => {
  inputState[event.key] = true
})

window.addEventListener('keyup', event => {
  inputState[event.key] = false
})

const getKey = key => Boolean(inputState[key])

export default { getKey }
