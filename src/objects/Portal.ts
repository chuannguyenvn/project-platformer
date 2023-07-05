import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import { Constants } from '../index'

class Portal extends Interactable
{
    public destinationPortal: Portal
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
}

export default Portal