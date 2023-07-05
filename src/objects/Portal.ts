import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import Vector2 = Phaser.Math.Vector2

class Portal extends Interactable
{
    public destinationPortal: Portal
    public orientation: Vector2
    public isActive: boolean = true

    constructor(playScene: PlayScene, isBlue: boolean) {
        super(playScene, -10000, -10000, Key.Sprite.SQUARE)

        this.setDisplaySize(18, 18)

        if (isBlue)
        {
            this.setTintFill(0x0000ff)
        }
        else
        {
            this.setTintFill(0xffff00)
        }

        this.setMass(0)
        this.setDrag(100000)
    }

    update() {
        this.setVelocity(0)
    }

    public deactivate(): void {
        // this.isActive = false
        // this.playScene.time.delayedCall(Constants.Values.PORTAL_COOLDOWN, () => this.isActive = true)
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