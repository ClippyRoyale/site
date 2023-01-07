"use strict";

function BeetleObject(game, level, zone, pos, oid) {
    GameObject.call(this, game, level, zone, pos);
    this.oid = oid;
    this.variant = 0;
    this.setState(BeetleObject.STATE.RUN);
    this.bonkTimer = this.anim = 0x0;
    this.loc = [this.pos.y + 0.5 * BeetleObject.FLY_DISTANCE, this.pos.y - 0.5 * BeetleObject.FLY_DISTANCE];
    this.dim = vec2.make(0x1, 0x1);
    this.fallSpeed = this.moveSpeed = 0x0;
    this.disabled = this.grounded = false;
    this.disabledTimer = 0x0;
    this.proxHit = false;
    this.immuneTimer = 0x0;
    this.rev = false;
    this.dir = true;
    this.kicker = -1;
    this.disable();
}
BeetleObject.ASYNC = false;
BeetleObject.ANIMATION_RATE = 0x4;
BeetleObject.ID = 0x18;
BeetleObject.NAME = "BUZZY BEETLE";
BeetleObject.FLY_DISTANCE = 0x3;
BeetleObject.FLY_ACCEL = 0.0025;
BeetleObject.FLY_SPEED_MAX = 0.075;
BeetleObject.CHECK_DIST = 0;
BeetleObject.SPRITE = {};
BeetleObject.SPRITE_LIST = [{
    'NAME': "RUN0",
    'ID': 0x2,
    'INDEX': 0x7c
}, {
    'NAME': "RUN1",
    'ID': 0x3,
    'INDEX': 0x7d
}, {
    'NAME': "TRANSFORM",
    'ID': 0x4,
    'INDEX': 95
}, {
    'NAME': "SHELL",
    'ID': 0x5,
    'INDEX': 95
}];
for (_0x1bec55 = 0x0; _0x1bec55 < BeetleObject.SPRITE_LIST.length; _0x1bec55++) BeetleObject.SPRITE[BeetleObject.SPRITE_LIST[_0x1bec55].NAME] = BeetleObject.SPRITE_LIST[_0x1bec55], BeetleObject.SPRITE[BeetleObject.SPRITE_LIST[_0x1bec55].ID] = BeetleObject.SPRITE_LIST[_0x1bec55];
BeetleObject.STATE = {};
BeetleObject.STATE_LIST = [{
    'NAME': "RUN",
    'ID': 0x1,
    'SPRITE': [BeetleObject.SPRITE.RUN0, BeetleObject.SPRITE.RUN1]
}, {
    'NAME': "TRANSFORM",
    'ID': 0x2,
    'SPRITE': [BeetleObject.SPRITE.SHELL, BeetleObject.SPRITE.TRANSFORM]
}, {
    'NAME': "SHELL",
    'ID': 0x3,
    'SPRITE': [BeetleObject.SPRITE.SHELL]
}, {
    'NAME': "SPIN",
    'ID': 0x4,
    'SPRITE': [BeetleObject.SPRITE.SHELL]
}, {
    'NAME': "BONK",
    'ID': 0x51,
    'SPRITE': []
}];
for (_0x1bec55 = 0x0; _0x1bec55 < BeetleObject.STATE_LIST.length; _0x1bec55++) BeetleObject.STATE[BeetleObject.STATE_LIST[_0x1bec55].NAME] = BeetleObject.STATE_LIST[_0x1bec55], BeetleObject.STATE[BeetleObject.STATE_LIST[_0x1bec55].ID] = BeetleObject.STATE_LIST[_0x1bec55];
BeetleObject.prototype.update = KoopaObject.prototype.update;
BeetleObject.prototype.step = function () {
    if (this.disabled) this.proximity();
    else if (0x0 < this.disabledTimer && this.disabledTimer--, this.state === BeetleObject.STATE.BONK) this.bonkTimer++ > KoopaObject.BONK_TIME || 0x0 > this.pos.y + this.dim.y ? this.destroy() : (this.pos = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed)), this.moveSpeed *= KoopaObject.BONK_DECEL, this.fallSpeed = Math.max(this.fallSpeed - KoopaObject.FALL_SPEED_ACCEL, -KoopaObject.BONK_FALL_SPEED));
    else {
        this.anim++;
        this.sprite = this.state.SPRITE[parseInt(this.anim / BeetleObject.ANIMATION_RATE) % this.state.SPRITE.length];
        if (this.state === BeetleObject.STATE.SHELL || this.state === BeetleObject.STATE.TRANSFORM) --this.transformTimer < KoopaObject.TRANSFORM_THRESHOLD && this.setState(BeetleObject.STATE.TRANSFORM), 0x0 >= this.transformTimer && this.setState(BeetleObject.STATE.RUN);
        0x0 < this.immuneTimer && this.immuneTimer--;
        this.control();
        this.physics();
        this.interaction();
        this.sound();
        0x0 > this.pos.y && this.destroy();
    }
};
BeetleObject.prototype.control = function () {
    this.state === BeetleObject.STATE.RUN && (this.grounded && !this.checkGround() && (this.dir = !this.dir), this.moveSpeed = this.dir ? -KoopaObject.MOVE_SPEED_MAX : KoopaObject.MOVE_SPEED_MAX);
    this.state === BeetleObject.STATE.SPIN && (this.moveSpeed = this.dir ? -KoopaObject.SHELL_MOVE_SPEED_MAX : KoopaObject.SHELL_MOVE_SPEED_MAX);
    if (this.state === BeetleObject.STATE.SHELL || this.state === BeetleObject.STATE.TRANSFORM) this.moveSpeed = 0x0;
};
BeetleObject.prototype.physics = function () {
    if (this.grounded) {
        this.fallSpeed = 0;
    }
    this.fallSpeed = Math.max(this.fallSpeed - KoopaObject.FALL_SPEED_ACCEL, -KoopaObject.FALL_SPEED_MAX);

    var movx = vec2.add(this.pos, vec2.make(this.moveSpeed, 0.));
    var movy = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed));

    var ext1 = vec2.make(this.moveSpeed >= 0 ? this.pos.x : this.pos.x + this.moveSpeed, this.fallSpeed <= 0 ? this.pos.y : this.pos.y + this.fallSpeed);
    var ext2 = vec2.make(this.dim.y + Math.abs(this.moveSpeed), this.dim.y + Math.abs(this.fallSpeed));
    var tiles = this.game.world.getZone(this.level, this.zone).getTiles(ext1, ext2);
    var tdim = vec2.make(1., 1.);

    var changeDir = false;
    this.grounded = false;
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (!tile.definition.COLLIDE) { continue; }

        var hitx = squar.intersection(tile.pos, tdim, movx, this.dim);

        if (hitx) {
            if (this.state === BeetleObject.STATE.SPIN) tile.definition.TRIGGER(this.game, this.pid, tile, this.level, this.zone, tile.pos.x, tile.pos.y, td32.TRIGGER.TYPE.SHELL);

            if (this.pos.x + this.dim.x <= tile.pos.x && movx.x + this.dim.x > tile.pos.x) {
                movx.x = tile.pos.x - this.dim.x;
                movy.x = movx.x;
                this.moveSpeed = 0;
                changeDir = true;
            }
            else if (this.pos.x >= tile.pos.x + tdim.x && movx.x < tile.pos.x + tdim.x) {
                movx.x = tile.pos.x + tdim.x;
                movy.x = movx.x;
                this.moveSpeed = 0;
                changeDir = true;
            }
        }
    }

    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (!tile.definition.COLLIDE) { continue; }

        var hity = squar.intersection(tile.pos, tdim, movy, this.dim);

        if (hity) {
            if (this.pos.y >= tile.pos.y + tdim.y && movy.y < tile.pos.y + tdim.y) {
                movy.y = tile.pos.y + tdim.y;
                this.fallSpeed = 0;
                this.grounded = true;
            }
            else if (this.pos.y + this.dim.y <= tile.pos.y && movy.y + this.dim.y > tile.pos.y) {
                movy.y = tile.pos.y - this.dim.y;
                this.fallSpeed = 0;
            }
        }
    }
    this.pos = vec2.make(movx.x, movy.y);
    if (changeDir) { this.dir = !this.dir; }
};
BeetleObject.prototype.interaction = function () {
    if (this.state === BeetleObject.STATE.SPIN)
        for (var _0x55c0e3 = 0x0; _0x55c0e3 < this.game.objects.length; _0x55c0e3++) {
            var _0xa2c7b4 = this.game.objects[_0x55c0e3];
            _0xa2c7b4 === this || _0xa2c7b4 instanceof PlayerObject || !_0xa2c7b4.isTangible() || !_0xa2c7b4.damage || _0xa2c7b4.level === this.level && _0xa2c7b4.zone === this.zone && squar.intersection(_0xa2c7b4.pos, _0xa2c7b4.dim, this.pos, this.dim) && _0xa2c7b4.damage();
        }
};
BeetleObject.prototype.sound = GameObject.prototype.sound;
BeetleObject.prototype.checkGround = function () {
    var _0x1e7bcc = this.dir ? vec2.add(this.pos, vec2.make(-BeetleObject.CHECK_DIST, 0x0)) : vec2.add(this.pos, vec2.make(BeetleObject.CHECK_DIST + this.dim.x, 0x0));
    _0x1e7bcc.y -= 1.5;
    return this.game.world.getZone(this.level, this.zone).getTile(_0x1e7bcc).definition.COLLIDE;
};
BeetleObject.prototype.proximity = KoopaObject.prototype.proximity;
BeetleObject.prototype.enable = KoopaObject.prototype.enable;
BeetleObject.prototype.disable = KoopaObject.prototype.disable;
BeetleObject.prototype.damage = function(obj) {
    if (obj instanceof FireballObject) { return; }
    this.bonk();
};
BeetleObject.prototype.bonk = function () {
    this.dead || (this.setState(BeetleObject.STATE.BONK), this.moveSpeed = KoopaObject.BONK_IMP.x, this.fallSpeed = KoopaObject.BONK_IMP.y, this.dead = true, this.play("kick.mp3", 0x1, 0.04));
};
BeetleObject.prototype.stomped = function (dir, kicker) {
    if (this.state === BeetleObject.STATE.FLY) this.setState(BeetleObject.STATE.RUN);
    else if (this.state === BeetleObject.STATE.RUN) this.setState(BeetleObject.STATE.SHELL), this.transformTimer = KoopaObject.TRANSFORM_TIME;
    else if (this.state === BeetleObject.STATE.SPIN) this.setState(BeetleObject.STATE.SHELL), this.transformTimer = KoopaObject.TRANSFORM_TIME;
    else if (this.state === BeetleObject.STATE.SHELL || this.state === BeetleObject.STATE.TRANSFORM) this.setState(BeetleObject.STATE.SPIN), this.dir = dir, this.kicker = kicker;
    this.state === BeetleObject.STATE.SPIN ? this.play("kick.mp3", 0x1, 0.04) : this.play("stomp.mp3", 0x1, 0.04);
};
BeetleObject.prototype.playerCollide = function (_0x2665f3) {
    this.dead || this.garbage || (this.state === BeetleObject.STATE.SHELL || this.state === BeetleObject.STATE.TRANSFORM ? (_0x2665f3 = 0x0 < _0x2665f3.pos.x - this.pos.x, this.stomped(_0x2665f3, _0x2665f3.pid), this.game.out.push(NET020.encode(this.level, this.zone, this.oid, _0x2665f3 ? 0x10 : 0x11)), this.immuneTimer = KoopaObject.PLAYER_IMMUNE_TIME) : 0x0 >= this.immuneTimer && _0x2665f3.damage(this));
};
BeetleObject.prototype.playerStomp = KoopaObject.prototype.playerStomp;
BeetleObject.prototype.playerBump = KoopaObject.prototype.playerBump;
BeetleObject.prototype.kill = KoopaObject.prototype.kill;
BeetleObject.prototype.destroy = KoopaObject.prototype.destroy;
BeetleObject.prototype.isTangible = KoopaObject.prototype.isTangible;
BeetleObject.prototype.setState = KoopaObject.prototype.setState;
BeetleObject.prototype.draw = function (_0x6357b4) {
    if (!this.disabled) {
        var _0x249e88;
        _0x249e88 = this.state === BeetleObject.STATE.BONK ? 0x3 : 0x0 < this.disabledTimer ? 0xa0 + parseInt(0x20 * (0x1 - this.disabledTimer / KoopaObject.ENABLE_FADE_TIME)) : 0x0;
        if (this.sprite.INDEX instanceof Array)
            for (var _0xe3aa3a = this.sprite.INDEX, _0x331f7c = 0x0; _0x331f7c < _0xe3aa3a.length; _0x331f7c++)
                for (var _0x55c5a9 = 0x0; _0x55c5a9 < _0xe3aa3a[_0x331f7c].length; _0x55c5a9++) {
                    var _0x1d1e23 = _0xe3aa3a[0x3 !== _0x249e88 ? _0x331f7c : _0xe3aa3a.length - 0x1 - _0x331f7c][_0x55c5a9];
                    switch (this.variant) {
                        case 0x1:
                            _0x1d1e23 += KoopaObject.VARIANT_OFFSET;
                    }
                    _0x6357b4.push({
                        'pos': vec2.add(this.pos, vec2.make(_0x55c5a9, _0x331f7c)),
                        'reverse': !this.dir,
                        'index': _0x1d1e23,
                        'mode': _0x249e88
                    });
                } else {
            _0x1d1e23 = this.sprite.INDEX;
            switch (this.variant) {
                case 0x1:
                    _0x1d1e23 += KoopaObject.VARIANT_OFFSET;
            }
            _0x6357b4.push({
                'pos': this.pos,
                'reverse': !this.dir,
                'index': _0x1d1e23,
                'mode': _0x249e88
            });
        }
    }
};
BeetleObject.prototype.play = GameObject.prototype.play;
GameObject.REGISTER_OBJECT(BeetleObject);