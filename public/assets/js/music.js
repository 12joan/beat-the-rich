import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'

class Music extends GameComponent {
  tags = ['Music']

  start() {
    this.audio = new THREE.Audio(this.audioListener)
    this.audio.setLoop(true)
    this.audio.setVolume(0.50)
  }

  playSong(song) {
    if (this.audio.isPlaying)
      this.audio.stop()

    this.audio.setBuffer(song)
    this.audio.play()
  }
}

export default Music
