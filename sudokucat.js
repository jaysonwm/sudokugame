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
      empty_box;

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

  var generateGrid = function(lvl, box){
    var count = 0;
    var table_grid = document.createElement('table');
    if(!lvl){
      table_grid.border = 1;
      count = box;
    }

    for(var i = 0; i < 3; i++){
      var table_row = document.createElement('tr');

      for(var j = 0; j < 3; j++){
        var table_col = document.createElement('td');
        if(lvl){
          var table_grid2 = generateGrid(false, count);
          table_col.appendChild(table_grid2);

          count = count + 3;
        } else {
          table_col.id = "box_" + (++count);

          var input_box = document.createElement('input');
          input_box.maxLength = 1;
          table_col.appendChild(input_box);
        }

        table_row.appendChild(table_col);
      }

      table_grid.appendChild(table_row);
      
      if(lvl){
        count = count + 18;
      } else{
        count = count + 6;
      }
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
          $('#box_' + i + ' input').val(game_array[arr_row][arr_col]);
        } else {
          $('#box_' + i + ' input').addClass('fill_clean').prop('disabled', false);
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

      if(total_c_val != 45 && total_r_val != 45){
        return false;
      }
    }

    return true;
  }

  var regEvents = function(){
    $('input').on('keydown', function(e){
      if( !((e.which >= 49 && e.which <= 57) || (e.which >= 97 && e.which <= 105) || e.which == 8) ){
        return false;
      }

      if( $(this).hasClass('fill_dirty') && e.which == 8 ){
        $(this).addClass('fill_clean').removeClass('fill_dirty');
      } else if( $(this).hasClass('fill_clean') && ((e.which >= 49 && e.which <= 57) || (e.which >= 97 && e.which <= 105)) ){
        $(this).addClass('fill_dirty').removeClass('fill_clean');
      }
    });

    $('.fill_clean, .fill_dirty').on('keyup', function(e){
      var is_empty = false;
      $('#sdkBoard input').each(function(){
        if($(this).hasClass('fill_clean')){
          is_empty = false;
          return false;
        } else {
          is_empty = true;  
        }
      })

      if(is_empty){
        var user_sol = [],
            num = 1;

        do{
          var sub_arr = [];

          do{
            sub_arr.push(parseInt($('#box_' + num++ + ' input').val()));
          } while(sub_arr.length != 9)

          user_sol.push(sub_arr);
        } while(user_sol.length != 9)

        if(user_sol.compare(basic_array)){
          alert("You Win!");
        } else if(validateRowCol(user_sol)){
          console.log("Not unique solution!");
          alert("You Win!")
        }
      }
    });
  }

  var regLevel = function(){
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
  }

  var newGame = function(lvl){
    clearBoard();

    for(var count = 0; count < 2; count++){
      shuffleRandom();
      console.log(">>>Shuffle done = " + (count+1));
    }

    generateGame(lvl);

    fillBoard();
    
    regEvents();
  }

  var clearBoard = function(){
    empty_box = 0;
    $('#sdkBoard input').each(function(){
      $(this).val("").prop('disabled', true).removeClass('fill_clean fill_dirty');
    })
  }

  $.fn.initGrid = function(){
    var table_grid = generateGrid(true);
    if(table_grid) console.log("Grid generated.");

    var div_grid = document.getElementById('sdkBoard');
    div_grid.appendChild(table_grid);

    clearBoard();
    regLevel();
  };
})();