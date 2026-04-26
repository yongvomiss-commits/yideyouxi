class FightScene extends Phaser.Scene {
    constructor() {
        super('FightScene');
    }

    init(data) {
        this.mode = data?.mode || 'single';
    }

    create() {
        this.gameOver = false;
        this.matchDuration = 60;
        this.remainingTime = this.matchDuration;

        this.controls = {
            p1Left: false,
            p1Right: false,
            p1Attack: false,
        };

        this.setupArena();
        this.setupFighters();
        this.setupInputs();
        this.setupHUD();
        this.setupTimer();
        this.setupMobileControls();
    }

    setupArena() {
        this.cameras.main.setBackgroundColor('#111111');

        this.add.rectangle(this.scale.width / 2, 560, this.scale.width, 80, 0x2b2b2b);
        this.add.text(20, 20, this.mode === 'single' ? '单人模式' : '双人模式', {
            fontSize: '20px',
            fill: '#ffffff',
        });
    }

    setupFighters() {
        this.player1 = this.createFighter({
            x: 160,
            y: 470,
            color: 0x20d060,
            name: '玩家1',
            speed: 5,
            maxHp: 100,
            attackRange: 90,
            attackDamage: 9,
            attackCooldown: 500,
            lastAttackAt: 0,
        });

        this.player2 = this.createFighter({
            x: 640,
            y: 470,
            color: 0xd04040,
            name: this.mode === 'single' ? '电脑' : '玩家2',
            speed: this.mode === 'single' ? 3.2 : 5,
            maxHp: 100,
            attackRange: 90,
            attackDamage: this.mode === 'single' ? 7 : 9,
            attackCooldown: this.mode === 'single' ? 700 : 500,
            lastAttackAt: 0,
        });
    }

    createFighter(config) {
        const fighter = {
            ...config,
            hp: config.maxHp,
        };

        fighter.body = this.add.rectangle(config.x, config.y, 55, 110, config.color);
        fighter.label = this.add.text(config.x, config.y - 85, config.name, {
            fontSize: '18px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        return fighter;
    }

    setupInputs() {
        this.keys = this.input.keyboard.addKeys({
            p1Left: Phaser.Input.Keyboard.KeyCodes.A,
            p1Right: Phaser.Input.Keyboard.KeyCodes.D,
            p1Attack: Phaser.Input.Keyboard.KeyCodes.J,
            p2Left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            p2Right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            p2Attack: Phaser.Input.Keyboard.KeyCodes.ONE,
        });
    }

    setupHUD() {
        this.p1HpLabel = this.add.text(20, 60, '', { fontSize: '18px', fill: '#ffffff' });
        this.p2HpLabel = this.add.text(580, 60, '', { fontSize: '18px', fill: '#ffffff' });
        this.timerText = this.add.text(this.scale.width / 2, 20, '60', {
            fontSize: '32px',
            fill: '#ffd166',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0);

        this.p1BarBg = this.add.rectangle(160, 95, 260, 16, 0x444444).setOrigin(0, 0.5);
        this.p1Bar = this.add.rectangle(160, 95, 260, 16, 0x00ff88).setOrigin(0, 0.5);

        this.p2BarBg = this.add.rectangle(380, 95, 260, 16, 0x444444).setOrigin(0, 0.5);
        this.p2Bar = this.add.rectangle(380, 95, 260, 16, 0xff5c5c).setOrigin(0, 0.5);

        this.updateHud();
    }

    setupTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.gameOver) {
                    return;
                }

                this.remainingTime -= 1;
                this.timerText.setText(String(this.remainingTime));

                if (this.remainingTime <= 0) {
                    this.finishMatchByHp();
                }
            },
        });
    }

    setupMobileControls() {
        const isTouch = this.sys.game.device.input.touch;
        if (!isTouch) {
            return;
        }

        this.add.text(20, 525, '触屏：玩家1控制', { fontSize: '14px', fill: '#ffffff' });

        this.createTouchButton(80, 565, '左', 'p1Left');
        this.createTouchButton(180, 565, '右', 'p1Right');
        this.createTouchButton(730, 565, '攻', 'p1Attack');
    }

    createTouchButton(x, y, text, controlKey) {
        const button = this.add.circle(x, y, 38, 0x000000, 0.45);
        const label = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        const press = () => {
            this.controls[controlKey] = true;
            button.setFillStyle(0x333333, 0.7);
        };

        const release = () => {
            this.controls[controlKey] = false;
            button.setFillStyle(0x000000, 0.45);
        };

        button.setInteractive({ useHandCursor: true });
        button.on('pointerdown', press);
        button.on('pointerup', release);
        button.on('pointerout', release);
        button.on('pointerupoutside', release);
        label.setInteractive({ useHandCursor: true });
        label.on('pointerdown', press);
        label.on('pointerup', release);
        label.on('pointerout', release);
    }

    update() {
        if (this.gameOver) {
            return;
        }

        this.handlePlayer1Input();

        if (this.mode === 'single') {
            this.updateSimpleAI();
        } else {
            this.handlePlayer2Input();
        }

        this.syncFighterVisuals(this.player1);
        this.syncFighterVisuals(this.player2);
    }

    handlePlayer1Input() {
        const movingLeft = this.keys.p1Left.isDown || this.controls.p1Left;
        const movingRight = this.keys.p1Right.isDown || this.controls.p1Right;

        if (movingLeft) {
            this.moveFighter(this.player1, -this.player1.speed);
        }
        if (movingRight) {
            this.moveFighter(this.player1, this.player1.speed);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.p1Attack) || this.consumeTouchAttack()) {
            this.tryAttack(this.player1, this.player2);
        }
    }

    consumeTouchAttack() {
        if (!this.controls.p1Attack) {
            return false;
        }

        this.controls.p1Attack = false;
        return true;
    }

    handlePlayer2Input() {
        if (this.keys.p2Left.isDown) {
            this.moveFighter(this.player2, -this.player2.speed);
        }
        if (this.keys.p2Right.isDown) {
            this.moveFighter(this.player2, this.player2.speed);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.p2Attack)) {
            this.tryAttack(this.player2, this.player1);
        }
    }

    updateSimpleAI() {
        const distanceX = this.player1.body.x - this.player2.body.x;
        const absoluteDistance = Math.abs(distanceX);

        if (absoluteDistance > this.player2.attackRange - 20) {
            const moveDirection = distanceX > 0 ? 1 : -1;
            this.moveFighter(this.player2, moveDirection * this.player2.speed);
        } else {
            this.tryAttack(this.player2, this.player1);
        }
    }

    moveFighter(fighter, deltaX) {
        fighter.body.x = Phaser.Math.Clamp(fighter.body.x + deltaX, 30, this.scale.width - 30);
    }

    tryAttack(attacker, defender) {
        const now = this.time.now;
        const canAttack = now - attacker.lastAttackAt >= attacker.attackCooldown;
        if (!canAttack) {
            return;
        }

        const distance = Math.abs(attacker.body.x - defender.body.x);
        if (distance > attacker.attackRange) {
            return;
        }

        attacker.lastAttackAt = now;
        this.flashAttack(attacker);
        defender.hp = Math.max(0, defender.hp - attacker.attackDamage);
        this.updateHud();

        if (defender.hp <= 0) {
            this.finishMatch(attacker.name);
        }
    }

    flashAttack(fighter) {
        fighter.body.setFillStyle(0xffff66);
        this.time.delayedCall(90, () => {
            fighter.body.setFillStyle(fighter.color);
        });
    }

    syncFighterVisuals(fighter) {
        fighter.label.x = fighter.body.x;
    }

    updateHud() {
        this.p1HpLabel.setText(`玩家1 HP: ${this.player1.hp}`);
        this.p2HpLabel.setText(`${this.player2.name} HP: ${this.player2.hp}`);

        this.p1Bar.width = 260 * (this.player1.hp / this.player1.maxHp);
        this.p2Bar.width = 260 * (this.player2.hp / this.player2.maxHp);
    }

    finishMatchByHp() {
        if (this.player1.hp === this.player2.hp) {
            this.finishMatch('平局');
            return;
        }

        const winner = this.player1.hp > this.player2.hp ? this.player1.name : this.player2.name;
        this.finishMatch(winner);
    }

    finishMatch(winner) {
        if (this.gameOver) {
            return;
        }

        this.gameOver = true;

        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        this.time.delayedCall(500, () => {
            this.scene.start('ResultScene', {
                winner,
                mode: this.mode,
                p1Hp: this.player1.hp,
                p2Hp: this.player2.hp,
            });
        });
    }
}
