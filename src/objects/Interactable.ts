﻿import Sprite = Phaser.Physics.Arcade.Sprite
import Phaser from 'phaser'
import { Key } from '../constants'
import PlayScene from '../scenes/PlayScene'


class Interactable extends Sprite
{
    protected playScene: PlayScene

    constructor(playScene: PlayScene, x: number, y: number, spriteKey: Key.Sprite, isStatic = false) {
        super(playScene, x, y, spriteKey)
        this.playScene = playScene
        this.playScene.physics.add.existing(this, isStatic)
        this.playScene.add.existing(this)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(spriteKey)
            this.setDisplaySize(18, 18)
        })
    }
}

export default Interactable