class Timer {
  currentTime = 0

  reset() {
    this.currentTime = 0
  }

  advanceClock(deltaTime) {
    this.currentTime += deltaTime
  }

  progressToTime(time, options = { from: 0 }) {
    return Math.max(0, Math.min(1, (this.currentTime - options.from) / time))
  }

  hasElapsed(time) {
    return this.currentTime >= time
  }

  afterTime(time, func) {
    if (this.hasElapsed(time))
      func()
  }
}

export default Timer
