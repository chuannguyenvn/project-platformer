import { Scene } from 'phaser'
import { Constants } from '../index'
import PreloadHelper from '../utilities/PreloadHelper'
import { Data } from '../constants'
import Tileset = Phaser.Tilemaps.Tileset
import TilemapLayer = Phaser.Tilemaps.TilemapLayer
import Body = Phaser.Physics.Arcade.Body

class BootScene extends Scene
{
    private player: Phaser.GameObjects.Rectangle
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super({ key: Constants.Key.Scene.BOOT })
    }

    preload() {
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1_TERRAIN)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1_DECORATION)

    }

    create() {
        const map = this.make.tilemap({ key: Constants.Key.Tilemap.LEVEL_1_TERRAIN, tileHeight: 32, tileWidth: 32 })
        const tileset = map.addTilesetImage(Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)?.setTileSize(18, 18)

        const layer = map.createLayer(0, tileset as Tileset)
        map.setCollision(Data.getCollidableTiles(), true)
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