import { Boot } from './scenes/Boot';
import { GameComplete } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 3072,
    height: 1920,
    parent: 'game-container',
    backgroundColor: '#028af8',
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    scale: {
        mode: Scale.RESIZE,
        autoCenter: Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
        min: {
            width: 1024,
            height: 768
        },
        max: {
            width: 3072,
            height: 1920
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameComplete
    ]
};

export default function StartGame(containerId: string) {
    return new Game({ ...config, parent: containerId });
}
