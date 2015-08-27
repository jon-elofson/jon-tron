(function () {
  if (typeof Tron === "undefined") {
    window.Tron = {};
  }

  var ai = window.Tron.ai = function (board) {
    this.board = board;
    this.cycle = this.board.ai;
  };

  Tron.ai.prototype.decideDir = function () {
    var seg = this.cycle.segments[0];
    var nPos = [seg[0] - 1, seg[1]];
    var sPos = [seg[0] + 1, seg[1]];
    var wPos = [seg[0], seg[1] - 1];
    var ePos = [seg[0], seg[1] + 1];
    var options = {"N": nPos,"S":sPos,"W":wPos, "E":ePos};
    var validOptions = [];
    var that = this;
    for (var opt in options) {
      var pos = options[opt];
      if (that.outOfBounds(pos) === false) {
        var boardVal = that.board.grid[pos[0]][pos[1]];
        if (boardVal !== "A" && boardVal !== "P") {
          validOptions.push(opt);
        }
      }
    }
    var selection = Math.floor(Math.random() * validOptions.length);
    if (validOptions.indexOf(this.cycle.dir) !== -1 || validOptions.length === 0) {
      return this.cycle.dir;
    } else {
      return validOptions[selection];
    }
  };

  Tron.ai.prototype.outOfBounds = function (pos) {
    var that = this;
    var result = false;
    pos.forEach( function (coord) {
      if (coord < 0 || coord >= that.board.grid.length - 1) {
        result = true;
      }
    });
    return result;
  };


})();
