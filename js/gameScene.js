/* global Phaser */

// Copyright (c) 2023 Parsa Tahavori All rights reserved
//
// Created by: Parsa Tahavori
// Created on: Jan 2023
// This file contains the JS functions for index.html

/**
 * This class is the Game Scene.
 */
class GameScene extends Phaser.Scene {
  /**
   * create an shigaraki
   */
  createShigaraki() {
    const shigarakiYLocation = Math.floor(Math.random() * 1080) + 1 // this will get a number between 1 and 1080
    let shigarakiXVelocity = Math.floor(1 * 920) // this will get a number between 1 and 50
    shigarakiXVelocity *= Math.round(Math.random()) ? -1 : -1 // this will add minus sign in 50% of cases
    const aShigaraki = this.physics.add.sprite(
      1920,
      shigarakiYLocation,
      "shigaraki"
    )
    aShigaraki.body.velocity.y = 30
    aShigaraki.body.velocity.x = shigarakiXVelocity
    this.shigarakiGroup.add(aShigaraki)
  }

  /**
   * This method is the constructor
   */
  constructor() {
    super({ key: "gameScene" })

    this.background = null
    this.background2 = null
    this.bakugou = null
    this.fireExplosion = false
    this.score = 0
    this.scoreText = null

    this.scoreTextStyle = {
      font: "65px Ariel",
      fill: "#ffffff",
      align: "center",
    }
    this.gameOverTextStyle = {
      font: "65px Ariel",
      fill: "#ff0000",
      align: "center",
    }
  }

  /**
   * Can be defined on your own Scenes.
   * this method is called by the Scene Manager when the scene starts,
   * before preload() and create().
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  init(data) {
    this.cameras.main.setBackgroundColor("#ffffff")
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to load assets.
   */
  preload() {
    console.log("Game Scene")
    //images
    this.load.image("startbackground", "assets/image (1).png")
    this.load.image("bakugou", "assets/bakugou.png")
    this.load.image("explosion", "assets/explosion.png")
    this.load.image("shigaraki", "assets/shig.png")
    // sound
    this.load.audio("die", "assets/dieaudio.mp3")
    this.load.audio("bomb", "assets/explosion.mp3")
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to create your game objects.
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  create(data) {
    this.background = this.add.image(0, 0, "startbackground").setScale(2.0)
    this.background.setOrigin(0, 0)
    this.background2 = this.add
      .image(1900 * 2, 0, "startbackground")
      .setScale(2.0)
    this.background2.setOrigin(0, 0)

    this.scoreText = this.add.text(
      100,
      100,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    )

    this.bakugou = this.physics.add.sprite(1920 / 6, 1080 - 200, "bakugou")

    // create a group for the explosions
    this.explosionGroup = this.physics.add.group()

    // create a group for the shigarakis
    this.shigarakiGroup = this.add.group()
    this.createShigaraki()

    //Collisions between explosions and shigarakis
    this.physics.add.collider(
      this.explosionGroup,
      this.shigarakiGroup,
      function (explosionCollide, shigarakiCollide) {
        shigarakiCollide.destroy()
        explosionCollide.destroy()
        this.score = this.score + 1
        this.scoreText.setText("Score: " + this.score.toString())
        this.createShigaraki()
        this.createShigaraki()
      }.bind(this)
    )

    // Collisions between bakugou and shigarakis
    this.physics.add.collider(
      this.bakugou,
      this.shigarakiGroup,
      function (bakugouCollide, shigarakiCollide) {
        this.sound.play("die")
        this.physics.pause()
        shigarakiCollide.destroy()
        bakugouCollide.destroy()
        this.gameOverText = this.add
          .text(
            1920 / 2,
            1080 / 2,
            "Ha you lost, loser!\nClick to try again.",
            this.gameOverTextStyle
          )
          .setOrigin(0.5)
        this.gameOverText.setInteractive({ userHandCursor: true })
        this.gameOverText.on("pointerdown", () => this.scene.start("gameScene"))
      }.bind(this)
    )
  }

  /**
   * Should be overridden by your own Scenes.
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time.
   * @param {number} delta - The delta time in ms since the last frame.
   */
  update(time, delta) {
    // called 60 times a second, hopefully!

    const keyUpObj = this.input.keyboard.addKey("UP")
    const keyDownObj = this.input.keyboard.addKey("DOWN")
    const keySpaceObj = this.input.keyboard.addKey("SPACE")

    // move background each tick
    if (this.background.x >= -1900 * 2) {
      this.background.x = this.background.x - 2
    } else {
      console.log("move background1")
      this.background.x = 1900 * 2
    }
    if (this.background2.x >= -1900 * 2) {
      this.background2.x = this.background2.x - 2
    } else {
      console.log("move background2")
      this.background2.x = 1900 * 2
    }

    if (keyUpObj.isDown === true) {
      this.bakugou.y -= 15
      if (this.bakugou.y < 0) {
        this.bakugou.y = 0
      }
    }

    // Moves the character down
    if (keyDownObj.isDown === true) {
      this.bakugou.y += 15
      if (this.bakugou.y > 1080) {
        this.bakugou.y = 1080
      }
    }

    if (keySpaceObj.isDown === true) {
      if (this.fireExplosion === false) {
        // fire explosion
        this.fireExplosion = true
        const aNewexplosion = this.physics.add.sprite(
          this.bakugou.x,
          this.bakugou.y,
          "explosion"
        )
        this.explosionGroup.add(aNewexplosion)
        this.sound.play("bomb")
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireExplosion = false
    }

    this.explosionGroup.children.each(function (item) {
      item.x = item.x + 15
      if (item.x < 0) {
        item.destroy()
      }
    })
  }
}
export default GameScene
