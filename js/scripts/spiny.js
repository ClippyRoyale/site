"use strict";

function SpinyObject(game, level, zone, pos, oid) {
    GameObject.call(this, game, level, zone, pos);
    this.oid = oid;
    this.variant = 0x0;
    this.setState(SpinyObject.STATE.RUN);
    this.bonkTimer = this.deadTimer = this.anim = 0x0;
    this.dim = vec2.make(0x1, 0x1);
    this.fallSpeed = this.moveSpeed = 0x0;
    this.disabled = this.grounded = false;
    this.disabledTimer = 0x0;
    this.proxHit = false;
    this.dir = true;
    this.disable();
}
SpinyObject.ASYNC = false;
SpinyObject.ID = 0x17;
SpinyObject.NAME = "SPINY SHELL";
SpinyObject.ANIMATION_RATE = 0x5;
SpinyObject.VARIANT_OFFSET = 0x70;
SpinyObject.ENABLE_FADE_TIME = 0xf;
SpinyObject.ENABLE_DIST = 0x1a;
SpinyObject.DEAD_TIME = 0xf;
SpinyObject.BONK_TIME = 0x5a;
SpinyObject.BONK_IMP = vec2.make(0.25, 0.4);
SpinyObject.BONK_DECEL = 0.925;
SpinyObject.BONK_FALL_SPEED = 0.5;
SpinyObject.MOVE_SPEED_MAX = 0.075;
SpinyObject.FALL_SPEED_MAX = 0.35;
SpinyObject.FALL_SPEED_ACCEL = 0.085;
SpinyObject.SPRITE = {};
SpinyObject.SPRITE_LIST = [{
    'NAME': "RUN0",
    'ID': 0x0,
    'INDEX': 166
}, {
    'NAME': "RUN1",
    'ID': 0x1,
    'INDEX': 167
}, {
    'NAME': "FALL",
    'ID': 0x2,
    'INDEX': 166
}, {
    'NAME': "DEAD",
    'ID': 0x3,
    'INDEX': 166
}];
for (_0x1bec55 = 0x0; _0x1bec55 < SpinyObject.SPRITE_LIST.length; _0x1bec55++) SpinyObject.SPRITE[SpinyObject.SPRITE_LIST[_0x1bec55].NAME] = SpinyObject.SPRITE_LIST[_0x1bec55], SpinyObject.SPRITE[SpinyObject.SPRITE_LIST[_0x1bec55].ID] = SpinyObject.SPRITE_LIST[_0x1bec55];
SpinyObject.STATE = {};
SpinyObject.STATE_LIST = [{
    'NAME': "RUN",
    'ID': 0x0,
    'SPRITE': [SpinyObject.SPRITE.RUN0, SpinyObject.SPRITE.RUN1]
}, {
    'NAME': "FALL",
    'ID': 0x1,
    'SPRITE': [SpinyObject.SPRITE.FALL]
}, {
    'NAME': "DEAD",
    'ID': 0x50,
    'SPRITE': [SpinyObject.SPRITE.DEAD]
}, {
    'NAME': "BONK",
    'ID': 0x51,
    'SPRITE': []
}];
for (_0x1bec55 = 0x0; _0x1bec55 < SpinyObject.STATE_LIST.length; _0x1bec55++) SpinyObject.STATE[SpinyObject.STATE_LIST[_0x1bec55].NAME] = SpinyObject.STATE_LIST[_0x1bec55], SpinyObject.STATE[SpinyObject.STATE_LIST[_0x1bec55].ID] = SpinyObject.STATE_LIST[_0x1bec55];
SpinyObject.prototype.update = function (_0x30228e) {
    switch (_0x30228e) {
        case 0x0:
            this.kill();
            break;
        case 0x1:
            this.bonk();
            break;
        case 0xa0:
            this.enable();
    }
};
SpinyObject.prototype.step = function () {
    this.disabled ? this.proximity() : (0x0 < this.disabledTimer && this.disabledTimer--, this.state === SpinyObject.STATE.BONK ? this.bonkTimer++ > SpinyObject.BONK_TIME || 0x0 > this.pos.y + this.dim.y ? this.destroy() : (this.pos = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed)), this.moveSpeed *= SpinyObject.BONK_DECEL, this.fallSpeed = Math.max(this.fallSpeed - SpinyObject.FALL_SPEED_ACCEL, -SpinyObject.BONK_FALL_SPEED)) : (this.anim++, this.sprite = this.state.SPRITE[parseInt(this.anim / SpinyObject.ANIMATION_RATE) % this.state.SPRITE.length], this.state === SpinyObject.STATE.DEAD ? this.deadTimer++ < SpinyObject.DEAD_TIME || this.destroy() : (this.control(), this.physics(), this.sound(), 0x0 > this.pos.y && this.destroy())));
};
SpinyObject.prototype.control = function () {
    this.moveSpeed = this.dir ? -SpinyObject.MOVE_SPEED_MAX : SpinyObject.MOVE_SPEED_MAX;
    this.grounded ? this.setState(SpinyObject.STATE.RUN) : this.setState(SpinyObject.STATE.FALL);
};
/*SpinyObject.prototype.physics = function () {
    this.grounded && (this.fallSpeed = 0x0);
    this.fallSpeed = Math.max(this.fallSpeed - SpinyObject.FALL_SPEED_ACCEL, -SpinyObject.FALL_SPEED_MAX);
    var _0x482f3b = vec2.add(this.pos, vec2.make(this.moveSpeed, 0x0)),
        _0x443a52 = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed)),
        _0x44dd07 = vec2.make(0x0 <= this.moveSpeed ? this.pos.x : this.pos.x + this.moveSpeed, 0x0 >= this.fallSpeed ? this.pos.y : this.pos.y + this.fallSpeed),
        _0x39b88d = vec2.make(this.dim.y + Math.abs(this.moveSpeed), this.dim.y + Math.abs(this.fallSpeed)),
        _0x44dd07 = this.game.world.getZone(this.level, this.zone).getTiles(_0x44dd07, _0x39b88d),
        _0x39b88d = vec2.make(0x1, 0x1),
        _0x5c888e = false;
    this.grounded = false;
    for (var _0x3c302a = 0x0; _0x3c302a < _0x44dd07.length; _0x3c302a++) {
        var _0x1a430b = _0x44dd07[_0x3c302a];
        _0x1a430b.definition.COLLIDE && squar.intersection(_0x1a430b.pos, _0x39b88d, _0x482f3b, this.dim) && (this.pos.x <= _0x482f3b.x && _0x482f3b.x + this.dim.x > _0x1a430b.pos.x ? (_0x482f3b.x = _0x1a430b.pos.x - this.dim.x, _0x443a52.x = _0x482f3b.x, this.moveSpeed = 0x0, _0x5c888e = true) : this.pos.x >= _0x482f3b.x && _0x482f3b.x < _0x1a430b.pos.x + _0x39b88d.x && (_0x482f3b.x = _0x1a430b.pos.x + _0x39b88d.x, _0x443a52.x = _0x482f3b.x, this.moveSpeed = 0x0, _0x5c888e = true));
    }
    for (_0x3c302a = 0x0; _0x3c302a < _0x44dd07.length; _0x3c302a++) _0x1a430b = _0x44dd07[_0x3c302a], _0x1a430b.definition.COLLIDE && squar.intersection(_0x1a430b.pos, _0x39b88d, _0x443a52, this.dim) && (this.pos.y >= _0x443a52.y && _0x443a52.y < _0x1a430b.pos.y + _0x39b88d.y ? (_0x443a52.y = _0x1a430b.pos.y + _0x39b88d.y, this.fallSpeed = 0x0, this.grounded = true) : this.pos.y <= _0x443a52.y && _0x443a52.y + this.dim.y > _0x1a430b.pos.y && (_0x443a52.y = _0x1a430b.pos.y - this.dim.y, this.fallSpeed = 0x0));
    this.pos = vec2.make(_0x482f3b.x, _0x443a52.y);
    _0x5c888e && (this.dir = !this.dir);
};*/

SpinyObject.prototype.physics = function() {
    if(this.grounded) {
      this.fallSpeed = 0;
    }
    this.fallSpeed = Math.max(this.fallSpeed - SpinyObject.FALL_SPEED_ACCEL, -SpinyObject.FALL_SPEED_MAX);
    
    var movx = vec2.add(this.pos, vec2.make(this.moveSpeed, 0.));
    var movy = vec2.add(this.pos, vec2.make(this.moveSpeed, this.fallSpeed));
    
    var ext1 = vec2.make(this.moveSpeed>=0?this.pos.x:this.pos.x+this.moveSpeed, this.fallSpeed<=0?this.pos.y:this.pos.y+this.fallSpeed);
    var ext2 = vec2.make(this.dim.y+Math.abs(this.moveSpeed), this.dim.y+Math.abs(this.fallSpeed));
    var tiles = this.game.world.getZone(this.level, this.zone).getTiles(ext1, ext2);
    var tdim = vec2.make(1., 1.);
    
    var changeDir = false;
    this.grounded = false;
    for(var i=0;i<tiles.length;i++) {
      var tile = tiles[i];
      if(!tile.definition.COLLIDE) { if (!tile.definition.WARP) continue; }
      
      var hitx = squar.intersection(tile.pos, tdim, movx, this.dim);
      
      if(hitx) {
        if (tile.definition.WARP) { tile.definition.TRIGGER(this.game, this.pid, tile, this.level, this.zone, tile.pos.x, tile.pos.y, 0x69, this); continue; }

        if(this.pos.x <= movx.x && movx.x + this.dim.x > tile.pos.x) {
          movx.x = tile.pos.x - this.dim.x;
          movy.x = movx.x;
          this.moveSpeed = 0;
          changeDir = true;
        }
        else if(this.pos.x >= movx.x && movx.x < tile.pos.x + tdim.x) {
          movx.x = tile.pos.x + tdim.x;
          movy.x = movx.x;
          this.moveSpeed = 0;
          changeDir = true;
        }
      }
    }
      
    for(var i=0;i<tiles.length;i++) {
      var tile = tiles[i];
      if(!tile.definition.COLLIDE) { continue; }
      
      var hity = squar.intersection(tile.pos, tdim, movy, this.dim);
      
      if(hity) {
        if(this.pos.y >= movy.y && movy.y < tile.pos.y + tdim.y) {
          movy.y = tile.pos.y + tdim.y;
          this.fallSpeed = 0;
          this.grounded = true;
        }
        else if(this.pos.y <= movy.y && movy.y + this.dim.y > tile.pos.y) {
          movy.y = tile.pos.y - this.dim.y;
          this.fallSpeed = 0;
        }
      }
    }
    this.pos = vec2.make(movx.x, movy.y);
    if(changeDir) { this.dir = !this.dir; }
};

SpinyObject.prototype.warp = function(warpId) {
    var warp = this.game.world.getLevel(this.level).getWarp(warpId);

    if (warp) {
        this.level = warp.level;
        this.zone = warp.zone;
        console.log(this.pos, warp.pos)
        this.pos = warp.pos;
        console.log(this.pos, warp.pos)
        this.grounded = false;
    }
};

SpinyObject.prototype.sound = GameObject.prototype.sound;
SpinyObject.prototype.proximity = function () {
    var _0xc67304 = this.game.getPlayer();
    _0xc67304 && !_0xc67304.dead && _0xc67304.level === this.level && _0xc67304.zone === this.zone && !this.proxHit && vec2.distance(_0xc67304.pos, this.pos) < SpinyObject.ENABLE_DIST && (this.game.out.push(NET020.encode(this.level, this.zone, this.oid, 0xa0)), this.proxHit = true);
};
SpinyObject.prototype.enable = function () {
    this.disabled && (this.disabled = false, this.disabledTimer = SpinyObject.ENABLE_FADE_TIME);
};
SpinyObject.prototype.disable = function () {
    this.disabled = true;
};
SpinyObject.prototype.damage = function (_0x5b7e53) {
    this.dead || (this.bonk(), this.game.out.push(NET020.encode(this.level, this.zone, this.oid, 0x1)));
};
SpinyObject.prototype.bonk = function () {
    this.dead || (this.setState(SpinyObject.STATE.BONK), this.moveSpeed = SpinyObject.BONK_IMP.x, this.fallSpeed = SpinyObject.BONK_IMP.y, this.dead = true, this.play("kick.mp3", 0x1, 0.04));
};
SpinyObject.prototype.playerCollide = function (player) {
    this.dead || this.garbage || player.damage(this);
};
SpinyObject.prototype.playerStomp = SpinyObject.prototype.playerCollide;
SpinyObject.prototype.playerBump = SpinyObject.prototype.playerCollide;

SpinyObject.prototype.kill = function () {
    this.dead = true;
    this.setState(SpinyObject.STATE.DEAD);
    this.play("stomp.mp3", 0x1, 0.04);
};
SpinyObject.prototype.destroy = GameObject.prototype.destroy;
SpinyObject.prototype.isTangible = GameObject.prototype.isTangible;
SpinyObject.prototype.setState = function (_0x4fe620) {
    _0x4fe620 !== this.state && (this.state = _0x4fe620, 0x0 < _0x4fe620.SPRITE.length && (this.sprite = _0x4fe620.SPRITE[0x0]), this.anim = 0x0);
};
SpinyObject.prototype.draw = function (_0xa69c24) {
    if (!this.disabled) {
        var _0x57b370;
        _0x57b370 = this.state === SpinyObject.STATE.BONK ? 0x3 : 0x0 < this.disabledTimer ? 0xa0 + parseInt(0x20 * (0x1 - this.disabledTimer / SpinyObject.ENABLE_FADE_TIME)) : 0x0;
        if (this.sprite.INDEX instanceof Array)
            for (var _0x2d049f = this.sprite.INDEX, _0x2e81c8 = 0x0; _0x2e81c8 < _0x2d049f.length; _0x2e81c8++)
                for (var _0x28feb8 = 0x0; _0x28feb8 < _0x2d049f[_0x2e81c8].length; _0x28feb8++) {
                    var _0x14ac9a = _0x2d049f[_0x57b370 ? _0x2d049f.length - 0x1 - _0x2e81c8 : _0x2e81c8][_0x28feb8];
                    switch (this.variant) {
                        case 0x1:
                            _0x14ac9a += SpinyObject.VARIANT_OFFSET;
                    }
                    _0xa69c24.push({
                        'pos': vec2.add(this.pos, vec2.make(_0x28feb8, _0x2e81c8)),
                        'reverse': !this.dir,
                        'index': _0x14ac9a,
                        'mode': _0x57b370
                    });
                } else {
            _0x14ac9a = this.sprite.INDEX;
            switch (this.variant) {
                case 0x1:
                    _0x14ac9a += SpinyObject.VARIANT_OFFSET;
            }
            _0xa69c24.push({
                'pos': this.pos,
                'reverse': !this.dir,
                'index': _0x14ac9a,
                'mode': _0x57b370
            });
        }
    }
};
SpinyObject.prototype.play = GameObject.prototype.play;
GameObject.REGISTER_OBJECT(SpinyObject);