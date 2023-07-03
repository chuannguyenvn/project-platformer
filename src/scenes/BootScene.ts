import { Scene } from 'phaser'
import PreloadHelper from '../utilities/PreloadHelper'
import Assets from '../constants/Keys'
import Tileset = Phaser.Tilemaps.Tileset
import Terrain = Assets.Key.Tileset.Terrain

class BootScene extends Scene
{
    constructor() {
        super({ key: Assets.Key.Scene.BOOT })
    }

    preload(): void {
        PreloadHelper.preloadSprite(this, Assets.Key.Sprite.KENNEY_DEFAULT_TILESET)
    }

    create(): void {
        const level = [
            [Terrain.Grass.TOP_LEFT, Terrain.Grass.TOP_MID, Terrain.Grass.TOP_RIGHT, -1],
            [Terrain.Base.MID_LEFT, Terrain.Base.MID_MID, Terrain.Base.MID_RIGHT, -1],
            [Terrain.Base.BOT_LEFT, Terrain.Base.BOT_MID, Terrain.Base.BOT_MID, Terrain.Grass.ROW_MID],
        ]

        // When loading from an array, make sure to specify the tileWidth and tileHeight
        const map = this.make.tilemap({ data: level, tileWidth: 18, tileHeight: 18 })
        const tiles = map.addTilesetImage(Assets.Key.Sprite.KENNEY_DEFAULT_TILESET) as Tileset
        const layer = map.createLayer(0, tiles, 0, 0)
    }
}

export default BootScene