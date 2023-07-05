import { Key } from './Keys'
import Tileset = Key.Tileset


export class Data
{
    public static readonly FileLookUp = {
        [Key.Audio.DEFAULT]: '',
        [Key.Sprite.CIRCLE]: './assets/images/circle.png',
        [Key.Sprite.SQUARE]: './assets/images/square.png',
        [Key.Sprite.COIN_FRONT]: './assets/images/coin-front.png',
        [Key.Sprite.COIN_SIDE]: './assets/images/coin-side.png',
        [Key.Sprite.SPIKE]: './assets/images/spike.png',
        [Key.Sprite.DOOR]: './assets/images/door.png',
        [Key.Sprite.SPRING_COMPRESSED]: './assets/images/spring-compressed.png',
        [Key.Sprite.SPRING_RELEASED]: './assets/images/spring-released.png',
        [Key.Sprite.PLAYER_IDLE]: './assets/images/player-idle.png',
        [Key.Sprite.PLAYER_RUNNING]: './assets/images/player-running.png',
        [Key.Sprite.GRADIENT_TOP_TO_BOTTOM]: './assets/images/gradient-top-to-bottom.png',
        [Key.Sprite.KENNEY_DEFAULT_TILESET]: './assets/images/kenney-pixel-platformer.png',
        [Key.Tilemap.LEVEL_1]: './assets/tiled/level-1.json',
        [Key.Tilemap.LEVEL_2]: './assets/tiled/level-2.json',
        [Key.Tilemap.LEVEL_3]: './assets/tiled/level-3.json',
    }

    public static getCollidableTiles(): number[] {
        const enumValues: number[] = []

        function processEnum(enumObject: any) {
            Object.values(enumObject).forEach((value) => {
                if (typeof value === 'number')
                {
                    enumValues.push(value + 1)
                }
            })
        }

        processEnum(Tileset.Terrain.Base)
        processEnum(Tileset.Terrain.Grass)
        processEnum(Tileset.Terrain.Dessert)
        processEnum(Tileset.Terrain.Snowy)

        return enumValues
    }

}
