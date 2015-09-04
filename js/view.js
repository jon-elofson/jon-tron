(function () {
  if (typeof Tron === "undefined") {
    window.Tron = {};
  }

  var View = window.Tron.View = function (el) {
    this.board = new Tron.board();
    this.ai = new Tron.ai(this.board);
    this.$el = $(el);
    this.yourLives = 3;
    this.aiLives = 3;
    this.gameOver = false;
    this.setupBoard();
    this.drawBoard();
    this.setKeyHandlers();
    this.start();
  };

  View.prototype.checkWinner = function () {
    if (this.yourLives === 0) {
      return "The computer";
    } else if (this.aiLives === 0) {
      return "You";
    }
  };

  View.prototype.checkGameOver = function () {
    if (this.yourLives === 0 || this.aiLives === 0) {
      return true;
    } else {
      return false;
    }
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
    this.addLives();
    this.addSquares();
    this.addGameInstructions();
    this.addButton();
  };

  View.prototype.addGameInstructions = function () {
    var goal = "You are the <span class='green'> green</span> line. Try to make your opponent hit a wall before you do!";
    var $h3Goal = $("<h3>").addClass("instructions").html(goal);
    var str = " ▲ ▼ ◀ ▶ Use the arrow keys to navigate";
    var $h3Keys = $("<h3>").addClass("instructions").html(str);
    var spaceStr = "Press the SPACE bar to start a new game";
    var $h3Space = $("<h3>").addClass("instructions").html(spaceStr);
    this.$el.append($h3Goal).append($h3Keys).append($h3Space);
  };

  View.prototype.addLives = function () {
    var $lives = $("<div>").addClass("lives");
    $lives.html(this.determineLivesString());
    this.$el.append($lives);
  };

  View.prototype.determineLivesString = function () {
    var h3 = $('<h3>');
    var aiLives = $('<span>').addClass('lives').text("AI Lives: ");
    for (var i = 0; i < this.aiLives; i++) {
      var aiTri = $('<span>').addClass('aiTri').text("▲ ");
      aiLives.append(aiTri);
    }
    h3.append(aiLives);
    var yourLives = $('<span>').addClass('lives').text("Your Lives: ");
    for (var j = 0; j < this.yourLives; j++) {
      var yourTri = $('<span>').addClass('yourTri').text("▲ ");
      yourLives.append(yourTri);
    }
    return h3.append(yourLives);
  };

  View.prototype.addButton = function () {
    var $button = $("<button>").text("Play Again");
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
    this.$el.remove("h3.lives");
    this.$el.find(".lives").html(this.determineLivesString());
    this.start();
  };

  View.prototype.start = function () {
  this.setKeyHandlers();
  var that = this;
  this.interval = window.setInterval(function () { that.run();}, 10);
};

  View.prototype.run = function () {
    this.drawBoard();
    if (this.board.isGameOver()) {
      this.determineWinner();
      clearInterval(this.interval);
      if (this.checkGameOver() === false) {
        $button = $(this.$el.find("button"));
        $button.css({"display": "block"});
        $button.html('Play Again!')
      } else {
        this.roundOver();
      }
    }
    if (this.board.isGameOver() === false) {
      this.board.cycle.move();
      var nextDir = this.ai.decideDir();
      this.board.ai.dir = nextDir;
      this.board.ai.move();
    }
  };


  View.prototype.roundOver = function () {
    var winner = this.checkWinner();
    this.$el.find(".lives").html(winner + " won!");
    $button = $(this.$el.find("button"));
    $button.css({"display": "block"});
    this.aiLives = 3;
    this.yourLives = 3;
    $button.html("New Round!");
  };

  View.prototype.determineWinner = function () {
    if (this.board.cycle.hit || this.board.cycle.outOfBounds) {
      this.yourLives -= 1;
    }
    if (this.board.ai.hit || this.board.ai.outOfBounds) {
      this.aiLives -= 1;
    }
  };


  View.prototype.setKeyHandlers = function () {
    var cycle = this.board.cycle;
    var that = this;
    key('up',function () {if (cycle.dir != "S") {cycle.dir = "N";}});
    key('down',function () {if (cycle.dir != "N") {cycle.dir = "S";}});
    key('left',function () {if (cycle.dir != "E") {cycle.dir = "W";}});
    key('right',function () {if (cycle.dir != "W") {cycle.dir = "E";}});
    key('space',function () {if (that.board.isGameOver()) {that.restart();}});
  };


})();
