function FireballObject(game, level, zone, pos, oid, dir, owner, skin) {
    GameObject.call(this, game, level, zone, pos);
    this.owner = owner;
    this.skin = skin;
    this.state = FireballObject.STATE.IDLE;
    this.sprite = this.state.SPRITE[0x0];
    this.deadTimer = this.anim = 0x0;
    this.dim = vec2.make(0.5, 0.5);
    this.fallSpeed = -FireballObject.FALL_SPEED_MAX;
    this.dir = dir;
}
FireballObject.ASYNC = true;
FireballObject.ID = 0xa1;
FireballObject.NAME = "FIREBALL PROJECTILE";
FireballObject.ANIMATION_RATE = 0x2;
FireballObject.SOFFSET = vec2.make(-0.25, -0.25);
FireballObject.DEAD_ANIM_LENGTH = 0x3;
FireballObject.SPEED = 0.475;
FireballObject.BOUNCE_SPEED = 0.375;
FireballObject.FALL_SPEED_MAX = 0.425;
FireballObject.FALL_SPEED_ACCEL = 0.065;
FireballObject.SPRITE = {};
FireballObject.SPRITE_LIST = [{
    'NAME': "IDLE0",
    'ID': 0x0,
    'INDEX': 0x01
}, {
    'NAME': "IDLE1",
    'ID': 0x1,
    'INDEX': 0x02
}, {
    'NAME': "IDLE2",
    'ID': 0x2,
    'INDEX': 0x03
}, {
    'NAME': "IDLE3",
    'ID': 0x3,
    'INDEX': 0x04
}, {
    'NAME': "DEAD0",
    'ID': 0x4,
    'INDEX': 0x0e
}, {
    'NAME': "DEAD1",
    'ID': 0x5,
    'INDEX': 0x0f
}, {
    'NAME': "DEAD2",
    'ID': 0x6,
    'INDEX': 0x1f
}];
for (_0x1bec55 = 0x0; _0x1bec55 < FireballObject.SPRITE_LIST.length; _0x1bec55++) FireballObject.SPRITE[FireballObject.SPRITE_LIST[_0x1bec55].NAME] = FireballObject.SPRITE_LIST[_0x1bec55], FireballObject.SPRITE[FireballObject.SPRITE_LIST[_0x1bec55].ID] = FireballObject.SPRITE_LIST[_0x1bec55];
FireballObject.STATE = {};
FireballObject.STATE_LIST = [{
    'NAME': "IDLE",
    'ID': 0x0,
    'SPRITE': [FireballObject.SPRITE.IDLE0, FireballObject.SPRITE.IDLE1, FireballObject.SPRITE.IDLE2, FireballObject.SPRITE.IDLE3]
}, {
    'NAME': "DEAD",
    'ID': 0x50,
    'SPRITE': [FireballObject.SPRITE.DEAD0, FireballObject.SPRITE.DEAD1, FireballObject.SPRITE.DEAD2]
}];
for (_0x1bec55 = 0x0; _0x1bec55 < FireballObject.STATE_LIST.length; _0x1bec55++) FireballObject.STATE[FireballObject.STATE_LIST[_0x1bec55].NAME] = FireballObject.STATE_LIST[_0x1bec55], FireballObject.STATE[FireballObject.STATE_LIST[_0x1bec55].ID] = FireballObject.STATE_LIST[_0x1bec55];
FireballObject.prototype.update = function(_0x244c91) {};
FireballObject.prototype.step = function() {
    this.state === FireballObject.STATE.DEAD ? this.deadTimer < FireballObject.DEAD_ANIM_LENGTH ? this.sprite = this.state.SPRITE[this.deadTimer++] : this.destroy() : (this.anim++, this.sprite = this.state.SPRITE[parseInt(this.anim / FireballObject.ANIMATION_RATE) % this.state.SPRITE.length], this.control(), this.physics(), this.interaction(), this.sound(), 0x0 > this.pos.y && this.kill());
};
FireballObject.prototype.control = function() {};

FireballObject.prototype.physics = function() {
    var speed = this.dir?FireballObject.SPEED:-FireballObject.SPEED;
    this.fallSpeed = Math.max(this.fallSpeed - FireballObject.FALL_SPEED_ACCEL, -FireballObject.FALL_SPEED_MAX);
    
    var mov = vec2.add(this.pos, vec2.make(speed, this.fallSpeed));
    
    var ext1 = vec2.make(this.pos.x+Math.min(0, speed), this.pos.y+Math.min(0, this.fallSpeed));
    var ext2 = vec2.make(this.dim.x+Math.max(0, speed), this.dim.y+Math.max(0, this.fallSpeed));
    
    var tiles = this.game.world.getZone(this.level, this.zone).getTiles(ext1, ext2);
    var tdim = vec2.make(1., 1.);
    
    var hit = [];
    
    /* Collect likely hits */
    for(var i=0;i<tiles.length;i++) {
      var tile = tiles[i];
      if(!tile.definition.COLLIDE) { continue; }
      
      if(squar.intersection(tile.pos, tdim, mov, this.dim) || squar.intersection(tile.pos, tdim, this.pos, this.dim)) {
        hit.push(tile);
      }
    }
    
    /* Correct X collision */
    var mvx = vec2.make(mov.x, this.pos.y);
    for(var i=0;i<hit.length;i++) {
      var tile = hit[i];

      if (tile.definition.ICE) {
        tile.definition.TRIGGER(this.game, this.pid, tile, this.level, this.zone, tile.pos.x, tile.pos.y, td32.TRIGGER.TYPE.FIREBALL, this);
      }

      if(!squar.intersection(tile.pos, tdim, mvx, this.dim) || tile.definition.HIDDEN) { continue; }
      if(tile.definition.PLATFORM) continue;

      /* +X */
      if(mvx.x + (this.dim.x*.5) < tile.pos.x + (tdim.x*.5)) {
        mvx.x = tile.pos.x - this.dim.x;
        this.kill();
      }
      /* -X */
      else {
          mvx.x = tile.pos.x + tdim.x;
          this.kill();
      }
    }
    
    mov.x = mvx.x;
    
    /* Correct Y collision */
    for(var i=0;i<hit.length;i++) {
      var tile = hit[i];
      if(!squar.intersection(tile.pos, tdim, mov, this.dim) || tile.definition.HIDDEN) { continue; }
      var hitx = (mvx.x + (this.dim.x*.5) < tile.pos.x + (tdim.x*.5))

      if (squar.intersection(tile.pos, tdim, mvx, this.dim) && tile.definition.PLATFORM) { continue; }

      /* -Y */
      if(this.pos.y >= mov.y) {
        mov.y = tile.pos.y + tdim.y;
        this.fallSpeed = FireballObject.BOUNCE_SPEED;
      }
      /* +Y */
      else {
        mov.y = tile.pos.y - this.dim.y;
        this.fallSpeed = -FireballObject.BOUNCE_SPEED;
      }
    }
  
    this.pos = mov;
};

FireballObject.prototype.interaction = function() {
    for (var _0x51d7a3 = 0x0; _0x51d7a3 < this.game.objects.length; _0x51d7a3++) {
        var _0x1f6129 = this.game.objects[_0x51d7a3];
        if (_0x1f6129 !== this && _0x1f6129.pid !== this.owner && _0x1f6129.isTangible() && (!(_0x1f6129 instanceof PlayerObject) || app.net.gameMode === 1) && _0x1f6129.damage && _0x1f6129.level === this.level && _0x1f6129.zone === this.zone && squar.intersection(_0x1f6129.pos, _0x1f6129.dim, this.pos, this.dim)) {
            (app.net.gameMode !== 1 ? this.owner === this.game.pid : (_0x1f6129 instanceof PlayerObject ? _0x1f6129.pid == this.game.pid : this.owner === this.game.pid)) && _0x1f6129.damage(this);
            if (app.net.gameMode === 1 && _0x1f6129 instanceof PlayerObject && _0x1f6129.pid == this.game.pid && _0x1f6129.dead) this.game.out.push(NET017.encode(this.owner, 0x2));
            this.kill();
            break;
        }
    }
};
FireballObject.prototype.sound = GameObject.prototype.sound;
FireballObject.prototype.playerCollide = function(_0x596050) {};
FireballObject.prototype.playerStomp = function(_0x282b15) {};
FireballObject.prototype.playerBump = function(_0xad5318) {};
FireballObject.prototype.kill = function() {
    this.setState(FireballObject.STATE.DEAD);
    this.play("firework.mp3", 0.7, 0.04);
    this.dead = true;
};
FireballObject.prototype.isTangible = GameObject.prototype.isTangible;
FireballObject.prototype.destroy = GameObject.prototype.destroy;
FireballObject.prototype.setState = function(_0x37987d) {
    _0x37987d !== this.state && (this.state = _0x37987d, this.sprite = _0x37987d.SPRITE[0x0], this.anim = 0x0);
};
FireballObject.prototype.draw = function(_0x12ec20) {
    _0x12ec20.push({
        'pos': vec2.add(this.pos, FireballObject.SOFFSET),
        'reverse': false,
        'index': this.sprite.INDEX,
        'skin': this.skin,
        'mode': 0x0
    });
};
FireballObject.prototype.play = GameObject.prototype.play;
GameObject.REGISTER_OBJECT(FireballObject);