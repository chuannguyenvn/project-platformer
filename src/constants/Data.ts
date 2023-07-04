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
        [Key.Sprite.GRADIENT_TOP_TO_BOTTOM]: './assets/images/gradient-top-to-bottom.png',
        [Key.Sprite.KENNEY_DEFAULT_TILESET]: './assets/images/kenney-pixel-platformer.png',
        [Key.Tilemap.LEVEL_1_TERRAIN]: './assets/tiled/level-1_terrain.csv',
        [Key.Tilemap.LEVEL_1_DECORATION]: './assets/tiled/level-1_decoration.csv',
        [Key.Tilemap.LEVEL_2_TERRAIN]: './assets/tiled/level-2_terrain.csv',
        [Key.Tilemap.LEVEL_2_DECORATION]: './assets/tiled/level-2_decoration.csv',
        [Key.Tilemap.LEVEL_3_TERRAIN]: './assets/tiled/level-3_terrain.csv',
        [Key.Tilemap.LEVEL_3_DECORATION]: './assets/tiled/level-3_decoration.csv',
    }

    public static getCollidableTiles(): number[] {
        const enumValues: number[] = []

        function processEnum(enumObject: any) {
            Object.values(enumObject).forEach((value) => {
                if (typeof value === 'number')
                {
                    enumValues.push(value)
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
