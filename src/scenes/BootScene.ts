import { Scene } from 'phaser'
import { Constants } from '../index'
import PreloadHelper from '../utilities/PreloadHelper'
import Tileset = Phaser.Tilemaps.Tileset
import TilemapLayer = Phaser.Tilemaps.TilemapLayer
import Body = Phaser.Physics.Arcade.Body
import { Data } from '../constants'
class BootScene extends Scene
{
    private controls: Phaser.Cameras.Controls.FixedKeyControl
    private player: Phaser.GameObjects.Rectangle
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    
    constructor() {
        super({ key: Constants.Key.Scene.BOOT })
    }

    preload() {
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_SIDE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_FRONT)

    }

    create() {
        this.cameras.main.setZoom(2)
        const map = this.make.tilemap({ key: Constants.Key.Tilemap.LEVEL_1})
        const tileset = map.addTilesetImage('tiles_packed', Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)?.setTileSize(18, 18)
        const layer = map.createLayer('terrain', tileset as Tileset)
        this.add.image(0, 0, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)

        map.setCollision(Data.getCollidableTiles())
        const cursors = this.input.keyboard?.createCursorKeys()

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors?.left,
            right: cursors?.right,
            up: cursors?.up,
            down: cursors?.down,
            speed: 0.5,
        }

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)

        this.player = this.add.rectangle(450, 96, 24, 38, 0xffff00)

        this.physics.add.existing(this.player)

        this.physics.add.collider(this.player, layer as TilemapLayer)
        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        this.cursors.up.on('down', () => {
            if ((this.player.body as Body).blocked.down)
            {
                (this.player.body as Body).setVelocityY(-700)
            }
        }, this)
    }

    update(time: number, delta: number) {
        // this.controls.update(delta);

        (this.player.body as Body).setVelocityX(0)

        if (this.cursors.left.isDown)
        {
            (this.player.body as Body).setVelocityX(-200)
        }
        else if (this.cursors.right.isDown)
        {
            (this.player.body as Body).setVelocityX(200)
        }
    }
}

export default BootScene