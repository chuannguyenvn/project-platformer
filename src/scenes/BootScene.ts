import { Scene } from 'phaser'
import { Constants } from '../index'

class BootScene extends Scene
{


    constructor() {
        super({ key: Constants.Key.Scene.BOOT })
    }

    preload() {

    }

    create() {
        this.scene.start(Constants.Key.Scene.LOAD)
    }
}

export default BootScene