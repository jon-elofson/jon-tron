(function () {
  if (typeof Tron === "undefined") {
    window.Tron = {};
  }

  var View = window.Tron.View = function (el) {
    this.board = new Tron.board();
    this.ai = new Tron.ai(this.board);
    this.$el = $(el);
    this.setupBoard();
    this.drawBoard();
    this.setKeyHandlers();
    this.start();
  };

  View.prototype.bindEvents = function () {
    var that = this;
    $("div").on("click",function (event) {
      var $cell = $(event.currentTarget);
      var pos = $cell.data("pos");
      try {
        that.game.playMove(pos);
        that.makeMove($cell);
        that.checkWin();
      } catch(e) {
        alert("Invalid move!");
      }
    });
  };


  View.prototype.drawBoard = function () {
    this.board.update();
    this.updateSquares();
  };

  View.prototype.updateSquares = function () {
    $divs = $(this.$el.find("div.grid-square"));
    var that = this;
    $.each($divs, function (div,val) {
      val = $(val);
      var pos = val.data("pos");
      var posVal = that.board.grid[pos[0]][pos[1]];
      if (posVal === "P") {
        val.addClass("cycle");
      } else if (posVal === "A") {
        val.addClass("ai");
      } else if (posVal === "I") {
        val.removeClass("cycle");
        val.removeClass("ai");
        val.addClass("crash");
      } else {
        val.removeClass("cycle");
        val.removeClass("ai");
        val.removeClass("crash");
        val.addClass("empty-square");
      }
    });
  };


  View.prototype.setupBoard = function () {
    this.addSquares();
    this.addButton();
  };

  View.prototype.addButton = function () {
    var $button = $("<button>").text("Try Again");
    $button.on("click",this.restart.bind(this));
    this.$el.append($button);
  };

  View.prototype.addSquares = function () {
    var $container = $("<ul>");
    for (var row = 0; row < 70; row++) {
      for (var col = 0; col < 70; col++) {
        var $div = $("<div>");
        $div.data("pos",[row,col]);
        $div.addClass('grid-square');
        $container.append($div);
      }
    }
    this.$el.append($container);
  };

  View.prototype.restart = function () {
    $button = $(this.$el.find("button"));
    $button.css({"display": "none"});
    this.board = new Tron.board();
    this.ai = new Tron.ai(this.board);
    this.drawBoard();
    this.setKeyHandlers();
  };

  View.prototype.start = function () {
  this.setKeyHandlers();
  var that = this;
  this.interval = setInterval(function () { that.run();}, 30);
};

  View.prototype.run = function () {
    if (this.board.isGameOver()) {
      this.drawBoard();
      $button = $(this.$el.find("button"));
      $button.css({"display": "block"});
    } else {
      this.drawBoard();
    }
    if (this.board.isGameOver() === false) {
      this.board.cycle.move();
      var nextDir = this.ai.decideDir();
      this.board.ai.dir = nextDir;
      this.board.ai.move();
    }
  };


  View.prototype.setKeyHandlers = function () {
    var cycle = this.board.cycle;
    key('up',function () {if (cycle.dir != "S") {cycle.dir = "N";}});
    key('down',function () {if (cycle.dir != "N") {cycle.dir = "S";}});
    key('left',function () {if (cycle.dir != "E") {cycle.dir = "W";}});
    key('right',function () {if (cycle.dir != "W") {cycle.dir = "E";}});
  };





})();
