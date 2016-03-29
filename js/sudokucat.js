"use strict";

(function () {
  Array.prototype.clone = function () {
    var new_arr = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _this = _step.value;

        if (Array.isArray(_this)) {
          var new_sub_arr = _this.clone();
          new_arr.push(new_sub_arr);
        } else {
          new_arr.push(_this);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return new_arr;
  };

  Array.prototype.compare = function (array) {
    for (var i = 0; i < this.length; i++) {
      if (Array.isArray(this[i])) {
        if (!this[i].compare(array[i])) return false;
      } else if (this[i] !== array[i]) {
        return false;
      }
    }

    return true;
  };

  var basic_array = [[2, 9, 1, 5, 7, 3, 6, 8, 4], [7, 6, 3, 4, 8, 2, 9, 1, 5], [4, 8, 5, 6, 9, 1, 3, 7, 2], [1, 5, 4, 9, 3, 7, 2, 6, 8], [6, 2, 8, 1, 4, 5, 7, 9, 3], [9, 3, 7, 8, 2, 6, 4, 5, 1], [5, 7, 9, 3, 1, 4, 8, 2, 6], [3, 1, 2, 7, 6, 8, 5, 4, 9], [8, 4, 6, 2, 5, 9, 1, 3, 7]];

  var game_array = [],
      undo_arr = [],
      key_pressed = false,
      game_ongoing = false,
      curr_lvl = undefined,
      empty_box = undefined,
      timer = undefined;

  var shuffleNumbers = function shuffleNumbers() {
    var shuffleCount = Math.ceil(Math.random() * 10) + 30;

    for (var i = 0; i < shuffleCount; i++) {
      var n1 = Math.ceil(Math.random() * 9),
          n2 = undefined;

      do {
        n2 = Math.ceil(Math.random() * 9);
      } while (n1 == n2);

      for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
          if (basic_array[row][col] == n1) {
            basic_array[row][col] = n2;
          } else if (basic_array[row][col] == n2) {
            basic_array[row][col] = n1;
          }
        }
      }
    }

    console.log("Shuffle numbers for " + shuffleCount + " times.");
  };

  var shuffleReflect = function shuffleReflect() {
    var refl_arr = ['x', 'y', 'xy', 'yx'];
    var axis = refl_arr[Math.floor(Math.random() * 4)];

    var new_arr = [];

    switch (axis) {
      case 'x':
        for (var row = 0; row < 9; row++) {
          new_arr.push(basic_array[8 - row]);
        }
        break;

      case 'y':
        for (var row = 0; row < 9; row++) {
          var new_sub_arr = [];

          for (var col = 0; col < 9; col++) {
            new_sub_arr.push(basic_array[row][8 - col]);
          }

          new_arr.push(new_sub_arr);
        }
        break;

      case 'xy':
        for (var col = 0; col < 9; col++) {
          var new_sub_arr = [];

          for (var row = 0; row < 9; row++) {
            new_sub_arr.push(basic_array[row][col]);
          }

          new_arr.push(new_sub_arr);
        }
        break;

      case 'yx':
        for (var col = 0; col < 9; col++) {
          var new_sub_arr = [];

          for (var row = 0; row < 9; row++) {
            new_sub_arr.push(basic_array[8 - row][8 - col]);
          }

          new_arr.push(new_sub_arr);
        }
        break;
    }

    console.log("Reflect : " + axis);

    basic_array = new_arr;
  };

  var shuffleRotate = function shuffleRotate() {
    var deg = Math.ceil(Math.random() * 3);

    for (var i = 0; i < deg; i++) {
      var new_arr = [];

      for (var col = 0; col < 9; col++) {
        var new_sub_arr = [];

        for (var row = 0; row < 9; row++) {
          new_sub_arr.push(basic_array[8 - row][col]);
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Rotate : " + deg * 90 + " deg");
  };

  var shuffleSmallRow = function shuffleSmallRow() {
    var shuffleCount = Math.ceil(Math.random() * 10);

    for (var i = 0; i < shuffleCount; i++) {
      var row = [];
      var mul = 3 * Math.floor(Math.random() * 3);

      for (var j = 0; j < 3; j++) {
        row.push(j + mul);
      }

      var n1 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0],
          n2 = undefined;

      do {
        n2 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0];
      } while (n1 == n2);

      var new_arr = [];

      for (var _row = 0; _row < 9; _row++) {
        if (_row == n1) {
          new_arr.push(basic_array[n2]);
        } else if (_row == n2) {
          new_arr.push(basic_array[n1]);
        } else {
          new_arr.push(basic_array[_row]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-row for : " + shuffleCount + " times");
  };

  var shuffleSmallCol = function shuffleSmallCol() {
    var shuffleCount = Math.ceil(Math.random() * 10);

    for (var i = 0; i < shuffleCount; i++) {
      var col = [];
      var mul = 3 * Math.floor(Math.random() * 3);

      for (var _i = 0; _i < 3; _i++) {
        col.push(_i + mul);
      }

      var n1 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0],
          n2 = undefined;

      do {
        n2 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0];
      } while (n1 == n2);

      var new_arr = [];

      for (var row = 0; row < 9; row++) {
        var new_sub_arr = [];

        for (var _col = 0; _col < 9; _col++) {
          if (_col == n1) {
            new_sub_arr.push(basic_array[row][n2]);
          } else if (_col == n2) {
            new_sub_arr.push(basic_array[row][n1]);
          } else {
            new_sub_arr.push(basic_array[row][_col]);
          }
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-column for : " + shuffleCount + " times");
  };

  var shuffleBigRow = function shuffleBigRow() {
    var shuffleCount = Math.ceil(Math.random() * 5);

    for (var i = 0; i < shuffleCount; i++) {
      var arr_row = [0, 3, 6];

      var n1 = Math.floor(Math.random() * 3),
          n2 = undefined;

      do {
        n2 = Math.floor(Math.random() * 3);
      } while (n1 == n2);

      var new_arr = [];

      for (var row = 0; row < 9; row = row + 3) {
        var curr = undefined;

        if (row == arr_row[n1]) {
          new_arr.push(basic_array[arr_row[n2]]);
          curr = arr_row[n2];
        } else if (row == arr_row[n2]) {
          new_arr.push(basic_array[arr_row[n1]]);
          curr = arr_row[n1];
        } else {
          new_arr.push(basic_array[row]);
          curr = row;
        }

        for (var count = 1; count < 3; count++) {
          new_arr.push(basic_array[curr + count]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-row for : " + shuffleCount + " times.");
  };

  var shuffleBigCol = function shuffleBigCol() {
    var shuffleCount = Math.ceil(Math.random() * 5);

    for (var i = 0; i < shuffleCount; i++) {
      var arr_col = [0, 3, 6];

      var n1 = Math.floor(Math.random() * 3),
          n2 = undefined;

      do {
        n2 = Math.floor(Math.random() * 3);
      } while (n1 == n2);

      var new_arr = [];

      for (var row = 0; row < 9; row++) {
        var new_sub_arr = [];

        for (var col = 0; col < 9; col = col + 3) {
          var curr = undefined;

          if (col == arr_col[n1]) {
            new_sub_arr.push(basic_array[row][arr_col[n2]]);
            curr = arr_col[n2];
          } else if (col == arr_col[n2]) {
            new_sub_arr.push(basic_array[row][arr_col[n1]]);
            curr = arr_col[n1];
          } else {
            new_sub_arr.push(basic_array[row][col]);
            curr = col;
          }

          for (var count = 1; count < 3; count++) {
            new_sub_arr.push(basic_array[row][curr + count]);
          }
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-column for : " + shuffleCount + " times.");
  };

  var shuffleRandom = function shuffleRandom() {
    var shuffle_arr = [shuffleNumbers, shuffleReflect, shuffleRotate, shuffleSmallRow, shuffleSmallCol, shuffleBigCol, shuffleBigRow];

    var index = undefined;

    while (shuffle_arr.length != 0) {
      index = Math.floor(Math.random() * shuffle_arr.length);
      shuffle_arr[index]();
      shuffle_arr.splice(index, 1);
    }
  };

  var generateGrid = function generateGrid(lvl, box, row, col) {
    var count_box = lvl ? 0 : box;
    var count_row = lvl ? 1 : row;
    var count_col = lvl ? 1 : col;

    var table_grid = document.createElement('table');

    for (var i = 0; i < 3; i++) {
      var table_row = document.createElement('tr');
      table_row.className = !lvl ? 'row_' + count_row++ : "";

      for (var j = 0; j < 3; j++) {
        var table_col = document.createElement('td');

        if (lvl) {
          table_col.id = 'Box_' + String.fromCharCode(65 + i) + (j + 1);

          var table_grid2 = generateGrid(false, count_box, count_row, count_col);
          table_col.appendChild(table_grid2);

          count_box += 3;
          count_col += 3;
        } else {
          table_col.id = 'box_' + ++count_box;
          table_col.className = 'col_' + count_col++ + ' box';

          var input = document.createElement('span');
          input.className = 'input_box';
          table_col.appendChild(input);
        }

        table_row.appendChild(table_col);
      }

      table_grid.appendChild(table_row);

      count_box += lvl ? 18 : 6;
      count_row += lvl ? 3 : 0;
      count_col = lvl ? 1 : count_col - 3;
    }

    return table_grid;
  };

  var generateGame = function generateGame() {
    game_array = basic_array.clone();

    for (var row = 0; row < 9; row++) {
      var random_arr = [];

      for (var i = 0; i < Math.floor(Math.random() * 2) + curr_lvl; i++) {
        var random_col = Math.floor(Math.random() * 9);

        for (var count = 0; count < random_arr.length; count++) {
          if (random_arr[count] == random_col) {
            random_col = Math.floor(Math.random() * 9);
            count = -1;
          }
        }

        game_array[row][random_col] = 0;
        random_arr.push(random_col);
      }
    }
  };

  var validateRowCol = function validateRowCol(arr) {
    for (var row = 0; row < 9; row++) {
      var total_c_val = 0,
          total_r_val = 0;

      for (var col = 0; col < 9; col++) {
        total_c_val += arr[row][col];
        total_r_val += arr[col][row];
      }

      if (total_c_val != 45 || total_r_val != 45) {
        return false;
      }
    }

    return true;
  };

  var fillBoard = function fillBoard() {
    var arr_col = 0,
        arr_row = 0;

    if (validateRowCol(basic_array)) {
      for (var i = 1; i <= 81; i++) {
        if (game_array[arr_row][arr_col] != 0) {
          $('#box_' + i + ' .input_box').text(game_array[arr_row][arr_col]);
          $('#box_' + i + ' .input_box').addClass('fill_lock');
        } else {
          $('#box_' + i + ' .input_box').addClass('user_fill');
          ++empty_box;
        }

        arr_col++;

        if (i % 9 == 0) {
          arr_row++;
          arr_col = 0;
        }
      }

      console.log("Board filled.");
      console.log("Empty : " + empty_box);
    }
  };

  var getRelatedBoxes = function getRelatedBoxes(elem) {
    var row = [],
        col = [],
        box = [];

    var this_row = '.' + elem.closest('tr[class^="row_"]').attr('class'),
        this_col = '.' + elem.closest('td[class^="col_"]').attr('class').split(" ")[0],
        this_box = '#' + elem.closest('td[id^="Box_"]').attr('id');

    $(this_row).each(function () {
      $(this).find('.input_box').each(function () {
        if ($(this).text() != "") {
          row.push({
            id: $(this).parent().attr('id'),
            val: $(this).text()
          });
        }
      });
    });

    $(this_col).each(function () {
      $(this).find('.input_box').each(function () {
        if ($(this).text() != "") {
          col.push({
            id: $(this).parent().attr('id'),
            val: $(this).text()
          });
        }
      });
    });

    $(this_box).find('.input_box').each(function () {
      if ($(this).text() != "") {
        box.push({
          id: $(this).parent().attr('id'),
          val: $(this).text()
        });
      }
    });

    return {
      row: row, col: col, box: box
    };
  };

  var recordVal = function recordVal(val) {
    undo_arr.push({
      box_id: '#' + $('.selected').attr('id'),
      prev_box_val: $('.selected .user_fill').text(),
      curr_box_val: val
    });
  };

  var checkDuplicate = function checkDuplicate(elem, bool) {
    var val = elem.text();
    var dul = getRelatedBoxes(elem);

    if (bool) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dul.row[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var row = _step2.value;

          var box_val = $('#' + row.id + ' .input_box');

          if (row.val == val && row.id != elem.parent().attr('id')) {
            box_val.addClass('duplicate');
            elem.addClass('duplicate');
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = dul.col[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var col = _step3.value;

          var box_val = $('#' + col.id + ' .input_box');

          if (col.val == val && col.id != elem.parent().attr('id')) {
            box_val.addClass('duplicate');
            elem.addClass('duplicate');
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = dul.box[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var box = _step4.value;

          var box_val = $('#' + box.id + ' .input_box');

          if (box.val == val && box.id != elem.parent().attr('id')) {
            box_val.addClass('duplicate');
            elem.addClass('duplicate');
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    } else {
      var this_parent = elem.parent(),
          _val = elem.text();

      var bool_row = false,
          bool_col = false,
          bool_box = false;

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = dul.row[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var row = _step5.value;

          if (row.val == _val && row.id != this_parent.attr('id')) {
            bool_row = true;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = dul.col[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var col = _step6.value;

          if (col.val == _val && col.id != this_parent.attr('id')) {
            bool_col = true;
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = dul.box[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var box = _step7.value;

          if (box.val == _val && box.id != this_parent.attr('id')) {
            bool_box = true;
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      if (!bool_row && !bool_col && !bool_box) {
        elem.removeClass('duplicate');
      }
    }
  };

  var gameTimer = function gameTimer() {
    var getMin = $('.minute').text(),
        getSec = $('.second').text();

    if (getSec == '59') {
      getMin = parseInt(getMin) + 1;
      getSec = '00';
    } else if (getSec < 9) {
      getSec = '0' + (parseInt(getSec) + 1);
    } else {
      getSec = parseInt(getSec) + 1;
    }

    $('.minute').text(getMin);
    $('.second').text(getSec);
  };

  var startTimer = function startTimer() {
    timer = setInterval(gameTimer, 1000);
    game_ongoing = true;
  };

  var stopTimer = function stopTimer() {
    clearInterval(timer);
    game_ongoing = false;
  };

  var resetTimer = function resetTimer() {
    $('.minute').text('0');
    $('.second').text('00');
  };

  var toggleOverlay = function toggleOverlay(clsName, callback) {
    if ($('#overlay').css('display') == 'none') {
      $('#overlay').fadeIn('fast', function () {
        $(clsName).animate({
          'top': 0
        }, 500, function () {
          if (callback) {
            callback();
          }
        });
      });
    } else {
      $(clsName).animate({
        'top': '200%'
      }, 500, function () {
        $('#overlay').fadeOut('fast');

        if (callback) {
          callback();
        }
      });
    }
  };

  var continueNewLevel = function continueNewLevel() {
    stopTimer();

    $('.winMin, .winSec').text("0");

    toggleOverlay('.complete', function () {
      $('.winMin, .winSec').each(function () {
        var num = undefined;

        if (this.className == 'winMin') {
          num = $('.minute').text();
        } else {
          num = $('.second').text();
        }

        $(this).prop('number', 0).animate({
          number: num
        }, {
          duration: 1000,
          easing: 'swing',
          step: function step(now) {
            $(this).text(Math.ceil(now));
          }
        });
      });
    });
  };

  var checkAnswer = function checkAnswer() {
    var is_empty = false;

    $('.user_fill').each(function () {
      if ($(this).text() == '') {
        is_empty = false;
        return false;
      } else {
        is_empty = true;
      }
    });

    if (is_empty) {
      var user_sol = [],
          num = 1;

      do {
        var sub_arr = [];

        do {
          sub_arr.push(parseInt($('#box_' + num++ + ' .input_box').text()));
        } while (sub_arr.length != 9);

        user_sol.push(sub_arr);
      } while (user_sol.length != 9);

      if (user_sol.compare(basic_array) || validateRowCol(user_sol)) {
        continueNewLevel();
      }
    }
  };

  var inputNum = function inputNum(num, keyboard) {
    if ($('.selected').children().hasClass('user_fill') && $('.selected .user_fill').text() != num) {
      if (!key_pressed && keyboard || !keyboard) {
        recordVal(num);

        $('.selected .user_fill').text(num);

        checkDuplicate($('.selected .user_fill'), true);

        $('.duplicate').each(function () {
          checkDuplicate($(this), false);
        });

        if (!key_pressed && keyboard) {
          key_pressed = true;
        }

        checkAnswer();
      }
    } else {
      console.warn("No cell selected!");
    }
  };

  var deleteNum = function deleteNum(keyboard) {
    if ($('.selected').children().hasClass('user_fill') && $('.selected .user_fill').text() != "") {
      if (!key_pressed && keyboard || !keyboard) {
        recordVal("");

        $('.selected .user_fill').text("");

        $('.duplicate').each(function () {
          checkDuplicate($(this), false);
        });

        if (!key_pressed && keyboard) {
          key_pressed = true;
        }
      }
    }
  };

  var confirmationPopup = function confirmationPopup(status) {
    stopTimer();

    if (status == 'new') {
      $('.confirmation').attr('curr-status', 'newG');
      $('.confirmation .title').text('Start a new game?');
    } else if (status == 'restart') {
      $('.confirmation').attr('curr-status', 'restartG');
      $('.confirmation .title').text('Restart game?');
    }

    toggleOverlay('.confirmation');
  };

  var undoLastMove = function undoLastMove() {
    if (undo_arr.length > 0) {
      var last_move = undo_arr[undo_arr.length - 1];

      $(last_move.box_id + ' span').text(last_move.prev_box_val);

      undo_arr.splice(undo_arr.length - 1, 1);

      checkDuplicate($(last_move.box_id + ' span'), true);

      $('.duplicate').each(function () {
        checkDuplicate($(this), false);
      });
    }
  };

  var clearBoard = function clearBoard() {
    empty_box = 0;

    $('#sdkBoard .input_box').each(function () {
      $(this).text("").removeClass('fill_lock user_fill');
    });

    $('.duplicate').each(function () {
      $(this).removeClass('duplicate');
    });

    $('.selected, .hovering, .alert').removeClass('selected hovering alert');
  };

  var newGame = function newGame() {
    console.clear();

    clearBoard();

    resetTimer();
    stopTimer();
    startTimer();

    for (var count = 1; count <= 2; count++) {
      shuffleRandom();
      console.log(">>>Shuffle done = " + count);
    }

    generateGame();

    fillBoard();
  };

  var restartGame = function restartGame() {
    clearBoard();

    resetTimer();
    stopTimer();
    startTimer();

    console.log('Restart Game.');
    fillBoard();
  };

  var regEvents = function regEvents() {
    $('#lvl1, #lvl2, #lvl3, #lvl4').on('click', function () {
      curr_lvl = parseInt($(this).attr('id').split('lvl')[1]) + 2;

      if (game_ongoing) {
        confirmationPopup('new');
      } else {
        newGame();
      }
    });

    $('.userOk, .userCancel').on('click', function () {
      var _this2 = this;

      toggleOverlay('.confirmation', function () {
        var status = $('.confirmation').attr('curr-status');

        if (_this2.className == 'userOk') {
          if (status == 'newG') {
            newGame();
          } else if (status == 'restartG') {
            restartGame();
          }
        } else {
          startTimer();
          return;
        }
      });
    });

    $('.continueGame').on('click', function () {
      if (curr_lvl) {
        toggleOverlay('.complete', function () {
          if (curr_lvl < 6) {
            curr_lvl += 1;
          }

          newGame();
        });
      }
    });

    $('#restart').on('click', function () {
      if (game_ongoing) {
        confirmationPopup('restart');
      } else {
        return;
      }
    });

    $('#undo').on('click', undoLastMove);

    $('#delete').on('click', function () {
      deleteNum(false);
    });

    $('#about, #exit').on('click', function () {
      var _this3 = this;

      if (this.id == 'about' && game_ongoing) {
        stopTimer();
        game_ongoing = true;
      }

      toggleOverlay('.about', function () {
        if (_this3.id == 'exit' && game_ongoing) {
          startTimer();
        }
      });
    });

    $('.box').on('click', function () {
      $('.selected, .alert, .hovering').removeClass('selected alert hovering');

      if ($(this).children().hasClass('user_fill')) {
        $(this).addClass('selected');
      } else if ($(this).children().hasClass('fill_lock')) {
        $(this).addClass('alert');
      }
    });

    $('.box').on('mouseover', function () {
      $('.hovering').removeClass('hovering');

      if ($(this).children().hasClass('user_fill') && !$(this).hasClass('selected')) {
        $(this).addClass('hovering');
      } else {
        $('.hovering').removeClass('hovering');
      }
    });

    $('#altInput span').on('click', function () {
      inputNum($(this).text(), false);
    });

    $(document).on('keydown', function (e) {
      if (e.ctrlKey == true && e.which == 90) {
        undoLastMove();
      }

      if (e.which == 8) {
        deleteNum(true);
      }

      if (e.which >= 37 && e.which <= 40) {
        var curr_box_val = undefined;

        if ($(this).find('.selected').length > 0) {
          curr_box_val = parseInt($('.selected').attr('id').split("_")[1]);
        } else if ($(this).find('.alert').length > 0) {
          curr_box_val = parseInt($('.alert').attr('id').split("_")[1]);
        }

        if (e.which == 37) {
          curr_box_val--;

          if (curr_box_val % 9 == 0) {
            curr_box_val += 9;
          }
        }

        if (e.which == 38) {
          curr_box_val -= 9;

          if (curr_box_val < 0) {
            curr_box_val += 81;
          }
        }

        if (e.which == 39) {
          curr_box_val++;

          if (curr_box_val % 9 == 1) {
            curr_box_val -= 9;
          }
        }

        if (e.which == 40) {
          curr_box_val += 9;

          if (curr_box_val > 81) {
            curr_box_val -= 81;
          }
        }

        $('.selected, .alert').removeClass('selected alert');

        var curr_box = $('#box_' + curr_box_val);

        if (curr_box.children().hasClass('user_fill')) {
          curr_box.addClass('selected');
        } else if (curr_box.children().hasClass('fill_lock')) {
          curr_box.addClass('alert');
        }
      }
    });

    $(document).on('keypress', function (e) {
      if (!(e.which >= 49 && e.which <= 57)) {
        return false;
      } else {
        inputNum(String.fromCharCode(e.keyCode), true);
      }
    });

    $(document).on('keyup', function () {
      key_pressed = false;
    });

    $(document).on('mousedown', function (e) {
      e.preventDefault();

      if (e.target.nodeName.toLowerCase() == 'body') {
        $('.selected, .alert, .hovering').removeClass('selected alert hovering');
      }
    });
  };

  $.fn.initGrid = function () {
    $('#sdkBoard').append(generateGrid(true)).find('> table table').each(function (i) {
      var _this4 = this;

      setTimeout(function () {
        $(_this4).addClass('sub_grid');
      }, 100 * i);
    });

    console.log("Grid generated.");

    regEvents();
  };
})();