"use strict";

function customSpeed(speed) {
    return speed || 23;
}

function FireBarObject(game, level, zone, pos, oid, phase, length, speed) {
    GameObject.call(this, game, level, zone, pos);
    this.oid = oid;
    this.state = FireBarObject.STATE.IDLE;
    this.sprite = this.state.SPRITE[0x0];
    this.speed = 0x17;
    switch(parseInt(speed)) {
        case 23 : {this.speed = 0x17;}
        default : {this.speed = speed;}
    }
    this.anim = 0x1 === parseInt(phase) ? 0x2 * FireBarObject.SPIN_RATE : 0x0;
    this.dim = vec2.make(0.5, 0.5);
    this.size = isNaN(parseInt(length)) ? FireBarObject.PARTS : parseInt(length);
}
FireBarObject.ASYNC = true;
FireBarObject.ID = 0x21;
FireBarObject.NAME = "FIRE BAR";
FireBarObject.ANIMATION_RATE = 0x2;
FireBarObject.OFFSET = vec2.make(0.25, 0.25);
FireBarObject.PARTS = 0x6;
FireBarObject.SPACING = 0.5;
FireBarObject.SPIN_RATE = 0x17;
FireBarObject.SPRITE = {};
FireBarObject.SPRITE_LIST = [{
    'NAME': "IDLE0",
    'ID': 0x0,
    'INDEX': 0xd0
}, {
    'NAME': "IDLE1",
    'ID': 0x1,
    'INDEX': 0xd1
}, {
    'NAME': "IDLE2",
    'ID': 0x2,
    'INDEX': 0xd2
}, {
    'NAME': "IDLE3",
    'ID': 0x3,
    'INDEX': 0xd3
}];
for (_0x1bec55 = 0x0; _0x1bec55 < FireBarObject.SPRITE_LIST.length; _0x1bec55++) FireBarObject.SPRITE[FireBarObject.SPRITE_LIST[_0x1bec55].NAME] = FireBarObject.SPRITE_LIST[_0x1bec55], FireBarObject.SPRITE[FireBarObject.SPRITE_LIST[_0x1bec55].ID] = FireBarObject.SPRITE_LIST[_0x1bec55];
FireBarObject.STATE = {};
FireBarObject.STATE_LIST = [{
    'NAME': "IDLE",
    'ID': 0x0,
    'SPRITE': [FireBarObject.SPRITE.IDLE0, FireBarObject.SPRITE.IDLE1, FireBarObject.SPRITE.IDLE2, FireBarObject.SPRITE.IDLE3]
}];
for (_0x1bec55 = 0x0; _0x1bec55 < FireBarObject.STATE_LIST.length; _0x1bec55++) FireBarObject.STATE[FireBarObject.STATE_LIST[_0x1bec55].NAME] = FireBarObject.STATE_LIST[_0x1bec55], FireBarObject.STATE[FireBarObject.STATE_LIST[_0x1bec55].ID] = FireBarObject.STATE_LIST[_0x1bec55];
FireBarObject.prototype.update = function() {};
FireBarObject.prototype.step = function() {
    this.anim++;
    this.sprite = this.state.SPRITE[parseInt(this.anim / FireBarObject.ANIMATION_RATE) % this.state.SPRITE.length];
    this.control();
    this.interaction();
};
FireBarObject.prototype.control = function() {
    this.rot += customSpeed(this.speed);
};
FireBarObject.prototype.interaction = function() {
    var _0x7617b0 = vec2.normalize(vec2.make(Math.sin(-this.anim / customSpeed(this.speed)), Math.cos(-this.anim / customSpeed(this.speed)))),
        _0x258ff9 = this.game.getPlayer();
    if (_0x258ff9 && _0x258ff9.isTangible() && _0x258ff9.level === this.level && _0x258ff9.zone === this.zone)
        for (var _0x373060 = 0x0; _0x373060 < this.size; _0x373060++) {
            var _0x2ff265 = vec2.add(vec2.add(this.pos, FireBarObject.OFFSET), vec2.scale(_0x7617b0, FireBarObject.SPACING * _0x373060));
            squar.intersection(_0x258ff9.pos, _0x258ff9.dim, _0x2ff265, this.dim) && _0x258ff9.damage(this);
        }
};
FireBarObject.prototype.playerCollide = function(_0x385f5f) {};
FireBarObject.prototype.playerStomp = function(_0x4454be) {};
FireBarObject.prototype.playerBump = function(_0x4c1cbf) {};
FireBarObject.prototype.kill = function() {};
FireBarObject.prototype.isTangible = GameObject.prototype.isTangible;
FireBarObject.prototype.destroy = GameObject.prototype.destroy;
FireBarObject.prototype.setState = function(_0xaf8a26) {
    _0xaf8a26 !== this.state && (this.state = _0xaf8a26, this.sprite = _0xaf8a26.SPRITE[0x0], this.anim = 0x0);
};
FireBarObject.prototype.draw = function(_0x4e240c) {
    for (var _0x40d21a = vec2.normalize(vec2.make(Math.sin(-this.anim / customSpeed(this.speed)), Math.cos(-this.anim / customSpeed(this.speed)))), _0x4e0952 = 0x0; _0x4e0952 < this.size; _0x4e0952++) _0x4e240c.push({
        'pos': vec2.add(this.pos, vec2.scale(_0x40d21a, FireBarObject.SPACING * _0x4e0952)),
        'reverse': false,
        'index': this.sprite.INDEX,
        'mode': 0x0
    });
};
GameObject.REGISTER_OBJECT(FireBarObject);