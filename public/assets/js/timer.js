class Timer {
  currentTime = 0

  reset() {
    this.currentTime = 0
  }

  advanceClock(deltaTime) {
    this.currentTime += deltaTime
  }

  progressToTime(time) {
    return Math.max(0, Math.min(1, this.currentTime / time))
  }

  afterTime(time, func) {
    if (this.currentTime >= time)
      func()
  }
}

export default Timer
