uid = "poop"

removeFriend = function(friend_dom){
	console.log(friend_dom);
	friend_name = friend_dom.text();
	if(confirm("Do you want to remove " + friend_name + " from your friends?")){
		//do it
		$.ajax({
			type:"GET",
			url: base_url+'/delete_friend',
			data: {uid: uid, deleteusername: friend_name},
			dataType:"json",
			beforeSend: function(){
				//LOADING ICON
			},
			success: function(data){
				//RED X, or GREEN CHECK, which will be erased when typing resumes
				friend_dom.remove();
			},
			//error: ,
			complete: function(){
				//set_friends_list();
			}
		});
	}
}

$.fn.itemFriendList = function() {
      this.each(function() {
        var $list = $(this);

        $list.children('label').each(function() {
          var $deleteButton = $('<div class="delete-item"></div>');

          $deleteButton.click(function() {
            removeFriend($(this).parent());
          });

          $(this).append($deleteButton);
        });


        // var $addButton = $('<div class="item add-item">Add one more...</div>');

        //$list.append($addButton);

        //$addButton.click(function() {
        //  var $inbox = $('<div class="item">'
        //                + '<div class="item-input-wrapper">'
        //                  + '<input class="item-input" type="text" name="focus-box">'
          //               + '</div>'
          //             + '</div>');

          // $inbox.insertBefore($list.children().last());

          // var $input = $inbox.find('input');
          // $input.focus();

          // $input.keypress(function(e) {
          //   var key = e.which;
          //   if (key === 13) {
          //     stopEditing($input, $inbox);
          //   }
          // });

          // $input.focusout(function() {
          //   stopEditing($input, $inbox);
          // });

          // function stopEditing(input, inbox) {
          //   var text = input.val();
          //   inbox.text(text);

            // var deletebutton = $('<div class="delete-item"></div>');

            // deletebutton.click(function(){
            //   $(this).parent().remove();
            // });

            //inbox.append(deletebutton);
          //}
        //});
      });
    }

var $submitButton = $('#submitButton');

$submitButton.on('click', function() {
    console.log('Submit');
});
un_input = $("#un-input");
un_input[0].addEventListener("input", function(){
	$.ajax({
		type:"GET",
		url: base_url+'/username_in_use',
		data: {username: un_input.val()},
		dataType:"json",
		beforeSend: function(){
			//LOADING ICON
		},
		success: function(data){
			//RED X, or GREEN CHECK, which will be erased when typing resumes
		},
		//error: ,
		complete: function(){
			//set_friends_list();
		}
	});
})
setButton = $("#set-btn");
checkButton = $("#check-btn");

setButton[0].addEventListener("click", function(){
	$.ajax({
		type:"GET",
		url: base_url+"/set_username",
		data:{uid: uid, username: un_input.val()},
		dataType:"json",
		success: function(data){

		}
	})
});
checkButton[0].addEventListener("click", function(){
	$.ajax({
		type:"GET",
		url: base_url+'/username_in_use',
		dataType:"json",
		beforeSend: function(){
			
		},
		success: function(data){
			//friends = data;
			//RED X, or GREEN CHECK, which will be erased when typing resumes
		},
		//error: ,
		complete: function(){
			//set_friends_list();
		}
	});
});