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
  createTom() {
    const TomYLocation = Math.floor(Math.random() * 1080) + 1; // this will get a number between 1 and 1080
    let TomXVelocity = Math.floor(1 * 920); // this will get a number between 1 and 50
    TomXVelocity *= Math.round(Math.random()) ? -1 : -1; // this will add minus sign in 50% of cases
    const aTom = this.physics.add.sprite(1920, TomYLocation, "Tom");
    aTom.body.velocity.y = 30;
    aTom.body.velocity.x = TomXVelocity;
    this.TomGroup.add(aTom);
  }

  /**
   * This method is the constructor
   */
  constructor() {
    super({ key: "gameScene" });

    this.background = null;
    this.background2 = null;
    this.Jerry = null;
    this.Rope = false;
    this.score = 0;
    this.scoreText = null;

    this.scoreTextStyle = {
      font: "65px Ariel",
      fill: "#ffffff",
      align: "center",
    };
    this.gameOverTextStyle = {
      font: "65px Ariel",
      fill: "#ff0000",
      align: "center",
    };
  }

  /**
   * Can be defined on your own Scenes.
   * this method is called by the Scene Manager when the scene starts,
   * before preload() and create().
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  init(data) {
    this.cameras.main.setBackgroundColor("#ffffff");
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to load assets.
   */
  preload() {
    console.log("Game Scene");
    //images
    this.load.image("startbackground", "./assets/menu-background.png");
    this.load.image("Jerry", "./assets/Jerrytest.png");
    this.load.image("mousetrap", "./assets/Mousetrap.png");
    this.load.image("Tom", "./assets/Tom.png");
    // sound
    this.load.audio("Scream", "./assets/Scream.mp3");
    this.load.audio("Throw", "./assets/Throw.mp3");
  }

  /**
   * Can be defined on your own Scenes.
   * Use it to create your game objects.
   * @param {object} data - Any data via ScenePlugin.add() or ScenePlugin.start().
   */
  create(data) {
    this.background = this.add.image(0, 0, "startbackground").setScale(2.0);
    this.background.setOrigin(0, 0);
    this.background2 = this.add
      .image(1900 * 2, 0, "startbackground")
      .setScale(2.0);
    this.background2.setOrigin(0, 0);

    this.scoreText = this.add.text(
      100,
      100,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    );

    this.Jerry = this.physics.add.sprite(1920 / 6, 1080 - 200, "Jerry");

    // create a group for the Rope
    this.RopeGroup = this.physics.add.group();

    // create a group for the Tom
    this.TomGroup = this.add.group();
    this.createTom();

    //Collisions between Rope and Tom
    this.physics.add.collider(
      this.RopeGroup,
      this.TomGroup,
      function (RopeCollide, TomCollide) {
        TomCollide.destroy();
        RopeCollide.destroy();
        this.score = this.score + 1;
        this.scoreText.setText("Score: " + this.score.toString());
        this.createTom();
        this.createTom();
      }.bind(this)
    );

    // Collisions between Jerry and Tom
    this.physics.add.collider(
      this.Jerry,
      this.TomGroup,
      function (JerryCollide, TomCollide) {
        this.sound.play("Scream");
        this.physics.pause();
        TomCollide.destroy();
        JerryCollide.destroy();
        this.gameOverText = this.add
          .text(
            1920 / 2,
            1080 / 2,
            "Ha you lost, loser!\nClick to try again.",
            this.gameOverTextStyle
          )
          .setOrigin(0.5);
        this.gameOverText.setInteractive({ userHandCursor: true });
        this.gameOverText.on("pointerdown", () =>
          this.scene.start("gameScene")
        );
      }.bind(this)
    );
  }

  /**
   * Should be overridden by your own Scenes.
   * This method is called once per game step while the scene is running.
   * @param {number} time - the current time.
   * @param {number} delta - The delta time in ms since the last frame.
   */
  update(time, delta) {
    // called 60 times a second, hopefully!

    const keyUpObj = this.input.keyboard.addKey("UP");
    const keyDownObj = this.input.keyboard.addKey("DOWN");
    const keySpaceObj = this.input.keyboard.addKey("SPACE");

    // move background each tick
    if (this.background.x >= -1900 * 2) {
      this.background.x = this.background.x - 2;
    } else {
      console.log("move background1");
      this.background.x = 1900 * 2;
    }
    if (this.background2.x >= -1900 * 2) {
      this.background2.x = this.background2.x - 2;
    } else {
      console.log("move background2");
      this.background2.x = 1900 * 2;
    }

    if (keyUpObj.isDown === true) {
      this.Jerry.y -= 15;
      if (this.Jerry.y < 0) {
        this.Jerry.y = 0;
      }
    }

    // Moves the character down
    if (keyDownObj.isDown === true) {
      this.Jerry.y += 15;
      if (this.Jerry.y > 1080) {
        this.Jerry.y = 1080;
      }
    }

    if (keySpaceObj.isDown === true) {
      if (this.fireExplosion === false) {
        // fire Rope
        this.fireExplosion = true;
        const aNewRope = this.physics.add.sprite(
          this.Jerry.x,
          this.Jerry.y,
          "mousetrap"
        );
        this.RopeGroup.add(aNewRope);
        this.sound.play("Throw");
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireExplosion = false;
    }

    this.RopeGroup.children.each(function (item) {
      item.x = item.x + 15;
      if (item.x < 0) {
        item.destroy();
      }
    });
  }
}
export default GameScene;
