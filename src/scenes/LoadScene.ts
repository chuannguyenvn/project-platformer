﻿import { Scene } from 'phaser'
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
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_SIDE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_FRONT)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPIKE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SQUARE)
    }

    create(): void {
        this.scene.start(Constants.Key.Scene.PLAY)
    }
}

export default LoadScene