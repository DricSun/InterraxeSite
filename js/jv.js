// Machine translation because I'm not good at English!

//------------------------------------
// CONFIG
//------------------------------------

// デフォルトの武器
// Default weapon
var WEPON_DEFAULT = {
    // 武器の名前
    // Weapon name
    name: 'NORMAL BEAM',
    // 与えるダメージ 0~1
    // Damage dealt 0 ~ 1
    power: 0.3, 
    // 弾のスピード
    // Bullet speed
    speed: 3, 
    // 弾の長さ
    // Bullet length
    length: 10,
    // 弾の幅
    // Bullet width
    width: 1,
    // 弾の色, 特殊武器の場合アイテムの色に反映される, CSS カラーで指定
    // The color of the bullet, in the case of special weapons, reflected in the color of the item, specified by CSS color
    color: 'white',
    // 連射速度
    // Fire rate
    shootingInterval: 1000 * 0.35, 
    // 貫通弾か示す
    // true の場合着弾しても消滅しない
    // explosion を指定した場合はそちらが優先される
    // Indicates whether the bullet
    // If true, will not disappear even if it lands
    // If explosion is specified, it takes precedence.
    through: false,
    // 爆発による着弾後の範囲攻撃
    // 以下のプロパティを持つオブジェクトで指定する
    // { range: 爆発範囲, speed: 爆発の速度 }
    // * 範囲攻撃の威力は武器の基本威力の半分
    // Range attack after landing due to explosion
    // Specify with an object that has the following properties:
    // { range: Explosion range, speed: Explosion speed }
    // * The power of range attacks is half the basic power of weapons
    explosion: false
  };
  
  // 特殊武器の配列, UFO を撃破するとランダムで出現する
  // Special weapon array, Randomly appear when you destroy a UFO
  var WEPON_SPECIAL = [
  {
    name: 'TINY BEAM',
    power: 0.1,
    speed: 10,
    length: 5,
    width: 1,
    color: 'rgb(131, 224, 8)',
    shootingInterval: 1000 * 0.1,
    through: false,
    explosion: false
  },
  {
    name: 'BLASTER',
    power: 1,
    speed: 3,
    length: 15,
    width: 3,
    color: 'rgb(244, 0, 122)',
    shootingInterval: 1000 * 0.3,
    through: false,
    explosion: false
  },
  {
    name: 'LASER',
    power: 0.2,
    speed: 35,
    length: 200,
    width: 2,
    color: 'rgb(138, 227, 252)',
    shootingInterval: 1000 * 0.6,
    through: true,
    explosion: false
  },
  {
    name: 'EXPLOSION BEAM',
    power: 0.15,
    speed: 15,
    length: 10,
    width: 2,
    color: 'rgb(255, 153, 0)',
    shootingInterval: 1000 * 0.5,
    through: false,
    explosion: {
      range: 100,
      speed: 4.5
    }
  }/*
  ,{
    name: 'INSANE BEAM',
    power: 0.035,
    speed: 7.5,
    length: 5,
    color: 'rgb(255, 246, 0)',
    width: 2,
    shootingInterval: 1000 * 0.015,
    through: true,
    explosion: false,
    explosion: {
      range: 75,
      speed: 2
    }
  }//*/
  ];
  
  var ASTEROID_MAX_SIZE = 80; // 小惑星の最大サイズ
  var ASTEROID_MIN_SIZE = 5;　// 小惑星の最小サイズ
  var ASTEROID_MAX_NUM = 75;　// 小惑星の最大数
  var ASTEROID_SPAWN_TIME = 350;　// 小惑星の復活時間
  var SHIP_SPEED = 1.5; // 自機のスピード
  var UFO_SPEED = 2; // UFO のスピード
  var ITEM_SPEED = 0.5; // アイテムのスピード
  
  // UFO の出現率 0~1
  var UFO_INCIDENCE = 0.0035;
  
  // 特殊武器の持続時間
  var SPECIAL_WEPON_TIME = 1000 * 20;
  
  // 各種スコア
  var SCORE = {
    ASTEROID_DAMAGE: 10,
    ASTEROID_DESTROY: 50,
    UFO_DAMAGE: 0,
    UFO_DESTROY: 300
  }
  
  //------------------------------------
  // CONSTANTS
  //------------------------------------
  
  var PI = Math.PI;
  var TWO_PI = PI * 2;
  var DEG_TO_RAD = PI / 180;
  var FPS = 60;
  
  //------------------------------------
  // VARS
  //------------------------------------
  
  var canvas;
  var canvasWidth;
  var canvasHeight;
  var context;
  var mouse;
  var isMouseDown = false;
  var ship; // Ship
  var beams; // Collection of Beam
  var asteroids; // Collection of Asteroid
  var splinters; // Collection of Splinter
  var debris; // Collection of Debri
  var ufo; // Ufo
  var item; // Item
  var asteroidLastSpawn = 0; // 小惑星が最後に復活した時間
  var ufoLastSpawn = 0; // UFO が最後に復活した時間
  var debriLastSpawn = 0; // 背景の星屑が最後に出現した時間
  var fieldRange; // フィールドの範囲
  var score = 0; // スコア
  var isPlay = false; // ゲームが開始されているか示す
  var dom = {
    menu: null,
    title: null,
    message: null,
    // tweet: null,
    start: null,
    score: null,
    wepon: null
  }
  
  
  //------------------------------------
  // INITIALIZE
  //------------------------------------
  
  function init() {
    canvas = document.getElementById('c');
    fieldRange = new Range();
    
    window.addEventListener('resize', resize, false);
    resize();
    
    mouse = new Point();
    
    dom.menu    = document.getElementById('menu');
    dom.title   = document.getElementById('title');
    dom.message = document.getElementById('message');
    dom.start   = document.getElementById('start');
    dom.score   = document.getElementById('score');
    dom.wepon   = document.getElementById('wepon');
    
    dom.start.addEventListener('click', start, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('click', click, false);
  
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchstart', mouseDown, false);
    canvas.addEventListener('touchend', mouseUp, false);
    
    debris = new Collection();
    for (var i = 0; i < 30; i++) {
      debris.push(new Debri(randInt(canvasWidth)));
    }
      
    setInterval(loop, 1000 / FPS);
  }
  
  
  //------------------------------------
  // EVENT HANDLERS
  //------------------------------------
  
  function resize(e) {
    canvas.width  = canvasWidth  = fieldRange.right  = window.innerWidth;
    canvas.height = canvasHeight = fieldRange.bottom = window.innerHeight;
    
    context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    context.lineWidth = 1;
  }
  
  function start(e) {
    play();
    dom.menu.style.display = 'none';
    e.preventDefault();
  }
  
  function mouseMove(e) { mouse.set(e.clientX, e.clientY); }
  function touchMove(e) { mouse.set(e.touches[0].clientX, e.touches[0].clientY); console.log(e.touches[0].clientX, e.touches[0].clientY) }
  function mouseDown(e) { isMouseDown = true; }
  function mouseUp(e) { isMouseDown = false; }
  function click(e) { if (ship) ship.fire(beams); }
  
  
  //------------------------------------
  // FRAME LOOP
  //------------------------------------
  
  function loop() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    var now = new Date().getTime();
    
    // Spawn Debri
    if (now - debriLastSpawn > 300) {
      debris.push(new Debri(canvasWidth));
      debriLastSpawn = now;
    }
    
    // Debri update
    debris.eachUpdate();
    
    if (isPlay) {
      // Spawn
      
      if (now - asteroidLastSpawn > ASTEROID_SPAWN_TIME && asteroids.length < ASTEROID_MAX_NUM) {
        asteroids.push(Asteroid.spawn());
        asteroidLastSpawn = now;
      }
      
      if (!ufo && !item && Math.random() < UFO_INCIDENCE) {
        ufo = Ufo.spawn();
      }
      
      // Update
      
      if (ship) {
        if (isMouseDown) ship.fire(beams);
        ship.update(mouse);
      }
      
      if (ufo) {
        ufo.update();
        if (ufo.vanished) {
          item = new Item(ufo.x, ufo.y);
          ufo = null;
        } else if (hitDetection(ufo, ship)) {
          gameOver();
        }
      }
      
      if (item) {
        item.update();
        if (item.vanished) {
          item = null;
        } else if (hitDetection(item, ship)) {
          ship.setSpecialWepon(item.wepon);
          item = null;
        }
      }
      
      beams.eachUpdate(function(index, beam) {
        for (var i = 0; i < asteroids.length; i++) {
          asteroid = asteroids[i];
          if (hitDetection(beam, asteroid)) {
            score += asteroid.damage(beam.power, splinters);
            beam.notifyHit();
          }
        }
  
        if (ufo && hitDetection(beam, ufo)) {
          score += ufo.damage(beam.power, splinters);
          beam.notifyHit();
        }
      });
      
      asteroids.eachUpdate(function(index, asteroid) {
        if (hitDetection(asteroid, ship)) {
          gameOver();
        }
      });
      
      splinters.eachUpdate();
      
      // Display
  
      dom.wepon.innerHTML = ship.currentWepon.name;
      dom.score.innerHTML = score;
    }
    
    // Draw
    
    context.beginPath();
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 1;
    if (ship) ship.draw(context);
    if (ufo) ufo.draw(context);
    if (asteroids) asteroids.eachDraw(context);
    context.stroke();
    
    // Beam は個別に描画
    if (beams) beams.eachDraw(context);
    
    if (item) {
      context.beginPath();
      context.strokeStyle = item.wepon.color;
      context.lineWidth = 1;
      item.draw(context);
      context.stroke();
    }
    
    context.beginPath();
    context.fillStyle = 'rgb(255, 255, 255)';
    if (splinters) splinters.eachDraw(context);
    if (debris) debris.eachDraw(context);
    // Game over
    if (ship && ship.died) {
      ship.update();
      ship.splinter.draw(context);
    }
    context.fill();
    
  }
  
  
  //------------------------------------
  // FUNCTIONS
  //------------------------------------
  
  function play() {
    ship = new Ship(canvasWidth / 2, canvasHeight / 2, 8);
    mouse.set(ship.x, ship.y);
    beams = new Collection();
    asteroids = new Collection();
    splinters = new Collection();
    ufo = null;
    item = null;
    score = 0;
    isMouseDown = false;
    isPlay = true;
  }
  
  function gameOver() {
    ship.destroy();
    isPlay = false;
    dom.title.innerHTML = 'GAME OVER!';
    dom.message.innerHTML = 'YOUR SCORE ' + score + ' POINTS<br /><br />' + '<b>HIGHSCORE :<b/> <br /><br />' + 'JACKSON  -  202';
    // dom.message.appendChild(tweetLink());
    dom.menu.style.display = 'block';
  }
  
  // function tweetLink() {
    // var exc = score < 1000 ? '...' : score > 3000 ? '!!!' : '!';
    // if (!dom.tweet) {
      // dom.tweet = document.createElement('a');
      // dom.tweet.id = 'tweet';
      // dom.tweet.innerHTML = 'TWEET YOUR SCORE';
    // }
    // dom.tweet.href = 'https://twitter.com/intent/tweet?url=https://codepen.io/akm2/pen/eYYyELr&text=SCORE ' + score + ' PTS' + exc + ' - ASTEROIDS';
    // dom.tweet.target = '_blank';
    // return dom.tweet;
  // }
  
  // パスの衝突判定を行う
  // 引数に指定するオブジェクトは path プロパティから Path オブジェクトが参照可能であること
  // Perform path collision detection
  // The object specified in the argument can be referenced from the path property.
  function hitDetection(a, b) {
    var ap = a.path, bp = b.path;
    var as, bs; // Segments
    var a1, a2, b1, b2; // Points
    
    for (i = 0, ilen = ap.segmentNum(); i < ilen; i++) {
      as = ap.segment(i);
      a1 = as[0];
      a2 = as[1];
      for (j = 0, jlen = bp.segmentNum(); j < jlen; j++) {
        bs = bp.segment(j);
        b1 = bs[0];
        b2 = bs[1];
        if (intersection(a1, a2, b1, b2)) return true;
      }
    }
    
    return false;
  }
  
  // hitDetection　で使用される直線の交差判定
  // 交差しているなら true
  // Straight line intersection detection used in hitDetection
  // True if they intersect
  function intersection(a1, a2, b1, b2) {
    var ax = a2.x - a1.x, ay = a2.y - a1.y;
    var bx = b2.x - b1.x, by = b2.y - b1.y;
    return (ax * (b1.y - a1.y) - ay * (b1.x - a1.x)) *
         (ax * (b2.y - a1.y) - ay * (b2.x - a1.x)) <= 0 &&
         (bx * (a1.y - b1.y) - by * (a1.x - b1.x)) *
         (bx * (a2.y - b1.y) - by * (a2.x - b1.x)) <= 0;
  }
  
  
  
  //------------------------------------
  // UTILS
  //------------------------------------
  
  function extend() {
    var target = arguments[0] || {}, o, p;
  
    for (var i = 1, len = arguments.length; i < len; i++) {
    o = arguments[i];
  
    if (!isObject(o) || isNull(o)) continue;
  
    for (p in o) {
      target[p] = o[p];
    }
    }
  
    return target;
  };
  
  function randUniform(max, min) {
    if (min === undefined) min = 0;
    return Math.random() * (max - min) + min;
  };
  
  function randInt(max, min) {
    if (min === undefined) min = 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  isObject = function(value) {
    return typeof value === 'object' && value !== null;
  };
  
  isNumber = function(value) {
    return typeof value === 'number';
  };
  
  isNumeric = function(value) {
    return !isNaN(value) && isFinite(value);
  };
  
  isString = function(value) {
    return typeof value === 'string';
  };
  
  isFunction = function(value) {
    return typeof value === 'function';
  };
  
  isArray = function(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };
  
  isNull = function(value) {
    return value === null;
  };
  
  isUndefined = function(value) {
    return typeof value === 'undefined';
  };
  
  
  //------------------------------------
  // CLASSES
  //------------------------------------
  
  /**
   * Collection
   * 
   * @super Array
   */
  function Collection() {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.push(arguments[i]);
    }
  }
  
  Collection.prototype = extend([], {
    eachUpdate: function(callback) {
      for (var i = 0, len = this.length, item; i < len; i++) {
        item = this[i];
  
        if (item.vanished) {
          this.splice(i, 1);
          len--;
          i--;
          continue;
        }
        item.update();
  
        if (callback) callback.call(this, i, item);
      }
    },
    
    eachDraw: function(ctx) {
      for (var i = 0, len = this.length; i < len; i++) {
        this[i].draw(ctx);
      }
    }
  })
  
  
  /**
   * Path
   * 
   * @super Array
   */
  function Path(points, closed) {
    if (isArray(points)) {
      for (var i = 0, len = points.length; i < len; i++) {
        this.push(points[i]);
      }
    }
    
    this.closed = isUndefined(closed) ? true : closed;
  }
  
  Path.prototype = extend([], {
    closed: true,
    
    segment: function(index) {
      if (index > this.segmentNum()) return null;
      return [
        this[index],
        this[index === this.length - 1 ? 0 : index + 1]
      ];
    },
    
    segmentNum: function() {
      return this.closed ? this.length : this.length - 1;
    },
    
    eachSegments: function(callback) {
      for (var i = 0, len = this.segmentNum(); i < len; i++) {
        if (callback.call(this, this.segment(i), i) === false) break;
      }
    },
    
    eachPoints: function(callback) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback.call(this, this[i], i) === false) break;
      }
    },
    
    draw: function(ctx) {
      this.eachPoints(function(p, i) {
        ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
      });
      
      if (this.closed && this.length > 2) {
        var p = this[0];
        ctx.lineTo(p.x, p.y);
      }
    }
  });
  
  
  /**
   * Point
   */
  function Point(x, y) {
    this.set(x, y);
  };
  
  Point.interpolate = function(p1, p2, f) {
    var dx = p2.x - p1.x,
      dy = p2.y - p1.y;
    return new Point(p1.x + dx * f, p1.y + dy * f);
  };
  
  Point.polar = function(length, angle) {
    return new Point(length * Math.cos(angle), length * Math.sin(angle));
  };
  
  Point.prototype = {
    set: function(x, y) {
      if (isObject(x)) {
        y = x.y;
        x = x.x;
      }
    
      this.x = x || 0;
      this.y = y || 0;
    
      return this;
    },
    
    offset: function(x, y) {
      this.x += x || 0;
      this.y += y || 0;
      
      return this;
    },
    
    add: function(p) {
      this.x += p.x;
      this.y += p.y;
      
      return this;
    },
    
    sub: function(p) {
      this.x -= p.x;
      this.y -= p.y;
      
      return this;
    },
    
    scale: function(scale) {
      this.x *= scale;
      this.y *= scale;
      
      return this;
    },
    
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    
    lengthSq: function() {
      return this.x * this.x + this.y * this.y;
    },
    
    normalize: function(thickness) {
      if (isUndefined(thickness)) thickness = 1;
      
      var len = Math.sqrt(this.x * this.x + this.y * this.y);
      var nx = 0, ny = 0;
      
      if (len) {
        nx = this.x / len;
        ny = this.y / len;
      }
      
      this.x = nx * thickness;
      this.y = ny * thickness;
      
      return this;
    },
    
    angle: function() {
      return Math.atan2(this.y, this.x);
    },
    
    angleTo: function(p) {
      var dx = p.x - this.x,
        dy = p.y - this.y;
      return Math.atan2(dy, dx);
    },
    
    distanceTo: function(p) {
      var dx = this.x - p.x,
        dy = this.y - p.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    
    distanceToSq: function(p) {
      var dx = this.x - p.x,
        dy = this.y - p.y;
      return dx * dx + dy * dy;
    },
  
    negate: function() {
      this.x *= -1;
      this.y *= -1;
      
      return this;
    },
    
    eq: function(p) {
      return this.x === p.x && this.y === p.y;
    },
    
    isEmpty: function() {
      return !this.x && !this.y;
    },
  
    clone: function() {
      return new Point(this.x, this.y);
    },
  
    toArray: function() {
      return [this.x, this.y];
    },
  
    toString: function() {
      return '(x:' + this.x + ', y:' + this.y + ')';
    }
  };
  
  
  /**
   * Range
   */
  function Range(left, right, top, bottom) {
    this.left = left || 0;
    this.right = right || 0;
    this.top = top || 0;
    this.bottom = bottom || 0;
  }
  
  Range.prototype = {
    contains: function(x, y, inflate) {
      if (!inflate) inflate = 0;
      return x > this.left - inflate && x < this.right + inflate 
        && y > this.top - inflate && y < this.bottom + inflate;
    }
  };
  
  
  /**
   * Ship
   * 
   * @super Point
   */
  function Ship(x, y, size) {
    Point.call(this, x, y);
    this.size = size; // 船のサイズ
    this.currentWepon = WEPON_DEFAULT;
    // 前回の位置, 弾の射出時にのせるスピードを算出する
    // Calculate the speed at the time of the previous position and bullet firing
    this.latest = this.clone();
    this.path = new Path();
    // 基準点を示すパス, path の回転の基準とする
    // A path indicating a reference point, used as a reference for rotation of path
    this._referencePath = new Path();
    this.v = new Point(); // 移動ベクトル
    
    // 船体の描画点を作成
    // Create hull drawing points
    var d = [0, 140, 180, 220], c, r, p;
    for (var i = 0, len = d.length; i < len; i++) {
      c = DEG_TO_RAD * d[i],
      r = i === 2 ? this.size / 2 : this.size;
      p = Point.polar(r, c).add(this);
      this.path.push(p);
      this._referencePath.push(p.clone());
    }
  }
  
  Ship.prototype = extend(new Point(), {
    angle: 0, // 自機の向き
    possibleShooting: true, // ビームの射出が可能か示す
    specialWeponSetTime: 0, // 特殊武器を設定した時間
    died: false, // 自機が破壊されているか示す
    splinter: null, // 自機の破片
    
    // 特殊武器を設定する
    setSpecialWepon: function(wepon) {
      this.specialWeponSetTime = new Date().getTime();
      this.currentWepon = wepon;
    },
    
    // 自機の破壊, died フラグをたてて自機破片用の Splinter を作成する
    destroy: function() {
      this.died = true;
      this.splinter = new Splinter(this.x, this.y, 100, 100);
    },
    
    // ビームを射出, 射出が可能な場合は引数で渡された Collection に Beam を追加する
    // Beam is emitted, and if injection is possible, Beam is added to the Collection passed as an argument
    fire: function(beams) {
      if (!this.possibleShooting) return false;
      this.possibleShooting = false;
      
      var p = Point.polar(this.size, this.angle).add(this);
      var beam = new Beam(p.x, p.y, this.angle, this.currentWepon);
      
      // 自機のスピードをのせる
      // Put your own speed
      var currentSpeed = this.latest.distanceTo(this);
      if (currentSpeed > SHIP_SPEED) currentSpeed = SHIP_SPEED;
      beam.speed += currentSpeed;
      
      var self = this;
      setTimeout(function() { self.possibleShooting = true; }, beam.shootingInterval);
      
      beams.push(beam);
    },
    
    update: function(mouse) {
      if (this.died) {
        // 破壊されているなら破片を更新
        this.splinter.update();
        return;
      }
      
      this.latest.set(this);
      
      var v = this.v.set(mouse).sub(this);
      var vlen = v.length();
      
      if (vlen > SHIP_SPEED) v.normalize(SHIP_SPEED);
      
      // マウス直前まで移動
      var i, len;
      if (vlen > this.size + 10) {
        this.add(v);
        for (i = 0, len = this.path.length; i < len; i++) {
          this._referencePath[i].add(v);
        }
      }
      
      var angle = this.angle = v.angle();
  
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var p, rp, dx, dy;
  
      for (i = 0, len = this.path.length; i < len; i++) {
        p = this.path[i];
        rp = this._referencePath[i];
        dx = rp.x - this.x;
        dy = rp.y - this.y;
        p.x = this.x + dx * cos - dy * sin;
        p.y = this.y + dx * sin + dy * cos;
      }
      
      if (new Date().getTime() - this.specialWeponSetTime > SPECIAL_WEPON_TIME) {
        this.currentWepon = WEPON_DEFAULT;
      }
    },
    
    draw: function(ctx) {
      if (!this.died) this.path.draw(ctx);
    }
  });
  
  
  /**
   * Beam
   * 
   * @super Point
   */
  function Beam(x, y, angle, wepon) {
    Point.call(this, x, y);
    this.angle = angle;
    
    // 線が短かったり移動が速い場合に当たり判定がとれずにすり抜けてしまう問題を解決するため
    // 当たり判定用の path は前回の後尾位置と現在の先頭位置をとり, 描画用のパスは renderPath とする
    // In order to solve the problem that the hit judgment can not be taken when the line is short or the movement is fast
    // The path for hit detection takes the last position and the current start position, and render path is renderPath
    this.path = new Path([this, this.clone()], false);
    this.renderPath = new Path([this, this.clone()], false);
    
    extend(this, wepon || WEPON_DEFAULT);
  }
  
  Beam.prototype = extend(new Point(), {
    releaseCompleted: false, // 射出完了フラグ
    vanished: false, // 消失フラグ
    exploding: false,
    
    notifyHit: function() {
      if (this.explosion) {
        if (!this.exploding) {
          this.power *= 0.5;
          this.width = 1;
          this.path = this.renderPath = new ExplosionPath(this.x, this.y, this.explosion);
          this.exploding = true;
        }
      } else if (!this.through) {
        this.vanished = true;
      }
    },
    
    update: function() {
      if (this.vanished) return;
      
      if (this.exploding) {
        this.path.update(); // Explosion update
        if (this.path.complete) this.vanished = true;
        return;
      }
      
      var v = Point.polar(this.speed, this.angle);
      var renderTail = this.renderPath[1];
  
      // 画面外に出たら消失
      if (!fieldRange.contains(renderTail.x, renderTail.y)) {
        this.vanished = true;
        return;
      }
      
      // 前回の後尾位置をとる
      this.path[1].set(renderTail);
      // 先頭位置を移動
      this.add(v);
      
      // 射出の判定を行って描画用パスを更新する, 射出が完了するまでは後尾の座標は移動しない
      // 射出の判定を行って描画用パスを更新する, 射出が完了するまでは後尾の座標は移動しない
      if (this.releaseCompleted) {
        // 射出が完了しているなら後尾を移動
        renderTail.add(v);
      } else {
        // Update the drawing path by determining the injection, and the tail coordinate does not move until the injection is completed
        this.releaseCompleted = this.distanceTo(renderTail) > this.length;
        if (this.releaseCompleted) {
          renderTail.set(Point.polar(this.length, this.angle - PI).add(this));
        }
      }
    },
    
    draw: function(ctx) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      this.renderPath.draw(ctx);
      ctx.stroke();
    }
  });
  
  
  /**
   * Explosion
   * 
   * @super Path
   */
  function ExplosionPath(x, y, options) {
    this.x = x;
    this.y = y;
    extend(this, options);
  }
  
  ExplosionPath.prototype = extend(new Path(), {
    currentRange: 0,
    complete: false,
    
    update: function() {
      if (this.complete) return;
      
      this.currentRange += this.speed * 2;
      
      if (this.currentRange > this.range) {
        this.currentRange = this.range;
        this.complete = true;
      }
      
      for (var i = 0, p; i < 10; i++) {
        p = Point.polar(this.currentRange / 2, TWO_PI / 10 * i).add(this);
        
        // 配列を継承したクラスの場合番地を直接指定しての挿入では length がうまく反映されないので最初は push を使用する
        // In the case of a class that inherits an array, the length is not reflected well in the insertion by specifying the address directly, so push is used first
        if (!this[i]) {
          this.push(p);
        } else {
          this[i] = p;
        }
      }
    }
  });
  
  
  /**
   * Asteroid
   * 
   * @super Point
   */
  function Asteroid(x, y, radius, angle) {
    Point.call(this, x, y);
    this.radius = radius; // 最大半径
    this.angle = angle; // 進行方向の角度
          
    this.make();
  }
  
  // ランダムなパラメータを与えられた新しい Asteroid オブジェクトを返す
  // 出現場所は画面外で画面内へ侵入する進行角度を持つ
  // Returns a new Asteroid object with random parameters
  // Appearance location has a traveling angle to enter the screen outside the screen
  Asteroid.spawn = function() {
    var side = randInt(3); // 出現位置をランダムに決定
    var angle = randUniform(PI * 0.5);
    var x, y;
    
    // 0: Left, 1: Right
    if (side === 0 || side === 1) {
      y = randUniform(canvasHeight + ASTEROID_MAX_SIZE, -ASTEROID_MAX_SIZE);
      x = (side === 0) ? - ASTEROID_MAX_SIZE : canvasWidth + ASTEROID_MAX_SIZE;
      angle = (side === 0) ? angle - PI * 0.25 : angle + PI * 0.75;
    }
    // 2: Top, 3: Bottom
    else {
      x = randUniform(canvasWidth + ASTEROID_MAX_SIZE, -ASTEROID_MAX_SIZE);
      y = (side === 2) ? - ASTEROID_MAX_SIZE : canvasHeight + ASTEROID_MAX_SIZE;
      angle = (side === 2) ? angle + PI * 0.25 : angle - PI * 0.75;
    }
    
    // Asteroid.MIN_SIZE ~ ASTEROID_MAX_SIZE の間でランダム
    var radius = randUniform(ASTEROID_MAX_SIZE, ASTEROID_MIN_SIZE);
    return new Asteroid(x, y, radius, angle);
  };
  
  Asteroid.prototype = extend(new Point(), {
    vanished: false,
    make: function() {
      this.v = Point.polar(1, this.angle);
      this.v.normalize((1 - this.radius / ASTEROID_MAX_SIZE) * 1.75 + 0.25);
  
      this.path = new Path();
      for (var i = 0, num = 12, radius; i < num; i++) {
        radius = randUniform(this.radius, this.radius * 0.5);
        this.path.push(Point.polar(radius, TWO_PI * i / num).add(this));
      }
    },
    
    // 与えられた damage 分半径を小さくする, ASTEROID_MIN_SIZE を下回った場合消失
    // damage は 1 までの割合で指定, ASTEROID_MAX_SIZE の係数としてダメージの割合を表現する
    // 引数で渡された Collection に小惑星の大きさを反映した Splinter を追加する
    // Decrease radius by given damage, disappear if it falls below ASTEROID_MIN_SIZE
    // damage is specified as a ratio up to 1, and the damage ratio is expressed as a coefficient of ASTEROID_MAX_SIZE
    // Add a Splinter that reflects the size of the asteroid to the Collection passed as an argument
    damage: function(damage, splinters) { 
      if (damage <= 0) return;
      if (damage > 1) damage = 1;
      
      var radiusTemp = this.radius;
      var debrisNum = Math.round(32 * damage);
      var score = SCORE.ASTEROID_DAMAGE;
      
      this.radius -= ASTEROID_MAX_SIZE * damage;
      
      if (this.radius < ASTEROID_MIN_SIZE) {
        // ASTEROID_MIN_SIZE を下回るなら消失
        this.vanished = true;
        score = SCORE.ASTEROID_DESTROY;
        
      } else {
        // 進行角度を最大 30 度ずらす
        this.angle += DEG_TO_RAD * randUniform(30, -30);
        this.make();
      }
      
      splinters.push(new Splinter(this.x, this.y, radiusTemp, debrisNum));
      
      return score;
    },
    
    update: function() {
      if (this.vanished) return;
      
      // 画面外に出たら消失
      if (!fieldRange.contains(this.x, this.y, ASTEROID_MAX_SIZE + 10)) {
        this.vanished = true;
        return;
      }
      
      var v = this.v;
      this.add(v);
      this.path.eachPoints(function(p, i) { p.add(v); });
    },
    
    draw: function(ctx) {
      this.path.draw(ctx);
    }
  });
  
  
  /**
   * Ufo
   * 
   * @super Point
   */
  function Ufo(x, y) {
    Point.call(this, x, y);
    
    var P = function(px, py) {
      return new Point(x + px, y + py);
    };
    
    this.path = new Path([
      P(-4.5, -5),
      P(4.5, -5),
      P(7, 0), // 2
      P(15, 4.5), // 3
      P(7, 9),
      P(-7, 9),
      P(-15, 4.5), // 6
      P(-7, 0) // 7
    ]);
    
    this.destination = new Point(randUniform(canvasWidth), randUniform(canvasHeight));
    this.v = new Point();
  }
  
  // ランダムなパラメータを与えられた新しい Ufo オブジェクトを返す
  Ufo.spawn = function() {
    var x, y, side = randInt(3); // 出現位置をランダムに決定
    
    // 0: Left, 1: Right
    if (side === 0 || side === 1) {
      y = randUniform(canvasHeight + 30, -30);
      x = (side === 0) ? - 30 : canvasWidth + 30;
    }
    // 2: Top, 3: Bottom
    else {
      x = randUniform(canvasWidth + 30, -30);
      y = (side === 2) ? - 30 : canvasHeight + 30;
    }
    
    return new Ufo(x, y);
  };
  
  Ufo.prototype = extend(new Point(), {
    vanished: false,
    hp: 100, // UFO の HP
    damagedBlink: 0, // ダメージ時の点滅表現のフレームカウント用
    
    damage: function(damage, splinters) { 
      if (damage <= 0) return;
      if (damage > 1) damage = 1;
      
      var splinterRadius = 10;
      var splinterNum = 5;
      var score = SCORE.UFO_DAMAGE;
      
      this.hp -= damage * 100;
      if (this.hp <= 0) {
        this.vanished = true;
        splinterRadius = 25;
        splinterNum = 20;
        score = SCORE.UFO_DESTROY;
      }
      
      splinters.push(new Splinter(this.x, this.y, splinterRadius, splinterNum));
      
      // 4 フレームごとに 1 回　で 10 回点滅
      this.damagedBlink = 40;
      
      return score;
    },
    
    update: function() {
      var v = this.v;
      var destination = this.destination;
      
      v.set(destination).sub(this);
      
      var dist = v.length();
      if (dist > UFO_SPEED) {
        v.normalize(UFO_SPEED);
      } else if (dist < 0.1) {
        destination.set(randUniform(canvasWidth), randUniform(canvasHeight));
      }
      
      this.add(v);
      this.path.eachPoints(function(p, i) { p.add(v); });
    },
    
    draw: function(ctx) {
      if (this.damagedBlink) {
        var off = this.damagedBlink % 4 === 0;
        this.damagedBlink--;
        if (off) return;
      }
      
      var path = this.path;
      path.draw(ctx);
      
      // 内側のライン
      var a1 = path[2], a2 = path[7];
      ctx.moveTo(a1.x, a1.y);
      ctx.lineTo(a2.x, a2.y);
      var b1 = path[3], b2 = path[6];
      ctx.moveTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
    }
  });
  
  
  /**
   * Item
   * 
   * @super Point
   */
  function Item(x, y) {
    Point.call(this, x, y);
    
    var path = this.path = new Path();
    
    var d = TWO_PI / 6;
    for (var i = 0; i < 6; i++) {
      path.push(Point.polar(10, d * i).add(this));
    }
    
    this.wepon = WEPON_SPECIAL[randInt(WEPON_SPECIAL.length - 1)];
    
    this.v = Point.polar(ITEM_SPEED, randUniform(TWO_PI));
  }
  
  Item.prototype = extend(new Point(), {
    update: function() {
      var v = this.v;
      this.add(v);
      this.path.eachPoints(function(p, i) { p.add(v); });
      
      // 画面外に出たら消失
      if (!fieldRange.contains(this.x, this.y, 20)) {
        this.vanished = true;
        return;
      }
    },
    
    draw: function(ctx) {
      this.path.draw(ctx);
      // 対角線を描画
      this.path.eachPoints(function(p, i) {
        if (i === 3) return false;
        ctx.moveTo(p.x, p.y);
        var p2 = this[i + 3];
        ctx.lineTo(p2.x, p2.y);
      });
    }
  });
  
  
  /**
   * Splinter
   * 
   * @super Point
   */
  function Splinter(x, y, radius, num) {
    Point.call(this, x, y);
    
    var values = this._values = [];
    for (var i = 0; i < num; i++) {
      values.push({
        x: x, y: y,
        angle: randUniform(TWO_PI),
        radius: randUniform(radius),
        dist: Math.random()
      });
    }
  
    this._time = new Date().getTime();
  }
  
  Splinter.prototype = extend(new Point(), {
    vanished: false,
    
    update: function() {
      var o, c, r, x, y;
      
      for (var i = 0, len = this._values.length; i < len; i++) {
        o = this._values[i];
        c = o.angle;
        r = o.radius;
        x = o.x = Math.round(this.x + r * Math.cos(c));
        y = o.y = Math.round(this.y + r * Math.sin(c));
        
        // 画面外に出たら消失
        if (!fieldRange.contains(x, y)) {
          this._values.splice(i, 1);
          len--;
          i--;
          continue;
        }
        
        this._values[i].radius += o.dist;
      }
      
      // 破片が全て画面外に消失しているか, 発生から指定時間が経過しているなら消失
      this.vanished = this._values.length === 0 || new Date().getTime() - this._time > 1000 * 7;
    },
    
    draw: function(ctx) {
      for (var i = 0, len = this._values.length, o; i < len; i++) {
        o = this._values[i];
        ctx.rect(o.x, o.y, 1, 1);
      }
    }
  });
  
  
  /**
   * Debri
   * 
   * @super Point
   */
  function Debri(x) {
    Point.call(this, x, randInt(canvasHeight));
    this.speed = randUniform(2, 0.5);
  }
  
  Debri.prototype = extend(new Point(), {
    vanished: false,
    
    update: function() {
      if (this.vanished) return;
      
      // 画面外に出たら消失
      if (this.x < 0) {
        this.vanished = true;
        return;
      }
      
      this.x = Math.round(this.x - this.speed);
    },
    
    draw: function(ctx) {
      ctx.rect(this.x, this.y, 1, 1);
    }
  });
  
  
  // Init
  window.addEventListener('load', init, false);