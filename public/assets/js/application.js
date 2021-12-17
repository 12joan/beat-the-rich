const canvas = document.querySelector('#game-canvas')
const ctx = canvas.getContext('2d')

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

ctx.fillStyle = '#000000'
ctx.beginPath()
ctx.arc(400, 500, 50, 0, 2 * Math.PI)
ctx.fill()
