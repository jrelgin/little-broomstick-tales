export default class TouchControls extends Phaser.GameObjects.Container {
    private touchZone: Phaser.GameObjects.Zone;
    private readonly deadZone = 40;
    private isTouching = false;
    public direction = { x: 0, y: 0 };

    constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.touchZone = scene.add.zone(x, y, size, size)
            .setInteractive()
            .setOrigin(0.5)
            .setScrollFactor(0);

        const touchZoneBg = scene.add.circle(x, y, size / 2, 0x000000, 0.4)
            .setScrollFactor(0);
        const deadZoneBg = scene.add.circle(x, y, this.deadZone / 2, 0x000000, 0.7)
            .setScrollFactor(0);

        this.add([touchZoneBg, deadZoneBg, this.touchZone]);
        this.setScrollFactor(0);

        this.touchZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isTouching = true;
            this.updateDirection(pointer);
        });

        this.touchZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isTouching) {
                this.updateDirection(pointer);
            }
        });

        this.touchZone.on('pointerup', () => {
            this.isTouching = false;
            this.direction = { x: 0, y: 0 };
        });

        this.touchZone.on('pointerout', () => {
            this.isTouching = false;
            this.direction = { x: 0, y: 0 };
        });
    }

    private updateDirection(pointer: Phaser.Input.Pointer) {
        const dx = pointer.x - this.touchZone.x;
        const dy = pointer.y - this.touchZone.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.deadZone / 2) {
            this.direction = { x: 0, y: 0 };
            return;
        }

        this.direction = { x: dx / distance, y: dy / distance };
    }

    get isActive(): boolean {
        return this.isTouching;
    }
}
