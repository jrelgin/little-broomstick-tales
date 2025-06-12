import { Scene } from 'phaser';
import {
    GAME_HEIGHT
} from '../constants';
import { isMobileDevice } from '../utils/device';
import TouchControls from '../objects/TouchControls';

export class Game extends Scene
{
    private player!: Phaser.Physics.Arcade.Sprite;
    private decorLayer!: Phaser.Tilemaps.TilemapLayer;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number = 200; // Flying speed
    private idleTimer: number = 0;
    private readonly SLEEPY_THRESHOLD: number = 15000; // 15 seconds in ms
    
    // Touch control properties
    private touchControls?: TouchControls;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        console.log('Game scene created');
        
        // Hide cursor when over game canvas
        this.input.setDefaultCursor('none');
        
        // Create sky background
        const camera = this.cameras.main;
        if (!camera) {
            console.error('Camera not found');
            return;
        }

        // Create tilemap with appropriate scaling for 1024x768 resolution
        const map = this.make.tilemap({ key: 'forest-map' });
        
        // Set world bounds to be larger than screen for exploration but more reasonable
        const mapScale = 3; // Reduced from 6x to 3x for better performance and sizing
        const worldWidth = map.widthInPixels * mapScale;   // Approximately 3024px
        const worldHeight = map.heightInPixels * mapScale;  // Approximately 1872px
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        
        // Draw brown background for the entire world
        this.add.rectangle(0, 0, worldWidth, worldHeight, 0x8B4513)
            .setOrigin(0, 0);
        const tileset = map.addTilesetImage('Forest16', 'forest-tileset');
        
        // Create layers positioned at world origin
        const undergroundLayer = map.createLayer('underground', tileset!, 0, 0);
        const groundLayer = map.createLayer('ground', tileset!, 0, 0);
        this.decorLayer = map.createLayer('decor', tileset!, 0, 0)!;
        
        // Scale all layers to 3x original size
        undergroundLayer?.setScale(mapScale, mapScale);
        groundLayer?.setScale(mapScale, mapScale);
        this.decorLayer?.setScale(mapScale, mapScale);
        
        // Set up collision on decor layer (trees and obstacles)
        const treeTileIds = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,           // Tree tops and foliage
            29, 30, 31, 32, 33, 34, 35, 36, 37,  // Tree trunks and branches  
            57, 58, 59, 60, 61, 62, 63, 64, 65,  // More tree parts
            85, 86, 87, 88, 89, 90, 91, 92, 93   // Decorative elements
        ];
        this.decorLayer?.setCollision(treeTileIds);
        
        console.log('Tilemap scaled:', `${map.widthInPixels}x${map.heightInPixels}`, '→', `${worldWidth}x${worldHeight}`, `(scale: ${mapScale}x)`);

        // Create player (flying witch) - start in center of world
        this.player = this.physics.add.sprite(worldWidth * 0.5, worldHeight * 0.5, 'curious_idle')
            .setScale(1.5);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        
        // Adjust collision body for 3x scaled tilemap
        this.player.body?.setSize(16, 16);
        this.player.body?.setOffset(24, 24);
        
        console.log('Flying witch created at:', this.player.x, this.player.y, 'Scale:', this.player.scaleX);

        // Set up collisions with trees and decorative elements
        this.physics.add.collider(this.player, this.decorLayer, () => {
            console.log('Witch collided with tree/obstacle at:', this.player.x, this.player.y);
        });

        // Set up camera to follow player across the world
        camera.setBounds(0, 0, worldWidth, worldHeight);
        camera.startFollow(this.player);
        camera.setBackgroundColor('#8B4513');

        // Set up keyboard controls
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Create touch controls only on mobile devices
        if (isMobileDevice()) {
            console.log('Mobile device detected, creating functional touch controls');
            const size = 120;
            const x = size / 2 + 20;
            const y = GAME_HEIGHT - size / 2 - 20;
            this.touchControls = new TouchControls(this, x, y, size);
        } else {
            console.log('Desktop device detected, no touch controls needed');
        }
        
        // Start with idle animation
        this.player.play('curious-idle', true);
        this.idleTimer = 0;
        
        console.log('Flying witch game setup complete');
    }


    update(_time: number, delta: number) {
        if (!this.player.body) {
            console.error('Player body not found');
            return;
        }

        // Handle four-directional flying movement
        const left = this.cursors.left.isDown;
        const right = this.cursors.right.isDown;
        const up = this.cursors.up.isDown;
        const down = this.cursors.down.isDown;

        // Reset velocity
        this.player.setVelocity(0);

        // Handle movement and play correct animation
        let isMoving = false;
        
        // Handle touch controls (only if they exist on mobile devices)
        if (this.touchControls?.isActive) {
            const { x, y } = this.touchControls.direction;
            if (Math.abs(x) > Math.abs(y)) {
                // Horizontal movement
                if (x < 0) {
                    this.player.setVelocityX(-this.moveSpeed);
                    this.player.play('walk-left', true);
                } else {
                    this.player.setVelocityX(this.moveSpeed);
                    this.player.play('walk-right', true);
                }
            } else {
                // Vertical movement
                if (y < 0) {
                    this.player.setVelocityY(-this.moveSpeed);
                    this.player.play('walk-up', true);
                } else {
                    this.player.setVelocityY(this.moveSpeed);
                    this.player.play('walk-down', true);
                }
            }
            isMoving = true;
        }
        // Handle keyboard controls
        else if (left) {
            this.player.setVelocityX(-this.moveSpeed);
            this.player.play('walk-left', true);
            isMoving = true;
        } else if (right) {
            this.player.setVelocityX(this.moveSpeed);
            this.player.play('walk-right', true);
            isMoving = true;
        } else if (up) {
            this.player.setVelocityY(-this.moveSpeed);
            this.player.play('walk-up', true);
            isMoving = true;
        } else if (down) {
            this.player.setVelocityY(this.moveSpeed);
            this.player.play('walk-down', true);
            isMoving = true;
        }

        if (isMoving) {
            this.idleTimer = 0;
        } else {
            this.idleTimer += delta;
            if (this.idleTimer >= this.SLEEPY_THRESHOLD) {
                this.player.play('sleepy-idle', true);
            } else {
                this.player.play('curious-idle', true);
            }
        }
    }
}
