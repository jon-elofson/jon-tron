(function () {
  if (typeof Tron === "undefined") {
    window.Tron = {};
  }

  var ai = window.Tron.ai = function (board) {
    this.board = board;
    this.cycle = this.board.ai;
    this.firstDirs = ["E","N","S"];
  };

  Tron.ai.prototype.dirOptions = function (pos) {
    var nPos = [pos[0] - 1, pos[1]];
    var sPos = [pos[0] + 1, pos[1]];
    var wPos = [pos[0], pos[1] - 1];
    var ePos = [pos[0], pos[1] + 1];
    return {"N": nPos,"S":sPos,"W": wPos, "E":ePos};
  };

  Tron.ai.prototype.findMoves = function (options) {
    var currPos = this.cycle.segments[0];
    var validOptions = [];
    var wallHugs = [];
    var counts = [];
    var that = this;
    for (var opt in options) {
      var pos = options[opt];
      if (that.outOfBounds(pos) === false) {
        if (that.isSpaceOccupied(pos) === false) {
          validOptions.push(opt);
          if (that.isWallHug(pos)) {
            wallHugs.push(opt);
          }
          var optArea = this.countArea(pos,currPos);
          counts.push([opt,optArea]);
        }
      }
    }
    return {'validOptions': validOptions, 'wallHugs': wallHugs,
    'counts': counts};
  };

  Tron.ai.prototype.makeWallHug = function (wallHugs,bestCounts,options) {
    var cDir = this.cycle.dir;
    var random = Math.random();
    if (wallHugs.indexOf(cDir) !== -1 && bestCounts.indexOf(cDir) !== -1 && random < 0.9) {
        return cDir;
      } else {
        for (var i = 0; i < bestCounts.length; i++) {
          if (wallHugs.indexOf(bestCounts[i]) !== -1) {
            return bestCounts[i];
          }
      }
      var hugSelection = Math.floor(Math.random() * wallHugs.length);
      if (this.losingPosition(options[wallHugs[hugSelection]]) === false) {
        return wallHugs[hugSelection];
      }
    }
  };

  Tron.ai.prototype.decideDir = function () {
    var currPos = this.cycle.segments[0];
    var options = this.dirOptions(currPos);
    var moves = this.findMoves(options);
    var validOptions = moves['validOptions'];
    var wallHugs = moves['wallHugs'];
    var counts = moves['counts'];
    if (counts.length === 0) { return this.cycle.dir; }
    var bestCounts = this.findHighestCount(counts);
    var cDir = this.cycle.dir;
    var random = Math.random();
    if (wallHugs.length > 0 && random < 0.999) {
      var wh = this.makeWallHug(wallHugs,bestCounts,options);
      if (wh) {
        return wh;
      }
    }
    if (bestCounts.indexOf(cDir) !== -1 && random < 0.9995) {
        return cDir;
      } else {
        var selection = Math.floor(Math.random() * bestCounts.length);
        return bestCounts[selection];
      }
  };

  Tron.ai.prototype.losingPosition = function (pos) {
    var otherPlayer = this.board.cycle.segments[0];
    if (otherPlayer[0] === pos[0] && otherPlayer[1] === pos[1]) { return true;}
    var options = this.dirOptions(pos);
    var result = false;
    for (var opt in options) {
      var val = options[opt];
      if (otherPlayer[0] === val[0] && otherPlayer[1] === val[1]) {
        result = true;
      }
    }
    return result;
  };

  Tron.ai.prototype.findHighestCount = function (counts) {
    var sortedCounts = counts.sort(function (a,b) {
      return b[1] - a[1];
    });
    var bestOptions = [];
    var highestCount = sortedCounts[0][1];
    for (var i = 0; i < sortedCounts.length; i++) {
      if (sortedCounts[i][1] === highestCount) {
        bestOptions.push(sortedCounts[i]);
      }
    }
    if (bestOptions.length > 0) {
      var dirs = this.findDirs(bestOptions);
      return dirs;
    } else {
      return [];
    }
  };

  Tron.ai.prototype.findDirs = function (opts) {
    dirs = [];
    opts.forEach(function (opt) {
      dirs.push(opt[0]);
    });
    return dirs;
  };


  Tron.ai.prototype.outOfBounds = function (pos) {
    var that = this;
    var result = false;
    pos.forEach( function (coord) {
      if (coord < 0 || coord >= that.board.grid.length) {
        result = true;
      }
    });
    return result;
  };

  Tron.ai.prototype.isSpaceOccupied = function (pos) {
    var boardVal = this.board.grid[pos[0]][pos[1]];
    if (boardVal === "A" || boardVal === "P") {
      return true;
    } else {
      return false;
    }
  };

  Tron.ai.prototype.isWallHug = function (position) {
    var options = this.dirOptions(position);
    var wallHug = false;
    var openPos = false;
    var that = this;
    var cpos = this.cycle.segments[0];
    for (var opt in options) {
      var pos = options[opt];
      if (that.outOfBounds(pos)) {
        wallHug = true;
      } else if (that.isSpaceOccupied(pos) && that.notLastPos(pos,cpos)) {
        wallHug = true;
      } else if (that.isSpaceOccupied(pos) === false) {
        openPos = true;
      }
    }
    if (wallHug && openPos) {
      return true;
    } else {
      return false;
    }
  };

  Tron.ai.prototype.notLastPos = function (pos,cpos) {
    if (pos[0] === cpos[0] && pos[1] === cpos[1]) {
      return false;
    } else {
      return true;
    }
  };

  Tron.ai.prototype.findLeft = function (pos) {
    var result = 0;
  };

  Tron.ai.prototype.findRight = function (pos) {
    var result = 0;

  };

  Tron.ai.prototype.findTop = function (pos) {
    var result = 0;
  };

  Tron.ai.prototype.findBottom = function (pos) {
    var result = 0;
  };

  Tron.ai.prototype.countArea = function (optPos,lastPos) {
    if (this.outOfBounds(optPos) || this.isSpaceOccupied(optPos)) {
      return 0;
    }
    var result = 0;
    var that = this;
    var left = this.findLeft(pos);
    var right = this.findRight(pos);
    var top = this.findTop(pos);
    var bottom = this.findBottom(pos);
    var area = (left + right) * (top + bottom);
    return area;

    // var options = this.dirOptions(optPos);
    // for (var opt in options) {
    //   var pos = options[opt];
    //   if (that.outOfBounds(pos) === false) {
    //     var boardVal = that.board.grid[pos[0]][pos[1]];
    //     if (this.notLastPos(pos,lastPos) && boardVal === ".") {
    //       result += 1;
    //       }
    //   }
    // }
    // return result;
  };





})();
