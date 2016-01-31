anchors = window.location.hash.substring(1).split(':');
uid = anchors[0] || "poop";
timeline = anchors[1];
// k = $("<div></div");
// k.text(uid);
// $("body").append(k);

base_url = "https://pythonbackend-stepupforpebble.rhcloud.com"
//alert(window.location.hash);
var $submitButton = $('#submitButton');

$submitButton.on('click', function() {
    console.log('Submit');
    alert("SUBMIT BOTTON2");

    //var return_to = getQueryParam('return_to', 'pebblejs://close#');
    location.href = 'pebblejs://close#'; //+ encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
});



get_friends_error = function(){
		friends = [];
		$("#itemlist").appendChild($('<label class="item">ERROR FINDING FRIENDS</label>'));
	}
//SET THIS BEFORE HACKATHON--------------------------------------------------------------------
	get_friends_error_hack = function(){
		friends = ["Donald Glover", "Dave Chappelle", "Louis Szekely", "Aziz Ansari"];
	}
	set_friends_list = function(){
		for(i = 0; i < friends.length; i++){
			newitem = $('<label class="item"></label>');
			newitem.text(friends[i]);
			$("#itemlist").append(newitem);
		}
		if(friends.length == 0){
			newitem = $('<div>YOU HAVE NO FRIENDS rn</div>');
			$("#itemlist").append(newitem);
		}
		$('.item-friend-list').itemFriendList();
	}
	var friends;
	$.ajax({
		type:"GET",
		url: base_url+'/get_friends',
		data:{uid:uid},
		dataType:"json",
		beforeSend: function(){
			$("#itemlist").append($('<div id="loader" class="loader">loading</div>'))
		},
		success: function(data){
			friends = data;
			console.log(friends);
		},
		error: get_friends_error_hack,
		complete: function(){$("#loader").remove();set_friends_list();}
	});
	$.ajax({
		type:"GET",
		url: base_url+'/get_username',
		data:{uid:uid},
		dataType:"json",
		success:function(data){
			//alert(data);
			un_input.val(data);
		}
	});
removeFriend = function(friend_dom){
	console.log(friend_dom);
	friend_name = friend_dom.text();
	if(confirm("Do you want to remove " + friend_name + " from your friends?")){
		//do it
		$.ajax({
			type:"GET",
			url: base_url+'/delete_friend',
			data: {uid: uid, deleteusername: friend_name},
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

addFriendDom = function(friendName){
	var newitem = $('<label class="item"></label>');
	newitem.text(friendName);
	$("#itemlist").append(newitem);
	$('.item-friend-list').itemFriendList();
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
      });
    }



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
			console.log(data);
			$("border-target").removeClass("bad");
			$("border-target").addClass("good");
			$("border-target").removeClass("good");
			$("border-target").addClass("bad");


			//RED X, or GREEN CHECK, which will be erased when typing resumes
		},
		error: function(data){
			console.log("we lost");
			console.log(data);
		},
		complete: function(){
			//set_friends_list();
		}
	});
})
un_input.keypress(function(e) {
            var key = e.which;
            if (key === 13) {
              set_username();
            }
          });

setButton = $("#set-btn");
checkButton = $("#check-btn");
friendButton = $("#friend-btn");
set_username = function(){
	uname = un_input.val();
	$.ajax({
		type:"GET",
		url: base_url+"/set_username",
		data:{uid: uid, username: uname},
		success: function(data){
			if(data=="ok"){
				alert("Name was successfully changed to " + uname + "!");
			} else{
				alert("Name was successfully set to " + uname + "!");
			}
		},
		error: function(e){
			alert("Something went wrong!  Name was NOT set to " + uname + ".");
		},
		complete: function(){
			//console.log("e");
		}
	})
}
setButton[0].addEventListener("click", set_username);
// checkButton[0].addEventListener("click", function(){
// 	$.ajax({
// 		type:"GET",
// 		url: base_url+'/username_in_use',
// 		dataType:"json",
// 		beforeSend: function(){
			
// 		},
// 		success: function(data){
// 			//friends = data;
// 			//RED X, or GREEN CHECK, which will be erased when typing resumes
// 		},
// 		//error: ,
// 		complete: function(){
// 			//set_friends_list();
// 		}
// 	});
// });
friendButton[0].addEventListener("click", function(){
	fname = $(this).prev().children()[0].value;
	self = $(this);
	$.ajax({
		type:"GET",
		url: base_url+'/send_friend_request',
		data:{uid: uid, addusername: fname},
		beforeSend:function(){

		},
		success: function(data){
			alert("Friend request sent to " + fname + "!");
			
				addFriendDom(fname);
				self.prev().children()[0].value='';
				//[0].empty();
				console.log(data);
				console.log(data.length);
		},
		error: function(e){
			alert("Oh no!  Friend request NOT sent to " + fname + "!");
			console.log(e);
		},
		complete: function(){

		}
	})
})

