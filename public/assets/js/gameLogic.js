import * as THREE from '../../vendor/js/three.js/build/three.module.js'
import GameComponent from './gameComponent.js'
import { getResource } from './loadedResources.js'
import Overlay from './overlay.js'
import Music from './music.js'
import Controls from './controls.js'
import Level1 from './level1.js'
import Level2 from './level2.js'
import CoinBurst from './coinBurst.js'

/* The root component of the component tree. Repsonsible for:
 *  - Initialising child components common to all levels
 *  - Starting and switching between levels
 *  - Passing data to be visualised in the HUD
 *  - Checking for hits
 */

const ATTACK_MAX_DISTANCE = 3
const ATTACK_AUTOHIT_DISTANCE = 0.75
const ATTACK_MAX_ANGLE = THREE.MathUtils.degToRad(30)

const WEALTH_REDUCTION_PER_HIT = 15e9 + Math.round(1e8 * Math.random())

class GameLogic extends GameComponent {
  tags = ['GameLogic']

  // List of levels. Mutated when a level is completed so that levels[0] is the current level.
  levels = [Level1, Level2]

  start() {
    this.initializeChild(Overlay)
    this.musicController = this.initializeChild(Music)
    this.controls = this.initializeChild(Controls)
    this.startLevel()
  }

  update() {
    // Pass data to the HUD
    this.hud.data.countdownLabel = this.enemy.countdownLabel
    this.hud.data.remainingTime = this.timeLimitEnabled
      ? Math.max(0, Math.ceil(this.enemy.remainingTime)) + ' seconds'
      : '[No time limit]' 

    this.hud.data.enemyName = this.enemy.enemyName
    this.hud.data.startingWealth = this.enemy.startingWealth
    this.hud.data.currentWealth = this.enemyWealth

    // Game-over logic
    if (this.enemy.active && this.enemy.remainingTime <= 0 && this.timeLimitEnabled) {
      this.enemy.active = false
      setTimeout(() => this.gameOver(), 1000)
    }
  }

  get timeLimitEnabled() {
    return this._timeLimitEnabled ??= document.querySelector('#time-limit-check').checked
  }

  startLevel() {
    this.currentLevel?.destroy()
    this.currentLevel = this.initializeChild(this.levels[0])
    this.controls.reset()
    this.enemy = this.find('Enemy')
    this.enemyWealth = this.enemy.startingWealth
  }

  // Alias for startLevel
  restartLevel() {
    this.startLevel()
  }

  // Check whether an attack hits
  handleAttack() {
    // Get the direction the player is looking in
    const lookDirection = new THREE.Vector3()
    this.camera.getWorldDirection(lookDirection)
    lookDirection.y = 0

    // Get the vector from the player to the enemy
    const toEnemy = this.enemy.position.clone().sub(this.find('PlayerCharacter').position)
    toEnemy.y = 0

    const distance = toEnemy.length()
    const angle = toEnemy.angleTo(lookDirection)

    // If the distance and angle are within set thresholds, register a hit
    if (distance <= ATTACK_MAX_DISTANCE && (angle <= ATTACK_MAX_ANGLE || distance <= ATTACK_AUTOHIT_DISTANCE))
      this.handleHit()
  }

  handleHit() {
    if (this.enemy.active) {
      // Reduce enemy wealth
      this.enemyWealth = Math.max(0, this.enemyWealth - WEALTH_REDUCTION_PER_HIT)

      // Burst of coins
      this.initializeChild(CoinBurst, { position: this.enemy.headPosition() })

      // Play sound
      const sound = new THREE.Audio(this.audioListener)
      sound.setBuffer(getResource('scream.wav'))
      sound.setVolume(0.25)
      sound.play()

      // Check for level win
      if (this.enemyWealth == 0) {
        this.enemy.active = false
        setTimeout(() => this.levelCompleted(), 1000)
      }
    }
  }

  gameOver() {
    const controls = this.find('Controls')
    controls.unlock()

    this.find('Menus').setMenu('game-over', () => {
      this.restartLevel()
      controls.lock()
    })
  }

  // When a level is completed
  levelCompleted() {
    // Prepare for menu
    const controls = this.find('Controls')
    controls.unlock()

    // Remove the finished level from the list of levels
    this.levels.shift()

    if (this.levels.length > 0) {
      // Start the next level
      this.startLevel()

      this.find('Menus').setMenu('level-2', () => {
        controls.lock()
      })
    } else {
      // End of game
      this.musicController.playSong(getResource('ending-theme.mp3'))

      this.find('Menus').setMenu('game-completed', () => {
        window.open('https://choose.love/', '_blank')
      })
    }
  }

  get hud() {
    return (this._hud ??= this.find('HUD'))
  }
}

export default GameLogic
