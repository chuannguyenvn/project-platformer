import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import Vector2 = Phaser.Math.Vector2
import { Constants } from '../index'
import Sprite = Phaser.Physics.Arcade.Sprite

class Portal extends Sprite
{
    private playScene: PlayScene
    public destinationPortal: Portal
    public orientation: Vector2 = Vector2.UP
    public isActive: boolean = false

    constructor(playScene: PlayScene, isBlue: boolean) {
        super(playScene, -10000, -10000, Key.Sprite.SQUARE)
        this.playScene = playScene
        this.playScene.physics.add.existing(this)
        this.playScene.add.existing(this)
        
        this.setDisplaySize(32, 32)

        if (isBlue)
        {
            this.setTintFill(0x0000ff)
        }
        else
        {
            this.setTintFill(0xff8800)
        }

        this.setDrag(100000)
    }

    public activate(): void {
        this.isActive = true
        this.playScene.time.delayedCall(Constants.Values.PORTAL_COOLDOWN, () => this.isActive = false)
    }

    public setOrientation(orientation: PortalOrientation): void {
        switch (orientation)
        {
            case PortalOrientation.UP:
                this.orientation = Vector2.UP
                this.setRotation(Phaser.Math.PI2 * 0.75)
                break
            case PortalOrientation.DOWN:
                this.orientation = Vector2.DOWN
                this.setRotation(Phaser.Math.PI2 * 0.25)
                break
            case PortalOrientation.LEFT:
                this.orientation = Vector2.LEFT
                this.setRotation(Phaser.Math.PI2 * 0.5)
                break
            case PortalOrientation.RIGHT:
                this.orientation = Vector2.RIGHT
                this.setRotation(0)
                break
        }
    }
}

enum PortalOrientation
{
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export { Portal, PortalOrientation }