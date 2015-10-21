(function(){
  Array.prototype.clone = function(){
    // deep copy of an array that contain an array within an array
    var new_arr = [];

    for(var i = 0; i < this.length; i++){
      var new_sub_arr = [];

      if(Array.isArray(this[i])){
        new_sub_arr = this[i].clone();
        new_arr.push(new_sub_arr);
      } else{
        new_arr.push(this[i]);
      }
    }

    return new_arr;
  }

  Array.prototype.compare = function(array){
    for(var i = 0; i < this.length; i++){
      if(Array.isArray(this[i])){
        var equal = this[i].compare(array[i]);
        if(!equal) return false;
      } else{
        if(this[i] !== array[i]) return false;
      }
    }

    return true;
  }

  // Basic solution of a sudoku
  var basic_array = [
    [2,9,1,5,7,3,6,8,4],
    [7,6,3,4,8,2,9,1,5],
    [4,8,5,6,9,1,3,7,2],
    [1,5,4,9,3,7,2,6,8],
    [6,2,8,1,4,5,7,9,3],
    [9,3,7,8,2,6,4,5,1],
    [5,7,9,3,1,4,8,2,6],
    [3,1,2,7,6,8,5,4,9],
    [8,4,6,2,5,9,1,3,7]
  ];

  var game_array = [],
      undo_arr = [],
      key_pressed = false,
      game_ongoing = false,
      curr_lvl,
      empty_box,
      timer;

  var shuffleNumbers = function(){
    // Shuffle between 2 numbers for 40 - 50 times
    var shuffleCount = Math.ceil(Math.random() * 10) + 40;

    for(var i = 0; i < shuffleCount; i++){
      var n1 = Math.ceil(Math.random() * 9),
          n2;

      do{
        n2 = Math.ceil(Math.random() * 9);
      } while(n1 == n2)
      
      for(var arr_row = 0; arr_row < 9; arr_row++){
        for(var arr_col = 0; arr_col < 9; arr_col++){
          if(basic_array[arr_row][arr_col] == n1){
            basic_array[arr_row][arr_col] = n2;
          } else if(basic_array[arr_row][arr_col] == n2){
            basic_array[arr_row][arr_col] = n1;
          }
        }
      }
    }

    console.log("Shuffle numbers for " + shuffleCount + " times.");
  }

  var shuffleReflect = function(){
    // Shuffle by reflecting according to axis
    var refl_arr = ['x', 'y', 'xy', 'yx'];
    var axis = refl_arr[Math.floor(Math.random() * 4)];

    var new_arr = [];

    if(axis == 'x'){
      for(var arr_row = 0; arr_row < 9; arr_row++){
        new_arr.push(basic_array[8 - arr_row]);
      }
    } else if(axis == 'y'){
      for(var arr_row = 0; arr_row < 9; arr_row++){
        var new_sub_arr = [];

        for(var arr_col = 0; arr_col < 9; arr_col++){
          new_sub_arr.push(basic_array[arr_row][8 - arr_col]);
        }

        new_arr.push(new_sub_arr);
      }
    } else if(axis == 'xy'){
      for(var arr_col = 0; arr_col < 9; arr_col++){
        var new_sub_arr = [];

        for(var arr_row = 0; arr_row < 9; arr_row++){
          new_sub_arr.push(basic_array[arr_row][arr_col]);
        }

        new_arr.push(new_sub_arr);
      }
    } else if(axis == 'yx'){
      for(var arr_col = 0; arr_col < 9; arr_col++){
        var new_sub_arr = [];

        for(var arr_row = 0; arr_row < 9; arr_row++){
          new_sub_arr.push(basic_array[8 - arr_row][8 - arr_col]);
        }

        new_arr.push(new_sub_arr);
      }
    }

    console.log("Reflect : " + axis);

    basic_array = new_arr;
  }

  var shuffleRotate = function(){
    // Shuffle by rotating the board to certain degree
    var deg = Math.ceil(Math.random() * 3);

    for(var i = 0; i < deg; i++){
      var new_arr = [];

      for(var arr_col = 0; arr_col < 9; arr_col++){
        var new_sub_arr = [];

        for(var arr_row = 0; arr_row < 9; arr_row++){
          new_sub_arr.push(basic_array[8 - arr_row][arr_col]);
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Rotate : " + (deg * 90) + " deg" );
  }

  var shuffleSmallRow = function(){
    // Shuffle within inter-row
    var shuffleCount = Math.ceil(Math.random() * 10);

    for(var i = 0; i < shuffleCount; i++){
      var row = [];
      var mul = 3 * (Math.floor(Math.random() * 3));

      for(var j = 0; j < 3; j++){
        row.push(j + mul);
      }

      var n1 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0],
          n2;

      do{
        n2 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0];
      } while(n1 == n2)

      var new_arr = [];

      for(var arr_row  = 0; arr_row < 9; arr_row++){
        if(arr_row == n1){
          new_arr.push(basic_array[n2]);
        } else if(arr_row == n2){
          new_arr.push(basic_array[n1]);
        } else{
          new_arr.push(basic_array[arr_row]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-row for : " + shuffleCount + " times");
  }

  var shuffleSmallCol = function(){
    // Shuffle within inter-column
    var shuffleCount = Math.ceil(Math.random() * 10);

    for(var i = 0; i < shuffleCount; i++){
      var col = [];
      var mul = 3 * (Math.floor(Math.random() * 3));

      for(var j = 0; j < 3; j++){
        col.push(j + mul);
      }

      var n1 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0],
          n2;

      do{
        n2 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0];
      } while(n1 == n2)

      var new_arr = []

      for(var arr_row  = 0; arr_row < 9; arr_row++){
        var new_sub_arr = [];

        for(var arr_col  = 0; arr_col < 9; arr_col++){
          if(arr_col == n1){
            new_sub_arr.push(basic_array[arr_row][n2]);
          } else if(arr_col == n2){
            new_sub_arr.push(basic_array[arr_row][n1]);
          } else{
            new_sub_arr.push(basic_array[arr_row][arr_col]);
          }
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-column for : " + shuffleCount + " times");
  }

  var shuffleBigRow = function(){
    // Shuffle within outer-row
    var shuffleCount = Math.ceil(Math.random() * 5);

    for(var i = 0; i < shuffleCount; i++){
      var row = [0,3,6];

      var n1 = Math.floor(Math.random() * 3),
          n2;

      do{
        n2 = Math.floor(Math.random() * 3);
      } while(n1 == n2)

      var new_arr = [];

      for(var arr_row = 0; arr_row < 9; arr_row = arr_row + 3){
        var curr;

        if(arr_row == row[n1]){
          new_arr.push(basic_array[row[n2]]);
          curr = row[n2];
        } else if(arr_row == row[n2]){
          new_arr.push(basic_array[row[n1]]);
          curr = row[n1];
        } else{
          new_arr.push(basic_array[arr_row]);
          curr = arr_row;
        }

        for(var count = 1; count < 3; count++){
          new_arr.push(basic_array[curr + count]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-row for : " + shuffleCount + " times.")
  }

  var shuffleBigCol = function(){
    // Shuffle within outer-column
    var shuffleCount = Math.ceil(Math.random() * 5);

      for(var i = 0; i < shuffleCount; i++){
      var col = [0,3,6];

      var n1 = Math.floor(Math.random() * 3),
          n2;

      do{
        n2 = Math.floor(Math.random() * 3);
      } while(n1 == n2)

      var new_arr = [];

      for(var arr_row  = 0; arr_row < 9; arr_row++){
        var new_sub_arr = [];

        for(var arr_col = 0; arr_col < 9; arr_col = arr_col + 3){
          var curr;

          if(arr_col == col[n1]){
            new_sub_arr.push(basic_array[arr_row][col[n2]]);
            curr = col[n2];
          } else if(arr_col == col[n2]){
            new_sub_arr.push(basic_array[arr_row][col[n1]]);
            curr = col[n1];
          } else{
            new_sub_arr.push(basic_array[arr_row][arr_col]);
            curr = arr_col;
          }

          for(var count = 1; count < 3; count++){
            new_sub_arr.push(basic_array[arr_row][curr + count]);
          }
        }
        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-column for : " + shuffleCount + " times.");
  }

  var shuffleRandom = function(){
    // Randomize shuffling function call
    var shuffle_arr = [
      shuffleNumbers, shuffleReflect, shuffleRotate,
      shuffleSmallRow, shuffleSmallCol, shuffleBigCol,
      shuffleBigRow
    ];

    // The idea is to pick random function and throw it to the end of the array,
    // and reduce the count by 1 in each loop, so the last function in the array
    // won't be picked again.
    var curr_idx = shuffle_arr.length,
        random_idx, 
        temp;

    while(curr_idx != 0){
      random_idx = Math.floor(Math.random() * curr_idx);
      --curr_idx;

      temp = shuffle_arr[curr_idx];
      shuffle_arr[curr_idx] = shuffle_arr[random_idx];
      shuffle_arr[random_idx] = temp;
    }

    // start function call
    for(var i = 0; i < shuffle_arr.length; i++){
      shuffle_arr[i]();
    }
  }

  var generateGrid = function(lvl, box, row, col){
    // Generate table grid for the game
    var count_box = lvl ? 0 : box;
    var count_row = lvl ? 1 : row;
    var count_col = lvl ? 1 : col;

    // In the grid, each column in each row will have another table inside, using
    // recursive method, call this function again when creating the second table
    // element in each column.
    var table_grid = document.createElement('table');

    for(var i = 0; i < 3; i++){
      var table_row = document.createElement('tr');

      if(!lvl){
        table_row.className = 'row_' + count_row++;
      }

      for(var j = 0; j < 3; j++){
        var table_col = document.createElement('td');

        if(lvl){
          table_col.id = 'Box_' + String.fromCharCode(65 + i) + (j + 1) ;
          var table_grid2 = generateGrid(false, count_box, count_row, count_col);
          table_col.appendChild(table_grid2);

          count_box += 3;
          count_col += 3;
        } else {
          table_col.id = 'box_' + (++count_box);
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
  }

  var generateGame = function(){
    // Based on level picked, randomly pick numbers from each row, 
    // and remove it
    game_array = basic_array.clone();

    for(var row = 0; row < 9; row++){
      var random_arr = [];

      for(var i = 0; i < Math.floor(Math.random() * 2) + curr_lvl; i++){
        var random_col = Math.floor(Math.random() * 9),
            count = 0;

        for(var count = 0; count < random_arr.length; count++){
          if(random_arr[count] == random_col){
            random_col = Math.floor(Math.random() * 9);
            count = -1;
          }
        }

        game_array[row][random_col] = 0;
        random_arr.push(random_col);
      }
    }
  }

  var fillBoard = function(){
    // Fill the grid with numbers
    var arr_col = 0,
        arr_row = 0;

    if(validateRowCol(basic_array)){
      for(var i = 1; i <= 81; i++){
        if(game_array[arr_row][arr_col] != 0){
          $('#box_' + i + ' .input_box').text(game_array[arr_row][arr_col]);
          $('#box_' + i + ' .input_box').addClass('fill_lock');
        } else {
          $('#box_' + i + ' .input_box').addClass('user_fill');
          ++empty_box;
        }

        arr_col++;

        if(i % 9 == 0){
          arr_row++;
          arr_col = 0;
        }
      }

      console.log("Board filled.");
      console.log("Empty : " + empty_box );
    }    
  }

  var validateRowCol = function(arr){
    // If total of each row and total of each column is 45, then proceed, else 
    // the game is not valid and not playable, which is impossible, unless
    // there is something wrong with the shuffling.
    for(var row = 0; row < 9; row++){
      var total_c_val = 0,
          total_r_val = 0;

      for(var col = 0; col < 9; col++){
        total_c_val += arr[row][col];
        total_r_val += arr[col][row];
      }

      if(total_c_val != 45 || total_r_val != 45){
        return false;
      }
    }

    return true;
  }

  var checkDuplicate = function(elem, bool){
    // Check whether entered number already has another number exist in the same
    // row, column, or parent box, and when a number is removed, check whether the 
    // duplicate numbers still valid 
    var val = parseInt(elem.text());
    var dul = getRelatedBoxes(elem);

    if(bool){
      for(var i = 0; i < dul.row.length; i++){
        var box_val = $('#' + dul.row[i].id + ' .input_box');
        if(dul.row[i].val == val && dul.row[i].id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }

      for(var i = 0; i < dul.col.length; i++){
        var box_val = $('#' + dul.col[i].id + ' .input_box');
        if(dul.col[i].val == val && dul.col[i].id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }

      for(var i = 0; i < dul.box.length; i++){
        var box_val = $('#' + dul.box[i].id + ' .input_box');
        if(dul.box[i].val == val && dul.box[i].id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }
    } else {
      var this_parent = elem.parent(),
          dul_val = elem.text();

      var bool_row = false,
          bool_col = false,
          bool_box = false;

      for(var i = 0; i < dul.row.length; i++){
        if(dul.row[i].val == dul_val && dul.row[i].id != this_parent.attr('id')){
          bool_row = true;
        }
      }

      for(var i = 0; i < dul.col.length; i++){
        if(dul.col[i].val == dul_val && dul.col[i].id != this_parent.attr('id')){
          bool_col = true;
        }
      }

      for(var i = 0; i < dul.box.length; i++){
        if(dul.box[i].val == dul_val && dul.box[i].id != this_parent.attr('id')){
          bool_box = true;
        }
      }

      if(!bool_row && !bool_col && !bool_box){
        elem.removeClass('duplicate');
      }
    }
  }

  var getRelatedBoxes = function(elem){
    // Get related row, column and parent box for the selected box
    var dul_row = [],
        dul_col = [],
        dul_box = [];

    var this_row = '.' + elem.closest('tr[class^="row_"]').attr('class'),
        this_col = '.' + elem.closest('td[class^="col_"]').attr('class').split(" ")[0],
        this_box = '#' + elem.closest('td[id^="Box_"]').attr('id');

    $(this_row).each(function(){
      $(this).find('.input_box').each(function(){
        var dul_obj = {};

        if($(this).text() != ""){
          dul_obj.id = $(this).parent().attr('id');
          dul_obj.val = $(this).text();

          dul_row.push(dul_obj);
        }
      });
    });

    $(this_col).each(function(){
      $(this).find('.input_box').each(function(){
        var dul_obj = {};

        if($(this).text() != ""){
          dul_obj.id = $(this).parent().attr('id');
          dul_obj.val = $(this).text();

          dul_col.push(dul_obj);
        }
      });
    });

    $(this_box).find('.input_box').each(function(){
      var dul_obj = {};

      if($(this).text() != ""){
        dul_obj.id = $(this).parent().attr('id');
        dul_obj.val = $(this).text();

        dul_box.push(dul_obj);
      }
    });

    return {
      row : dul_row,
      col : dul_col,
      box : dul_box
    };
  }

  var regEvents = function(){
    // Start game with level : easy, medium, hard, expert
    $('#lvl1, #lvl2, #lvl3, #lvl4').on('click',function(){
      // Set the current level number
      curr_lvl = parseInt($(this).attr('id').split('lvl')[1]) + 2;

      // If a game is currently on going, show popup confirmation first
      if(game_ongoing){
        confirmationPopup('new');
      } else{
        newGame();
      }
    });

    $('.userOk, .userCancel').on('click', function(){
      // Toggle popup overlay
      toggleOverlay('.confirmation',
        function($this){
          // Get current status whether is new game or restart game
          var status = $('.confirmation').attr('curr-status');

          // Show popup info according to status
          if($this.className == 'userOk'){
            if(status == 'newG'){
              newGame();  
            } else if (status == 'restartG'){
              restartGame();
            }
          } else{
            // start timer again if user choose to cancel
            startTimer();
            return;
          }
        }, this
      );
    });

    $('.continueGame').on('click', function(){
      // Ask user whether to continue the game with the next difficulty level
      // after finish each game. Keep going until the hardest difficulty again
      // and again. 
      if(curr_lvl < 6){
        curr_lvl += 1;  
      }
      
      if(curr_lvl){
        // Toggle popup overlay
        toggleOverlay('.complete');
        
        newGame();
      }
    });

    $('#restart').on('click', function(){
      // If a game is currently on going, show popup confirmation first
      if(game_ongoing){
        confirmationPopup('restart');
      } else{
        return;
      }
    });

    // Undo the last move
    $('#undo').on('click', undoLastMove);

    // Delete the selected cell
    $('#delete').on('click', function(){
      deleteNum(false);
    });

    // Highlight selected box by adding specific class
    $('.box').on('click', function(){
      $('.selected, .alert, .hovering').removeClass('selected alert hovering');

      if($(this).children().hasClass('user_fill')){
        $(this).addClass('selected');
      } else if($(this).children().hasClass('fill_lock')){
        $(this).addClass('alert');
      }
    });

    // Add hover class on mouseover, only on user editable box
    $('.box').on('mouseover', function(){
      $('.hovering').removeClass('hovering');

      if( $(this).children().hasClass('user_fill') && !$(this).hasClass('selected') ){
        $(this).addClass('hovering');
      } else {
        $('.hovering').removeClass('hovering');
      }
    });

    // Alternate way of entering number using on screen number
    $('#altInput span').on('click', function(){
      var num = $(this).text();

      if(isNaN(num)){
        return false;
      } else {
        inputNum(num, false);
      }
    });

    $(document).on('keydown', function(e){
      // Enable undo using ctrl + z
      if( e.ctrlKey == true && e.which == 90){
        undoLastMove();
      }

      // Enable delete using backspace
      if( e.which == 8 ){
        deleteNum(true);
      }

      if(e.which >= 37 && e.which <= 40){
        // Navigate the game using arrow keys, first get the current box id, then 
        // move to the next box accoring to arrow key pressed.
        var curr_box_val;

        if($(this).find('.selected').length > 0){
          curr_box_val = parseInt($('.selected').attr('id').split("_")[1]);
        } else if($(this).find('.alert').length > 0){
          curr_box_val = parseInt($('.alert').attr('id').split("_")[1]);
        }

        // left arrow key
        if( e.which == 37 ){
          curr_box_val--;
          if(curr_box_val % 9 == 0){
            curr_box_val += 9;
          }
        }

        // up arrow key
        if( e.which == 38 ){
          curr_box_val -= 9;
          if(curr_box_val < 0){
            curr_box_val += 81;
          }
        }

        // right arrow key
        if( e.which == 39 ){
          curr_box_val++;
          if(curr_box_val % 9 == 1){
            curr_box_val -= 9;
          }
        }

        // down arrow key
        if( e.which == 40 ){
          curr_box_val += 9;
          if(curr_box_val > 81){
            curr_box_val -= 81;
          }
        }

        $('.selected, .alert').removeClass('selected alert');

        var curr_box = $('#box_' + curr_box_val);

        if(curr_box.children().hasClass('user_fill')){
          curr_box.addClass('selected');
        } else if(curr_box.children().hasClass('fill_lock')){
          curr_box.addClass('alert');
        } 
      }
    });

    $(document).on('keypress', function(e){
      // Only allows number as input
      if( !(e.which >= 49 && e.which <= 57) ){
        return false;
      } else {
        inputNum(String.fromCharCode(e.keyCode), true);
      }
    });

    // Change key_pressed to false whenever key up
    $(document).on('keyup', function(){
      key_pressed = false;
    });

    $(document).on('mousedown', function(e){
      // prevent text selection
      e.preventDefault();

      // Deselect selected cell if target is body
      if(e.target.nodeName.toLowerCase() == 'body'){
        $('.selected, .alert, .hovering').removeClass('selected alert hovering');
      }
    });
  }

  var inputNum = function(num, keyboard){
    // Only proceed when in user editable box and the entered number is 
    // different from the current one in the box
    if($('.selected').children().hasClass('user_fill') && 
       $('.selected .user_fill').text() != num){
      // key_pressed = allow only single input per keypress
      if( (!key_pressed && keyboard) || !keyboard){
        // Record the next move
        recordVal(num);

        // Fill the box with the entered number
        $('.selected .user_fill').text(num);

        checkDuplicate($('.selected .user_fill'), true);

        $('.duplicate').each(function(){
          checkDuplicate($(this), false);
        });

        if(!key_pressed && keyboard){
          key_pressed = true;
        }

        checkAnswer();
      }
    } else {
      console.warn("No cell selected!");
    }
  }

  var deleteNum = function(keyboard){
    if($('.selected').children().hasClass('user_fill') && 
       $('.selected .user_fill').text() != ""){
      // key_pressed = allow only single input per keypress
      if( (!key_pressed && keyboard) || !keyboard){
        // Record the next move
        recordVal("");

        // Empty the box by delete the number
        $('.selected .user_fill').text("");

        $('.duplicate').each(function(){
          checkDuplicate($(this), false);
        });

        if( (!key_pressed && keyboard) ){
          key_pressed = true;
        }
      }
    }
  }

  var checkAnswer = function(){
    // Check number of empty box left
    var is_empty = false;

    $('.user_fill').each(function(){
      if($(this).text() == ''){
        is_empty = false;
        return false;
      } else {
        is_empty = true;  
      }
    });

    // If no empty box, then proceed to check with game solution
    if(is_empty){
      var user_sol = [],
          num = 1;

      // Push every single number into an array
      do{
        var sub_arr = [];

        do{
          sub_arr.push(parseInt($('#box_' + num++ + ' .input_box').text()));
        } while(sub_arr.length != 9)

        user_sol.push(sub_arr);
      } while(user_sol.length != 9)

      if(user_sol.compare(basic_array) || validateRowCol(user_sol)){
        continueNewLevel();
      }
    }
  }

  var toggleOverlay = function(clsName, callback, param){
    // Toggle overlay animation to show or hide
    if($('#overlay').css('display') == 'none'){
      $('#overlay').fadeIn('fast', function(){
        $(clsName).animate({
          'top' : 0
        },500, function(){
          // Call the callback function if available
          if(callback){
            callback(param);
          }
        });
      });
    } else {
      $(clsName).animate({
        'top' : '200%'
      }, 500, function(){
        $('#overlay').fadeOut('fast');

        // Call the callback function if available
        if(callback){
          callback(param);
        }
      });
    }
  }

  var confirmationPopup = function(status){
    // Show confirmation popup on restart game or new game while the game is on
    // going

    // Stop the timer temporary
    stopTimer();

    // Set the title and the current triggered status
    if(status == 'new'){
      $('.confirmation').attr('curr-status','newG');
      $('.confirmation .title').text('Start a new game?');
    } else if(status == 'restart'){
      $('.confirmation').attr('curr-status','restartG');
      $('.confirmation .title').text('Restart game?');
    }

    // Toggle popup overlay
    toggleOverlay('.confirmation');
  }

  var continueNewLevel = function(){
    // Stop timer after complete game
    stopTimer();

    // Always reset the final time displayed
    $('.winMin, .winSec').text("0");

    toggleOverlay('.complete', 
      function(){
        $('.winMin, .winSec').each(function(){
          var num;

          // Get the number of minute or second accordingly
          if(this.className == 'winMin'){
            num = $('.minute').text();
          } else {
            num = $('.second').text();
          }

          // Animate the increasing of number
          $(this).prop('number', 0).animate({
            number : num
          },{
            duration : 1000,
            easing: 'swing',
            step : function(now){
              $(this).text(Math.ceil(now));
            }
          });
        });
      }
    );
  }

  var recordVal = function(val){
    // Push object containing box id, previous value and current value to the
    // array
    undo_arr.push({
      box_id : '#' + $('.selected').attr('id'),
      prev_box_val : $('.selected .user_fill').text(),
      curr_box_val : val
    });
  }

  var newGame = function(){
    // Start new game with specified level
    console.clear();

    clearBoard();

    resetTimer();
    stopTimer();
    startTimer();

    for(var count = 0; count < 2; count++){
      shuffleRandom();
      console.log(">>>Shuffle done = " + (count+1));
    }

    generateGame();

    fillBoard();
  }

  var restartGame = function(){
    // Restart the same game
    clearBoard();

    resetTimer();
    stopTimer();
    startTimer();

    console.log('Restart Game.');
    fillBoard();
  }

  var undoLastMove = function(){
    // Undo the last move
    if(undo_arr.length > 0){
      var last_move = undo_arr[undo_arr.length - 1];
      $(last_move.box_id + ' span').text(last_move.prev_box_val);

      undo_arr.splice(undo_arr.length - 1, 1);

      checkDuplicate($(last_move.box_id + ' span'), true);

      $('.duplicate').each(function(){
        checkDuplicate($(this), false);
      });
    }
  }

  var gameTimer = function(){
    // Set game timer
    var getMin = $('.minute').text(),
        getSec = $('.second').text();

    // Automatically round up to 1 more minute for every 60 seconds passed
    if(getSec == '59'){
      getMin = parseInt(getMin) + 1;
      getSec = '00';
    } else if(getSec < 9){
      // Add a zero infront if the number is only a single digit
      getSec = '0' + ( parseInt(getSec) + 1 );
    } else{
      getSec = parseInt(getSec) + 1 ;
    }

    $('.minute').text(getMin);
    $('.second').text(getSec);

    // if(getMin == '60' && getSec == '00'){
    //   stopTimer();
    //   alert("");
    // }
  }

  var startTimer = function(){
    // Start game timer
    timer = setInterval(gameTimer, 1000);
    game_ongoing = true;
  }

  var stopTimer = function(){
    // Stop game timer
    clearInterval(timer);
    game_ongoing = false;
  }

  var resetTimer = function(){
    // Reset game timer
    $('.minute').text('0');
    $('.second').text('00');
  }

  var clearBoard = function(){
    // Clear board to its original state
    empty_box = 0;

    $('#sdkBoard .input_box').each(function(){
      $(this).text("").removeClass('fill_lock user_fill');
    });

    $('.duplicate').each(function(){
      $(this).removeClass('duplicate');
    });

    $('.selected, .hovering, .alert').removeClass('selected hovering alert');
  }

  $.fn.initGrid = function(){
    // Initialize sudoku game
    document.getElementById('sdkBoard').appendChild(generateGrid(true));

    console.log("Grid generated.");

    regEvents();
  };
})();