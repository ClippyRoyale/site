"use strict";

function checkSpeed(speed) {
    if(speed == 0) { return 0 }
    else { return 0.05 }
}

function PiranhaPlantObject(game, level, zone, pos, oid, variant, direction, movement, noOffset) {
    switch(parseInt(noOffset)) {
        case 1 :
            this.noOffset = true;
            break;
        default:
            this.noOffset = false;
            break;
    }
    GameObject.call(this, game, level, zone, vec2.add(pos, vec2.make(this.noOffset ? 0.1 : 0.6, 0x0)));
    this.speed = 0.05;
    switch(parseInt(movement)) {
        case 1 : 
            this.speed = 0;
            break;
        default : 
            this.speed = 0.05
            break;
    }
    this.oid = oid;
    this.variant = isNaN(parseInt(variant)) ? 0x0 : parseInt(variant);
    this.direction = isNaN(parseInt(direction)) ? 0x0 : parseInt(direction);
    if (this.direction) this.pos = vec2.add(this.pos, vec2.make(0,1.25));
    this.setState(PiranhaPlantObject.STATE.IDLE);
    this.bonkTimer = this.anim = 0x0;
    this.loc = [vec2.copy(this.pos), vec2.add(this.pos, vec2.make(0x0, -1.5))];
    this.dim = vec2.make(0.8, 0x1);
    this.dir = this.fallSpeed = this.moveSpeed = 0x0;
}
PiranhaPlantObject.ASYNC = false;
PiranhaPlantObject.ID = 0x16;
PiranhaPlantObject.NAME = "PIRANHA PLANT";
PiranhaPlantObject.ANIMATION_RATE = 0x3;
PiranhaPlantObject.VARIANT_OFFSET = 0x20;
PiranhaPlantObject.SOFFSET = [vec2.make(-0.1, 0x0), vec2.make(-0.1, -0.75)];
PiranhaPlantObject.BONK_TIME = 0x5a;
PiranhaPlantObject.BONK_IMP = vec2.make(0.25, 0.4);
PiranhaPlantObject.BONK_DECEL = 0.925;
PiranhaPlantObject.BONK_FALL_SPEED = 0.5;
PiranhaPlantObject.FALL_SPEED_ACCEL = 0.085;
PiranhaPlantObject.WAIT_TIME = 0x19;
PiranhaPlantObject.TRAVEL_SPEED = checkSpeed(this.speed)
PiranhaPlantObject.SPRITE = {};
PiranhaPlantObject.SPRITE_LIST = [
    {
        'NAME': "IDLE0",
        'ID': 0x0,
        'INDEX': [
            [0x6a],
            [0x5a]
        ]
    }, {
        'NAME': "IDLE1",
        'ID': 0x1,
        'INDEX': [
            [0x6b],
            [0x5b]
        ]
    }
];
for (_0x1bec55 = 0x0; _0x1bec55 < PiranhaPlantObject.SPRITE_LIST.length; _0x1bec55++) PiranhaPlantObject.SPRITE[PiranhaPlantObject.SPRITE_LIST[_0x1bec55].NAME] = PiranhaPlantObject.SPRITE_LIST[_0x1bec55], PiranhaPlantObject.SPRITE[PiranhaPlantObject.SPRITE_LIST[_0x1bec55].ID] = PiranhaPlantObject.SPRITE_LIST[_0x1bec55];
PiranhaPlantObject.STATE = {};
PiranhaPlantObject.STATE_LIST = [{
    'NAME': "IDLE",
    'ID': 0x0,
    'SPRITE': [PiranhaPlantObject.SPRITE.IDLE0, PiranhaPlantObject.SPRITE.IDLE1]
}, {
    'NAME': "BONK",
    'ID': 0x51,
    'SPRITE': []
}];
for (_0x1bec55 = 0x0; _0x1bec55 < PiranhaPlantObject.STATE_LIST.length; _0x1bec55++) PiranhaPlantObject.STATE[PiranhaPlantObject.STATE_LIST[_0x1bec55].NAME] = PiranhaPlantObject.STATE_LIST[_0x1bec55], PiranhaPlantObject.STATE[PiranhaPlantObject.STATE_LIST[_0x1bec55].ID] = PiranhaPlantObject.STATE_LIST[_0x1bec55];
PiranhaPlantObject.prototype.update = function(_0x5c481f) {
    switch (_0x5c481f) {
        case 0x1:
            this.bonk();
    }
};
PiranhaPlantObject.prototype.step = function() {
    this.state === PiranhaPlantObject.STATE.BONK ? this.bonkTimer++ > PiranhaPlantObject.BONK_TIME || 0x0 > this.pos.y + this.dim.y ? this.destroy() : (this.pos = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed)), this.moveSpeed *= PiranhaPlantObject.BONK_DECEL, this.fallSpeed = Math.max(this.fallSpeed - PiranhaPlantObject.FALL_SPEED_ACCEL, -PiranhaPlantObject.BONK_FALL_SPEED)) : (this.anim++, this.sprite = this.state.SPRITE[parseInt(this.anim / PiranhaPlantObject.ANIMATION_RATE) % this.state.SPRITE.length], 0x0 < --this.waitTimer || (this.control(), this.physics(), this.sound()));
};
PiranhaPlantObject.prototype.control = function() {};
PiranhaPlantObject.prototype.physics = function() {
    var _0x3e7dc7 = this.loc[this.dir ? 0x0 : 0x1];
    vec2.distance(this.pos, _0x3e7dc7) <= /*PiranhaPlantObject.TRAVEL_SPEED*/ checkSpeed(this.speed) ? (this.pos = _0x3e7dc7, this.dir = !this.dir, this.waitTimer = PiranhaPlantObject.WAIT_TIME) : this.pos = vec2.add(this.pos, vec2.scale(vec2.normalize(vec2.subtract(_0x3e7dc7, this.pos)), checkSpeed(this.speed)));
};
PiranhaPlantObject.prototype.sound = GameObject.prototype.sound;
PiranhaPlantObject.prototype.damage = function(_0x508a32) {
    this.dead || (this.bonk(), this.game.out.push(NET020.encode(this.level, this.zone, this.oid, 0x1)));
};
PiranhaPlantObject.prototype.bonk = function() {
    this.dead || (this.setState(PiranhaPlantObject.STATE.BONK), this.moveSpeed = PiranhaPlantObject.BONK_IMP.x, this.fallSpeed = PiranhaPlantObject.BONK_IMP.y, this.dead = true, this.play("kick.mp3", 0x1, 0.04));
};
PiranhaPlantObject.prototype.playerCollide = function(_0x3bb251) {
    this.dead || this.garbage || _0x3bb251.damage(this);
};
PiranhaPlantObject.prototype.playerStomp = function(_0x8423cf) {
    this.dead || this.garbage || _0x8423cf.damage(this);
};
PiranhaPlantObject.prototype.playerBump = function(_0x321a69) {
    this.dead || this.garbage || _0x321a69.damage(this);
};
PiranhaPlantObject.prototype.kill = function() {};
PiranhaPlantObject.prototype.destroy = GameObject.prototype.destroy;
PiranhaPlantObject.prototype.isTangible = GameObject.prototype.isTangible;
PiranhaPlantObject.prototype.setState = function(_0x3f1709) {
    _0x3f1709 !== this.state && (this.state = _0x3f1709, 0x0 < _0x3f1709.SPRITE.length && (this.sprite = _0x3f1709.SPRITE[0x0]), this.anim = 0x0);
};
PiranhaPlantObject.prototype.draw = function(spriteList) {
    var mode;
    mode = (this.direction ^ this.state === PiranhaPlantObject.STATE.BONK) ? 0x3 : 0x0;
    if (this.sprite.INDEX instanceof Array) {
        var idxs = this.sprite.INDEX;
        for (var i = 0x0; i < idxs.length; i++)
            for (var j = 0x0; j < idxs[i].length; j++) {
                var idx = idxs[mode ? idxs.length - 0x1 - i : i][j];
                switch (this.variant) {
                    case 0x1: 
                        idx += PiranhaPlantObject.VARIANT_OFFSET;
                        break;
                    default: {break;}
                }
                spriteList.push({
                    'pos': vec2.add(vec2.add(this.pos, vec2.make(j, i)), PiranhaPlantObject.SOFFSET[this.direction]),
                    'reverse': !this.dir,
                    'index': idx,
                    'mode': mode
                });
            } 
    } else {
        idx = this.sprite.INDEX;
        switch (this.variant) {
            case 0x1:
                idx += PiranhaPlantObject.VARIANT_OFFSET;
        }
        spriteList.push({
            'pos': vec2.add(this.pos, PiranhaPlantObject.SOFFSET[this.direction]),
            'reverse': !this.dir,
            'index': idx,
            'mode': mode
        });
    }
};
PiranhaPlantObject.prototype.play = GameObject.prototype.play;
GameObject.REGISTER_OBJECT(PiranhaPlantObject);