/* global Phaser */

// Copyright (c) 2023 Parsa Tahavori All rights reserved
//
// Created by: Parsa Tahavori
// Created on: Jan 2023
// This file contains the JS functions for index.html

/**
 * This class is the Menu Scene.
 */
class MenuScene extends Phaser.Scene {
  /**
   * This method is the constructor
   */
  constructor() {
    super({ key: "menuScene" })

    this.menuSceneBackgroundImage = null
    this.startButton = null
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
    console.log("Menu Scene")
   this.load.image("menuSceneBackground", "./assets/menu_background.png");
  this.load.image("startButtonImage", "./assets/start.png")
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to create your game objects.
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  create(data) {
    this.menuSceneBackgroundImage = this.add
      .sprite(0, 0, "menuSceneBackground")
      .setScale(2.75)
    this.menuSceneBackgroundImage.x = 1920 / 2
    this.menuSceneBackgroundImage.y = 1080 / 2

    this.startButton = this.add.sprite(
      1920 / 2,
      1080 / 2 + 100,
      "startButtonImage"
    )
    this.startButton.setInteractive({ userHandCursor: true })
    this.startButton.on("pointerdown", () => this.clickButton())
    //pass
  }

  /**
   * Should be overridden by your own Scenes.
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time.
   * @param {number} delta - The delta time in ms since the last frame.
   */
  update(time, delta) {}

  /**
   * pass
   */
  clickButton() {
    this.scene.start("gameScene")
  }
}

export default MenuScene
