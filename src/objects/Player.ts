﻿import Sprite = Phaser.Physics.Arcade.Sprite
import Body = Phaser.Physics.Arcade.Body
import Vector2 = Phaser.Math.Vector2
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import Phaser from 'phaser'
import Portal from './Portal'

class Player extends Sprite
{
    private lastFrameVelocity: Vector2
    private playScene: PlayScene

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.SQUARE)
        playScene.physics.add.existing(this)
        playScene.add.existing(this)
        this.playScene = playScene

        this.setDisplaySize(16, 32)
        this.setTintFill(0xff0000)

        this.playScene.cursors.space.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            if ((this.body as Body).blocked.down) (this.body as Body).setVelocityY(-700)
        })
    }

    update(): void {
        this.handleMovement()
        this.handleGun()
        this.lastFrameVelocity = this.body?.velocity as Vector2
    }

    private handleMovement(): void {
        (this.body as Body).setVelocityX(0)

        if (this.playScene.aKey.isDown)
        {
            (this.body as Body).setVelocityX(-200)
        }
        else if (this.playScene.dKey.isDown)
        {
            (this.body as Body).setVelocityX(200)
        }
    }

    private handleGun(): void {
        const worldMousePosition = this.playScene.cameras.main.getWorldPoint(
            this.playScene.input.activePointer.x,
            this.playScene.input.activePointer.y,
        )

        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldMousePosition.x, worldMousePosition.y)

        this.playScene.ray.setOrigin(this.x, this.y)
        this.playScene.ray.setAngle(angle)
        const intersection = this.playScene.ray.cast() as Phaser.Geom.Point

        if (this.playScene.input.activePointer.leftButtonDown())
        {
            this.playScene.bluePortal.setPosition(intersection.x, intersection.y)
        }
        if (this.playScene.input.activePointer.rightButtonDown())
        {
            this.playScene.orangePortal.setPosition(intersection.x, intersection.y)
        }
    }

    public handleSpringCollision(): void {
        (this.body as Body).setVelocityY(-700)
    }

    public enterPortal(portal: Portal): void {
        if (!portal.isActive) return

        this.setPosition(portal.destinationPortal.x, portal.destinationPortal.y)
        this.setVelocity(this.lastFrameVelocity.x, this.lastFrameVelocity.y)
        
        this.playScene.bluePortal.deactivate()
        this.playScene.orangePortal.deactivate()
    }

    public die(): void {

    }
}

export default Player