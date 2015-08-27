(function () {
if (typeof Tron === "undefined") {
  window.Tron = {};
}


Tron.cycle = function (startpos,board,dir) {
  this.startpos = startpos;
  this.dir = dir;
  this.segments = [this.startpos];
  this.board = board;
  this.hit = false;
  this.outOfBounds = false;
};


Tron.cycle.prototype.hasCoord = function (coord) {
  for (var i = 0; i < this.segments.length; i++) {
    var seg = this.segments[i];
    if (coord[0] === seg[0] && coord[1] === seg[1]) {
      return true;
    }
  }
  return false;
};


Tron.cycle.prototype.addSeg = function () {
  var lastSeg = this.segments.slice(this.segments.length - 1);
  var seg;
  if (this.dir === "N") {
    seg = [lastSeg[0] + 1, lastSeg[1]];
  } else if (this.dir === "S") {
    seg = [lastSeg[0] - 1, lastSeg[1]];
  } else if (this.dir === "W") {
    seg = [lastSeg[0], lastSeg[1] + 1];
  } else if (this.dir === "E") {
    seg = [lastSeg[0], lastSeg[1] - 1];
  }
  this.segments.push(seg);
};

Tron.cycle.prototype.checkNextMove = function (nextGridPos) {
    if (nextGridPos === "P" || nextGridPos === "A") {
      this.hit = true;
    }
};

Tron.cycle.prototype.inBounds = function (nextSeg) {
  if ((nextSeg[0] < this.board.grid.length && nextSeg[0] > -1) &&
    (nextSeg[1] < this.board.grid.length && nextSeg[1] > -1)) {
    return true;
  } else {
    this.outOfBounds = true;
    return false;
  }
};

Tron.cycle.prototype.move = function () {
  for (var i = this.segments.length - 1; i >= 0; i--) {
    var seg = this.segments[i];
    if (i === 0) {
      var nextSeg;
      if (this.dir === "N") {
        nextSeg = [seg[0] - 1, seg[1]];
      } else if (this.dir === "S") {
        nextSeg = [seg[0] + 1, seg[1]];
      } else if (this.dir === "W") {
        nextSeg = [seg[0], seg[1] - 1];
      } else if (this.dir === "E") {
        nextSeg = [seg[0], seg[1] + 1];
      }
      if (this.inBounds(nextSeg)) {
        var nextVal = this.board.grid[nextSeg[0]][nextSeg[1]];
        this.checkNextMove(nextVal);
        this.segments.unshift(nextSeg);
      }
    }
  }
};


Tron.board = function () {
  this.grid = new Array(70);
  for (var i = 0; i < this.grid.length; i++) {
    this.grid[i] = new Array(70);
  }
  this.cycle = new Tron.cycle([35,50],this,"W");
  this.ai = new Tron.cycle([35,20],this,"E");
  this.update();
};

Tron.board.prototype.update = function () {
  for (var i = 0; i < this.grid.length; i++) {
    for (var j = 0; j < this.grid.length; j++) {
      if (this.cycle.hasCoord([i,j]) && this.ai.hasCoord([i,j])) {
        this.grid[i][j] = "I";
      } else if (this.cycle.hasCoord([i,j])) {
        this.grid[i][j] = "P";
      } else if (this.ai.hasCoord([i,j])) {
        this.grid[i][j] = "A";
      } else {
        this.grid[i][j] = ".";
      }
    }
  }
};

Tron.board.prototype.isGameOver = function () {
  if (this.cycleHitEdge() || this.cycleHit() || this.tied()) {
    return true;
  } else {
    return false;
  }
};

Tron.board.prototype.tied = function () {
  var that = this;
  var cycSegs = this.cycle.segments;
  var aiSegs = this.ai.segments;
  for (var i = 0; i < cycSegs.length; i++) {
    for (var j = 0; j < aiSegs.length; j++) {
      if (cycSegs[i][0] === aiSegs[j][0] && cycSegs[i][1] === aiSegs[j][1]) {
        that.cycle.hit = true;
        that.ai.hit = true;
        return true;
      }
    }
  }
  return false;
};

Tron.board.prototype.cycleHit = function () {
  if (this.cycle.hit === true || this.ai.hit === true) {
    return true;
  } else {
    return false;
  }
};

Tron.board.prototype.cycleHitEdge = function () {
  if (this.cycle.outOfBounds === false && this.ai.outOfBounds === false) {
    return false;
  } else {
    return true;
  }
};






})();
