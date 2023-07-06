import { Scene } from 'phaser'
import { Constants } from '../index'
import PreloadHelper from '../utilities/PreloadHelper'


class LoadScene extends Scene
{
    constructor() {
        super({ key: Constants.Key.Scene.LOAD })
    }

    preload(): void {
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_2)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_3)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_SIDE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_FRONT)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPIKE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.DOOR)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KEY)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.LOCK)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.LOCK_WALL)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPRING_COMPRESSED)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPRING_RELEASED)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.PLAYER_IDLE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.PLAYER_RUNNING)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.BACKGROUND)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SQUARE)
    }

    create(): void {
        this.scene.start(Constants.Key.Scene.PLAY)
    }
}

export default LoadScene