// ES6 format

(function(){
  Array.prototype.clone = function(){
		// deep copy of an array that contain an array within an array
		let new_arr = [];

		for(let _this of this){
			if(Array.isArray(_this)){
				let new_sub_arr = _this.clone();
				new_arr.push(new_sub_arr);
			} else{
				new_arr.push(_this);
			}
		}

		return new_arr;
	}

	Array.prototype.compare = function(array){
		for(let i = 0; i < this.length; i++){
			if(Array.isArray(this[i])){
				if(!this[i].compare(array[i]))	return false;
			} else if(this[i] !== array[i]){
				return false;
			}
		}

		return true;
	}

	let basic_array = [
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

  let game_array = [],
  		undo_arr = [],
  		key_pressed = false,
  		game_ongoing = false,
  		curr_lvl,
  		empty_box,
      timer;

  let shuffleNumbers = () => {
    // Shuffle between 2 numbers for 30 - 40 times
    let shuffleCount = Math.ceil(Math.random() * 10) + 30;

    for(let i = 0; i < shuffleCount; i++){
      let n1 = Math.ceil(Math.random() * 9),
          n2;

      do{
        n2 = Math.ceil(Math.random() * 9);
      } while(n1 == n2)
      
      for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
          if(basic_array[row][col] == n1){
            basic_array[row][col] = n2;
          } else if(basic_array[row][col] == n2){
            basic_array[row][col] = n1;
          }
        }
      }
    }

    console.log("Shuffle numbers for " + shuffleCount + " times.");
  }

  let shuffleReflect = () => {
		// Shuffle by reflecting according to axis
		let refl_arr = ['x', 'y', 'xy', 'yx'];
		let axis = refl_arr[Math.floor(Math.random() * 4)];

		let new_arr = [];

		switch(axis){
			case 'x':
				for (let row = 0; row < 9; row++) {
					new_arr.push(basic_array[8 - row]);
				}
				break;

			case 'y':
				for (let row = 0; row < 9; row++) {
					let new_sub_arr = [];

					for (let col = 0; col < 9; col++) {
						new_sub_arr.push(basic_array[row][8 - col]);
					}

					new_arr.push(new_sub_arr);
				}
				break;

			case 'xy':
				for (let col = 0; col < 9; col++) {
					let new_sub_arr = [];

					for (let row = 0; row < 9; row++) {
						new_sub_arr.push(basic_array[row][col]);
					}

					new_arr.push(new_sub_arr);
				}
				break;

			case 'yx':
				for (let col = 0; col < 9; col++) {
					let new_sub_arr = [];

					for (let row = 0; row < 9; row++) {
						new_sub_arr.push(basic_array[8 - row][8 - col]);
					}

					new_arr.push(new_sub_arr);
				}
				break;
		}

		console.log("Reflect : " + axis);

		basic_array = new_arr;
  }

  let shuffleRotate = () => {
		// Shuffle by rotating the board to certain degree
		let deg = Math.ceil(Math.random() * 3);

		for (let i = 0; i < deg; i++) {
			let new_arr = [];

			for (let col = 0; col < 9; col++) {
				let new_sub_arr = [];

				for (let row = 0; row < 9; row++) {
					new_sub_arr.push(basic_array[8 - row][col]);
				}

				new_arr.push(new_sub_arr);
			}

			basic_array = new_arr;
		}

		console.log("Rotate : " + (deg * 90) + " deg");
	}

	let shuffleSmallRow = () => {
    // Shuffle within inter-row
    let shuffleCount = Math.ceil(Math.random() * 10);

    for(let i = 0; i < shuffleCount; i++){
      let row = [];
      let mul = 3 * (Math.floor(Math.random() * 3));

      for(let j = 0; j < 3; j++){
        row.push(j + mul);
      }

      let n1 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0],
          n2;

      do{
        n2 = Math.floor(Math.random() * (row[row.length - 1] - row[0] + 1)) + row[0];
      } while(n1 == n2)

      let new_arr = [];

      for(let row  = 0; row < 9; row++){
        if(row == n1){
          new_arr.push(basic_array[n2]);
        } else if(row == n2){
          new_arr.push(basic_array[n1]);
        } else{
          new_arr.push(basic_array[row]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-row for : " + shuffleCount + " times");
  }	

  let shuffleSmallCol = () => {
    // Shuffle within inter-column
    let shuffleCount = Math.ceil(Math.random() * 10);

    for(let i = 0; i < shuffleCount; i++){
      let col = [];
      let mul = 3 * (Math.floor(Math.random() * 3));

      for(let i = 0; i < 3; i++){
        col.push(i + mul);
      }

      let n1 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0],
          n2;

      do{
        n2 = Math.floor(Math.random() * (col[col.length - 1] - col[0] + 1)) + col[0];
      } while(n1 == n2)

      let new_arr = []

      for(let row  = 0; row < 9; row++){
        let new_sub_arr = [];

        for(let col  = 0; col < 9; col++){
          if(col == n1){
            new_sub_arr.push(basic_array[row][n2]);
          } else if(col == n2){
            new_sub_arr.push(basic_array[row][n1]);
          } else{
            new_sub_arr.push(basic_array[row][col]);
          }
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle inter-column for : " + shuffleCount + " times");
  }

  let shuffleBigRow = () => {
    // Shuffle within outer-row
    let shuffleCount = Math.ceil(Math.random() * 5);

    for(let i = 0; i < shuffleCount; i++){
      let arr_row = [0,3,6];

      let n1 = Math.floor(Math.random() * 3),
          n2;

      do{
        n2 = Math.floor(Math.random() * 3);
      } while(n1 == n2)

      let new_arr = [];

      for(let row = 0; row < 9; row = row + 3){
        let curr;

        if(row == arr_row[n1]){
          new_arr.push(basic_array[arr_row[n2]]);
          curr = arr_row[n2];
        } else if(row == arr_row[n2]){
          new_arr.push(basic_array[arr_row[n1]]);
          curr = arr_row[n1];
        } else{
          new_arr.push(basic_array[row]);
          curr = row;
        }

        for(let count = 1; count < 3; count++){
          new_arr.push(basic_array[curr + count]);
        }
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-row for : " + shuffleCount + " times.")
  }

  let shuffleBigCol = () => {
    // Shuffle within outer-column
    let shuffleCount = Math.ceil(Math.random() * 5);

    for(let i = 0; i < shuffleCount; i++){
      let arr_col = [0,3,6];

      let n1 = Math.floor(Math.random() * 3),
          n2;

      do{
        n2 = Math.floor(Math.random() * 3);
      } while(n1 == n2)

      let new_arr = [];

      for(let row  = 0; row < 9; row++){
        let new_sub_arr = [];

        for(let col = 0; col < 9; col = col + 3){
          let curr;

          if(col == arr_col[n1]){
            new_sub_arr.push(basic_array[row][arr_col[n2]]);
            curr = arr_col[n2];
          } else if(col == arr_col[n2]){
            new_sub_arr.push(basic_array[row][arr_col[n1]]);
            curr = arr_col[n1];
          } else{
            new_sub_arr.push(basic_array[row][col]);
            curr = col;
          }

          for(let count = 1; count < 3; count++){
            new_sub_arr.push(basic_array[row][curr + count]);
          }
        }

        new_arr.push(new_sub_arr);
      }

      basic_array = new_arr;
    }

    console.log("Shuffle outer-column for : " + shuffleCount + " times.");
  }

  let shuffleRandom = () => {
    // Randomize shuffling function call
    let shuffle_arr = [
      shuffleNumbers, shuffleReflect, shuffleRotate,
      shuffleSmallRow, shuffleSmallCol, shuffleBigCol,
      shuffleBigRow
    ];

    // Randomly pick a shuffling function to call, then delete the function from
    // the array to prevent calling again. Repeat until there is no function to
    // delete.
    let index;

    while (shuffle_arr.length != 0) {
			index = Math.floor(Math.random() * shuffle_arr.length);
			shuffle_arr[index]();
			shuffle_arr.splice(index, 1);
    }

   //  // The idea is to pick random function and throw it to the end of the array,
   //  // and reduce the count by 1 in each loop, so the last function in the array
   //  // won't be picked again.
   //  let curr_idx = shuffle_arr.length,
   //      random_idx, 
   //      temp;

   //  while(curr_idx != 0){
   //    random_idx = Math.floor(Math.random() * curr_idx);
   //    --curr_idx;

   //    temp = shuffle_arr[curr_idx];
   //    shuffle_arr[curr_idx] = shuffle_arr[random_idx];
   //    shuffle_arr[random_idx] = temp;
   //  }

   //  // start function call
   //  let index;
   //  while(index){
			// index = Math.floor(Math.random() * shuffle_arr.length);
			// shuffle_arr[index]();
			// shuffle_arr.splice(index, 1);
   //  }
    
   //  for(let func of shuffle_arr){
			// func();
   //  }
  }

  let generateGrid = (lvl, box, row, col) => {
    // Generate table grid for the game
    let count_box = lvl ? 0 : box;
    let count_row = lvl ? 1 : row;
    let count_col = lvl ? 1 : col;

    // In the grid, each column in each row will have another table inside, using
    // recursive method, call this function again when creating the second table
    // element in each column.
    let table_grid = document.createElement('table');
    // table_grid.className = !lvl ? 'sub_grid' : "";

    for(let i = 0; i < 3; i++){
      let table_row = document.createElement('tr');
      table_row.className = !lvl ? 'row_' + count_row++ : "";

      for(let j = 0; j < 3; j++){
        let table_col = document.createElement('td');

        if(lvl){
          table_col.id = 'Box_' + String.fromCharCode(65 + i) + (j + 1);

          let table_grid2 = generateGrid(false, count_box, count_row, count_col);
          table_col.appendChild(table_grid2);

          count_box += 3;
          count_col += 3;
        } else {
          table_col.id = 'box_' + (++count_box);
          table_col.className = 'col_' + count_col++ + ' box';

          let input = document.createElement('span');
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

  let generateGame = () => {
    // Based on level picked, randomly pick numbers from each row, 
    // and remove it
    game_array = basic_array.clone();

    for(let row = 0; row < 9; row++){
      let random_arr = [];

      for(let i = 0; i < Math.floor(Math.random() * 2) + curr_lvl; i++){
        let random_col = Math.floor(Math.random() * 9);

        for(let count = 0; count < random_arr.length; count++){
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

  let validateRowCol = (arr) => {
    // If total of each row and total of each column is 45, then proceed, else 
    // the game is not valid and not playable, which is impossible, unless
    // there is something wrong with the shuffling.
    for(let row = 0; row < 9; row++){
      let total_c_val = 0,
          total_r_val = 0;

      for(let col = 0; col < 9; col++){
        total_c_val += arr[row][col];
        total_r_val += arr[col][row];
      }

      if(total_c_val != 45 || total_r_val != 45){
        return false;
      }
    }

    return true;
  }

  let fillBoard = () => {
    // Fill the grid with numbers
    let arr_col = 0,
        arr_row = 0;

    if(validateRowCol(basic_array)){
      for(let i = 1; i <= 81; i++){
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

  let getRelatedBoxes = (elem) => {
			// Get related row, column and parent box for the selected box
			let row = [],
					col = [],
					box = [];

			let this_row = '.' + elem.closest('tr[class^="row_"]').attr('class'),
					this_col = '.' + elem.closest('td[class^="col_"]').attr('class').split(" ")[0],
					this_box = '#' + elem.closest('td[id^="Box_"]').attr('id');

			$(this_row).each(function() {
					$(this).find('.input_box').each(function() {
							if ($(this).text() != "") {
									row.push({
											id: $(this).parent().attr('id'),
											val: $(this).text()
									});
							}
					});
			});

			$(this_col).each(function() {
					$(this).find('.input_box').each(function() {
							if ($(this).text() != "") {
									col.push({
											id: $(this).parent().attr('id'),
											val: $(this).text()
									});
							}
					});
			});

			$(this_box).find('.input_box').each(function() {
					if ($(this).text() != "") {
							box.push({
									id: $(this).parent().attr('id'),
									val: $(this).text()
							});
					}
			});

			return {
					row, col, box
			};
  }

  let recordVal = (val) => {
    // Push object containing box id, previous value and current value to the
    // array
    undo_arr.push({
      box_id : '#' + $('.selected').attr('id'),
      prev_box_val : $('.selected .user_fill').text(),
      curr_box_val : val
    });
  }

  let checkDuplicate = (elem, bool) =>  {
    // Check whether entered number already has another number exist in the same
    // row, column, or parent box, and when a number is removed, check whether the 
    // duplicate numbers still valid 
    let val = elem.text();
    let dul = getRelatedBoxes(elem);

    if(bool){
      for(let row of dul.row){
        let box_val = $('#' + row.id + ' .input_box');

        if(row.val == val && row.id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }

      for(let col of dul.col){
        let box_val = $('#' + col.id + ' .input_box');

        if(col.val == val && col.id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }

      for(let box of dul.box){
        let box_val = $('#' + box.id + ' .input_box');

        if(box.val == val && box.id != elem.parent().attr('id')){
          box_val.addClass('duplicate');
          elem.addClass('duplicate');
        }
      }
    } else {
			let this_parent = elem.parent(),
					val = elem.text();

      let bool_row = false,
          bool_col = false,
          bool_box = false;

      for(let row of dul.row){
        if(row.val == val && row.id != this_parent.attr('id')){
          bool_row = true;
        }
      }

      for(let col of dul.col){
				if(col.val == val && col.id != this_parent.attr('id')) {
          bool_col = true;
        }
      }

      for(let box of dul.box){
        if(box.val == val && box.id != this_parent.attr('id')){
          bool_box = true;
        }
      }

      if(!bool_row && !bool_col && !bool_box){
        elem.removeClass('duplicate');
      }
    }
  }

  let gameTimer = () => {
    // Set game timer
    let getMin = $('.minute').text(),
        getSec = $('.second').text();

    // Automatically round up to 1 more minute for every 60 seconds passed
    if(getSec == '59'){
			getMin = parseInt(getMin) + 1;
      getSec = '00';
    } else if(getSec < 9){
      // Add a zero infront if the number is only a single digit
      getSec = '0' + ( parseInt(getSec) + 1 );
    } else{
      getSec = parseInt(getSec) + 1;
    }

    $('.minute').text(getMin);
    $('.second').text(getSec);
  }

  let startTimer = () => {
    // Start game timer
    timer = setInterval(gameTimer, 1000);
    game_ongoing = true;
  }

  let stopTimer = () => {
    // Stop game timer
    clearInterval(timer);
    game_ongoing = false;
  }

  let resetTimer = () => {
    // Reset game timer
    $('.minute').text('0');
    $('.second').text('00');
  }

  let toggleOverlay = (clsName, callback) => {
    // Toggle overlay animation to show or hide
    if($('#overlay').css('display') == 'none'){
      $('#overlay').fadeIn('fast', function(){
        $(clsName).animate({
          'top' : 0
        },500, function(){
          // Call the callback function if available
          if(callback){
            callback();
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
          callback();
        }
      });
    }
  }

  let continueNewLevel = () => {
    // Stop timer after complete game
    stopTimer();

    // Always reset the final time displayed
    $('.winMin, .winSec').text("0");

    // Toggle the overlay first and then run the animation.
    toggleOverlay('.complete', function(){
      $('.winMin, .winSec').each(function(){
        let num;

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
    });
  }

  let checkAnswer = () => {
    // Check number of empty box left
    let is_empty = false;

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
				let user_sol = [],
          num = 1;

      // Push every single number into an array
      do{
        let sub_arr = [];

        do{
          sub_arr.push(parseInt($('#box_' + num++ + ' .input_box').text()));
        } while(sub_arr.length != 9)

        user_sol.push(sub_arr);
      } while(user_sol.length != 9)

      if( user_sol.compare(basic_array) || validateRowCol(user_sol) ){
        continueNewLevel();
      }
    }
  }

  let inputNum = (num, keyboard) => {
    // Only proceed when in user editable box and the entered number is 
    // different from the current one in the box
    if( $('.selected').children().hasClass('user_fill') && 
        $('.selected .user_fill').text() != num ){
      // key_pressed = allow only single input per keypress
      if( (!key_pressed && keyboard) || !keyboard ){
        // Record the next move
        recordVal(num);

        // Fill the box with the entered number
        $('.selected .user_fill').text(num);

        checkDuplicate($('.selected .user_fill'), true);

        $('.duplicate').each(function(){
          checkDuplicate($(this), false);
        });

        if( !key_pressed && keyboard ){
          key_pressed = true;
        }

        checkAnswer();
      }
    } else {
      console.warn("No cell selected!");
    }
  }

  let deleteNum = (keyboard) => {
    if( $('.selected').children().hasClass('user_fill') && 
        $('.selected .user_fill').text() != "" ){
      // key_pressed = allow only single input per keypress
      if( (!key_pressed && keyboard) || !keyboard ){
        // Record the next move
        recordVal("");

        // Empty the box by delete the number
        $('.selected .user_fill').text("");

        $('.duplicate').each(function(){
          checkDuplicate($(this), false);
        });

        if( !key_pressed && keyboard ){
          key_pressed = true;
        }
      }
    }
  }

  let confirmationPopup = (status) => {
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

  let undoLastMove = () => {
    // Undo the last move
    if(undo_arr.length > 0){
      let last_move = undo_arr[undo_arr.length - 1];

      $(last_move.box_id + ' span').text(last_move.prev_box_val);

      undo_arr.splice(undo_arr.length - 1, 1);

      checkDuplicate($(last_move.box_id + ' span'), true);

      $('.duplicate').each(function(){
        checkDuplicate($(this), false);
      });
    }
  }

  let clearBoard = () => {
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

  let newGame = () => {
			// Start new game with specified level
			console.clear();

			clearBoard();

			resetTimer();
			stopTimer();
			startTimer();

			for (let count = 1; count <= 2; count++) {
					shuffleRandom();
					console.log(">>>Shuffle done = " + (count));
			}

			generateGame();

			fillBoard();
  }

  let restartGame = () => {
			// Restart the same game
			clearBoard();

			resetTimer();
			stopTimer();
			startTimer();

			console.log('Restart Game.');
			fillBoard();
  }

  let regEvents = () => {
    // Start game with level : easy, medium, hard, expert
    $('#lvl1, #lvl2, #lvl3, #lvl4').on('click',function(){
      // If a game is currently on going, show popup confirmation first
			curr_lvl = parseInt($(this).attr('id').split('lvl')[1]) + 2;

      if(game_ongoing){
        confirmationPopup('new');
      } else{
        // Set the current level number
        newGame();
      }
    });

    $('.userOk, .userCancel').on('click', function(){
      // Toggle overlay first and then start the new game
      toggleOverlay('.confirmation', () => {
          // Get current status whether is new game or restart game
          let status = $('.confirmation').attr('curr-status');

          // Show popup info according to status
          if(this.className == 'userOk') {
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
        }
      );
    });

    $('.continueGame').on('click', function(){
      // Ask user whether to continue the game with the next difficulty level
      // after finish each game. Keep going until the hardest difficulty again
      // and again. 
      if(curr_lvl){
        // Toggle popup overlay
        toggleOverlay('.complete', function(){
          if (curr_lvl < 6) {
              curr_lvl += 1;
          }

          newGame();
        });
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

    // About the game and instruction on how to play
    $('#about, #exit').on('click', function(){
      // If the game is ongoing, stop timer, and set game_ongoing to true
      if(this.id == 'about' && game_ongoing) {
        stopTimer();
        game_ongoing = true;
      }
      
      toggleOverlay('.about', () => {
        // If the game is ongoing, just start timer
        if(this.id == 'exit' && game_ongoing){
          startTimer();
        }
      });
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
			inputNum($(this).text(), false);
      // let num = $(this).text();

      // if(isNaN(num)){
      //   return false;
      // } else {
      //   inputNum(num, false);
      // }
    });

    $(document).on('keydown', function(e){
      // Enable undo using ctrl + z
      if( e.ctrlKey == true && e.which == 90 ){
        undoLastMove();
      }

      // Enable delete using backspace
      if( e.which == 8 ){
        deleteNum(true);
      }

      if( e.which >= 37 && e.which <= 40 ){
        // Navigate the game using arrow keys, first get the current box id, then 
        // move to the next box accoring to arrow key pressed.
        let curr_box_val;

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

        let curr_box = $('#box_' + curr_box_val);

        if(curr_box.children().hasClass('user_fill')){
          curr_box.addClass('selected');
        } else if(curr_box.children().hasClass('fill_lock')){
          curr_box.addClass('alert');
        } 
      }
    });

    $(document).on('keypress', function(e){
      // Only allows number as input
      if(!( e.which >= 49 && e.which <= 57 )){
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

  $.fn.initGrid = () => {
    // Initialize sudoku game
    $('#sdkBoard')
      .append(generateGrid(true))
      .find('> table table')
      .each(function(i){
        setTimeout(() => {
          // Animate the grid
          $(this).addClass('sub_grid');
        }, 100 * i);
      });

    console.log("Grid generated.");

    regEvents();
  };
})();