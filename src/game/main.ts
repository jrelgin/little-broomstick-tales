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
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 2048,
            height: 1536
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
    ],
    dom: {
        createContainer: true
    }
};

export default function StartGame(containerId: string) {
    const game = new Game({ ...config, parent: containerId });
    game.canvas.style.cursor = 'none';
    return game;
}
