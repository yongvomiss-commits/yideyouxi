class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.winner = data?.winner || '平局';
        this.mode = data?.mode || 'single';
        this.p1Hp = data?.p1Hp ?? 0;
        this.p2Hp = data?.p2Hp ?? 0;
    }

    create() {
        const centerX = this.scale.width / 2;

        this.cameras.main.setBackgroundColor('#101010');

        this.add.text(centerX, 180, '对战结算', {
            fontSize: '44px',
            fill: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(centerX, 270, this.winner === '平局' ? '结果：平局' : `胜者：${this.winner}`, {
            fontSize: '34px',
            fill: '#ffd166',
        }).setOrigin(0.5);

        this.add.text(centerX, 330, `玩家1 HP: ${this.p1Hp}  |  对手 HP: ${this.p2Hp}`, {
            fontSize: '22px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        this.createButton(centerX, 420, '再来一局', () => {
            this.scene.start('FightScene', { mode: this.mode });
        });

        this.createButton(centerX, 495, '返回主菜单', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, label, onClick) {
        const button = this.add.text(x, y, label, {
            fontSize: '28px',
            fill: '#00ff99',
            backgroundColor: '#1b1b1b',
            padding: { left: 18, right: 18, top: 10, bottom: 10 },
        }).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });
        button.on('pointerover', () => button.setStyle({ fill: '#7fffd4' }));
        button.on('pointerout', () => button.setStyle({ fill: '#00ff99' }));
        button.on('pointerdown', onClick);
    }
}
