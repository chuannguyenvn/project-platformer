import { Scene } from 'phaser'
import { Constants } from '../index'
import PreloadHelper from '../utilities/PreloadHelper'
import Tileset = Phaser.Tilemaps.Tileset

class BootScene extends Scene
{
    constructor() {
        super({ key: Constants.Key.Scene.BOOT })
    }

    preload() {
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1_TERRAIN)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1_DECORATION)

    }

    create() {
        const map = this.make.tilemap({ key: Constants.Key.Tilemap.LEVEL_1_TERRAIN })
        const tileset = map.addTilesetImage(Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)?.setTileSize(18, 18)

        map.createLayer(0, tileset as Tileset)
    }
}

export default BootScene