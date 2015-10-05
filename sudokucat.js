(function(){
  Array.prototype.clone = function(){
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

  var basic_array = [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
  ];

  var game_array = [],
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
    // shuffle by reflecting with each other
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
    // shuffle by rotating the board
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

    console.log("Rotate : " + deg * 90);
  }

  var shuffleSmallRow = function(){
    var row = [];
    var mul = 3 * (Math.floor(Math.random() * 3));

    for(var i = 0; i < 3; i++){
      row.push(i + mul);
    }

    var n1 = Math.floor(Math.random() * (row[row.length - 1] - row[0])) + row[0],
        n2;
    do{
      n2 = Math.floor(Math.random() * (row[row.length - 1] - row[0])) + row[0];
    } while(n1 == n2)

    var new_arr = []
    for(var arr_row  = 0; arr_row < 9; arr_row++){
      if(arr_row == n1){
        new_arr.push(basic_array[n2]);
      } else if(arr_row == n2){
        new_arr.push(basic_array[n1]);
      } else{
        new_arr.push(basic_array[arr_row]);
      }
    }

    console.log("Small row : " + n1, n2);

    basic_array = new_arr;
  }

  var shuffleSmallCol = function(){
    var col = [];
    var mul = 3 * (Math.floor(Math.random() * 3));

    for(var i = 0; i < 3; i++){
      col.push(i + mul);
    }

    var n1 = Math.floor(Math.random() * (col[col.length - 1] - col[0])) + col[0],
        n2;
    do{
      n2 = Math.floor(Math.random() * (col[col.length - 1] - col[0])) + col[0];
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

    console.log("Small col : " +  n1, n2);

    basic_array = new_arr;
  }

  var shuffleBigRow = function(){
    var row = [0,3,6]

    var n1 = Math.floor(Math.random() * 3),
        n2;
    do{
      n2 = Math.floor(Math.random() * 3);
    } while(n1 == n2)

    var new_arr = []
    for(var arr_row  = 0; arr_row < 9; arr_row = arr_row + 3){
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

    console.log("Big row : " + n1, n2);

    basic_array = new_arr;
  }

  var shuffleBigCol = function(){
    var col = [0,3,6]

    var n1 = Math.floor(Math.random() * 3),
        n2;
    do{
      n2 = Math.floor(Math.random() * 3);
    } while(n1 == n2)

    var new_arr = []
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

    console.log("Big col : " + n1, n2);

    basic_array = new_arr;
  }

  var shuffleRandom = function(){
    var shuffle_arr = [
      shuffleNumbers, shuffleReflect, shuffleRotate,
      shuffleSmallRow, shuffleSmallCol, shuffleBigCol,
      shuffleBigRow
    ];

    var curr_idx = shuffle_arr.length,
        random_idx, temp;

    while(curr_idx != 0){
      random_idx = Math.floor(Math.random() * curr_idx);
      --curr_idx;

      temp = shuffle_arr[curr_idx];
      shuffle_arr[curr_idx] = shuffle_arr[random_idx];
      shuffle_arr[random_idx] = temp;
    }

    for(var i = 0; i < shuffle_arr.length; i++){
      shuffle_arr[i]();
    }
  }

  var generateGrid = function(lvl, box, row, col){
    var count_box = lvl ? 0 : box;
    var count_row = lvl ? 1 : row;
    var count_col = lvl ? 1 : col;

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

  var generateGame = function(lvl){
    game_array = basic_array.clone();

    for(var row = 0; row < 9; row++){
      var random_arr = [];
      for(var i = 0; i < Math.floor(Math.random() * 2) + lvl; i++){
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
      random_arr = [];
    }
  }

  var fillBoard = function(){
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
      // $(this_row + ' .duplicate,' + this_col + ' .duplicate,' + this_box + ' .duplicate').each(function(){
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
      // });
    }
  }

  var getRelatedBoxes = function(elem){
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
    $('#lvl1').on('click',function(){
      newGame(3);
    });

    $('#lvl2').on('click',function(){
      newGame(4);
    });

    $('#lvl3').on('click',function(){
      newGame(5);
    });

    $('#lvl4').on('click',function(){
      newGame(6);
    });

    $('.box').on('click', function(){
      $('.selected, .alert, .hovering').removeClass('selected alert hovering');

      if($(this).children().hasClass('user_fill')){
        $(this).addClass('selected');
      } else if($(this).children().hasClass('fill_lock')){
        $(this).addClass('alert');
      }
    });

    $('.box').on('mouseover', function(){
      $('.hovering').removeClass('hovering');

      if( $(this).children().hasClass('user_fill') && !$(this).hasClass('selected') ){
        $(this).addClass('hovering');
      } else {
        $('.hovering').removeClass('hovering');
      }
    });

    $(document).on('keydown', function(e){
      if( e.which == 8 ){
        if($('.selected').children().hasClass('user_fill')){
          $('.selected .user_fill').text("");
          $('.duplicate').each(function(){
            checkDuplicate($(this), false);
          });
        } else if($('.selected ').children().hasClass('fill_lock')){
          $('.selected').addClass('alert');
        }
      }

      var curr_box_val;
      if($(this).find('.selected').length > 0){
        curr_box_val = parseInt($('.selected').attr('id').split("_")[1]);
      } else if($(this).find('.alert').length > 0){
        curr_box_val = parseInt($('.alert').attr('id').split("_")[1]);
      }

      if(curr_box_val){
        if(e.which >= 37 && e.which <= 40){
          // do{
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
          // } while($('#box_' + curr_box_val).children().hasClass('fill_lock'))

          $('.selected, .alert').removeClass('selected alert');
          var curr_box = $('#box_' + curr_box_val);
          if(curr_box.children().hasClass('user_fill')){
            curr_box.addClass('selected');
          } else if(curr_box.children().hasClass('fill_lock')){
            curr_box.addClass('alert');
          }
          
        }
      }
    });

    $(document).on('keypress', function(e){
      if( !(e.which >= 49 && e.which <= 57) ){
        return false;
      }

      if($('.selected').children().hasClass('user_fill')){
        $('.selected .user_fill').text(String.fromCharCode(e.keyCode));
        checkDuplicate($('.selected .user_fill'), true);
        $('.duplicate').each(function(){
          checkDuplicate($(this), false);
        });

        var is_empty = false;
        $('.user_fill').each(function(){
          if($(this).text() == ''){
            is_empty = false;
            return false;
          } else {
            is_empty = true;  
          }
        });

        if(is_empty){
          var user_sol = [],
              num = 1;

          do{
            var sub_arr = [];

            do{
              sub_arr.push(parseInt($('#box_' + num++ + ' .input_box').text()));
            } while(sub_arr.length != 9)

            user_sol.push(sub_arr);
          } while(user_sol.length != 9)

          var getTime = $('.minute').text() + ':' + $('.second').text();

          if(user_sol.compare(basic_array)){
            alert("You Win! Time >> " + getTime);
            stopTimer();
          } else if(validateRowCol(user_sol)){
            console.log("Not unique solution!");
            alert("You Win! Time >> " + getTime);
            stopTimer();
          }
        }
      }
    });
  }

  var newGame = function(lvl){
    console.clear();

    clearBoard();
    resetTimer();
    stopTimer();
    startTimer();

    for(var count = 0; count < 2; count++){
      shuffleRandom();
      console.log(">>>Shuffle done = " + (count+1));
    }

    generateGame(lvl);

    fillBoard();
  }

  var gameTimer = function(){
    var getMin = $('.minute').text(),
        getSec = $('.second').text();

    if(getSec == '59'){
      getMin = parseInt(getMin) + 1;
      getSec = '00';
    } else if(getSec < 9){
      getSec = '0' + ( parseInt(getSec) + 1 );
    } else{
      getSec = parseInt(getSec) + 1 ;
    }

    $('.minute').text(getMin);
    $('.second').text(getSec);
  }

  var startTimer = function(){
    timer = setInterval(gameTimer, 1000);
  }

  var stopTimer = function(){
    clearInterval(timer);
  }

  var resetTimer = function(){
    $('.minute').text('0');
    $('.second').text('00');
  }

  var clearBoard = function(){empty_box = 0;

    $('#sdkBoard .input_box').each(function(){
      $(this).text("").removeClass('fill_lock user_fill');
    });

    $('.duplicate').each(function(){
      $(this).removeClass('duplicate');
    });

    $('.selected, .hovering, .alert').removeClass('selected hovering alert');
  }

  $.fn.initGrid = function(){
    var table_grid = generateGrid(true);
    if(table_grid) console.log("Grid generated.");

    var div_grid = document.getElementById('sdkBoard');
    div_grid.appendChild(table_grid);

    regEvents();

    newGame(3);
  };
})();