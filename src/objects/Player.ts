import Sprite = Phaser.Physics.Arcade.Sprite
import Body = Phaser.Physics.Arcade.Body
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'

class Player extends Sprite
{
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
}

export default Player