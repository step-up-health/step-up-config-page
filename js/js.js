anchors = window.location.hash.substring(1)
    .split(':');
uid = anchors[0] || 'poop';
timeline = anchors[1];
base_url = 'https://pythonbackend-stepupforpebble.rhcloud.com';
var $submitButton = $('#submitButton');
$submitButton.on('click', function() {
    console.log('Submit');
    location.href = 'pebblejs://close#';
});

function get_friends_error() {
    friends = [];
    $('#itemlist')
        .appendChild($('<label class="item">ERROR FINDING FRIENDS</label>'));
};

function incoming_button_callback() {
    sendFriendRequest($(this)
        .parent()
        .data('username'),
        function() {
            // success
            reloadFriends();
        },
        function(err) {
            alert('Something went wrong—friend request from ' + fname + ' not accepted.');
            console.log(err);
        });
}

function set_friends_list() {
    $('#itemlist')
        .empty();
    for (i = 0; i < friends.length; i++) {
        newitem = $('<label class="item"></label>');
        newitem.text(friends[i]);
        $('#itemlist')
            .append(newitem);
    }
    if (friends.length === 0) {
        newitem = $('<div>You don\'t have any friends yet.</div>');
        $('#itemlist')
            .append(newitem);
    }
    $('#itemlist')
        .itemFriendList();
}

function set_outgoing_friends() {
    $('#itemlist-outgoing').empty();
    for (i = 0; i < outgoing_friend_requests.length; i++) {
        newitem = $('<label class="item"></label>');
        newitem.text(outgoing_friend_requests[i]);
        newitem.addClass('pending');
        $('#itemlist-outgoing')
            .append(newitem);
    }
    if (outgoing_friend_requests.length === 0) {
        newitem = $('<div>No outgoing friend requests.</div>');
        $('#itemlist-outgoing')
            .append(newitem);
    }
}

function set_incoming_friends() {
    $('#itemlist-incoming')
        .empty();
    for (i = 0; i < incoming_friend_requests.length; i++) {
        newitem = $('<label class="item"></label>');
        newitem.text(incoming_friend_requests[i]);
        newitem.data('username', incoming_friend_requests[i]);
        var acceptButton = $('<input type="button" value="Accept"' + 'class="item-button item-input-button"/>');
        newitem.addClass('incoming');
        newitem.append(acceptButton);
        $('#itemlist-incoming')
            .append(newitem);
        newitem.find('input')
            .on('click', incoming_button_callback);
    }
    if (incoming_friend_requests.length === 0) {
        newitem = $('<div>No incoming friend requests.</div>');
        $('#itemlist-incoming')
            .append(newitem);
    }
}

function reloadFriends() {
    $.ajax({
        type: 'GET',
        url: base_url + '/get_friends',
        data: {
            uid: uid
        },
        dataType: 'json',
        beforeSend: function() {
            $('#itemlist')
                .empty();
            $('#itemlist')
                .append($('<div class="loader">loading</div>'));
        },
        success: function(data) {
            $('#itemlist')
                .empty();
            friends = data;
            console.log(friends);
        },
        error: get_friends_error,
        complete: function() {
            set_friends_list();
        }
    });
    $.ajax({
        type: 'GET',
        url: base_url + '/get_outgoing_friend_reqs',
        data: {
            uid: uid
        },
        dataType: 'json',
        beforeSend: function() {
            $('#itemlist-outgoing')
                .empty();
            $('#itemlist-outgoing')
                .append($('<div class="loader">loading</div>'));
        },
        success: function(data) {
            $('#itemlist-outgoing')
                .empty();
            outgoing_friend_requests = data;
        },
        error: function(err) {
            console.log('Problem getting outgoing friend reqs:', err);
            outgoing_friend_requests = [];
        },
        complete: function() {
            set_outgoing_friends();
        }
    });
    $.ajax({
        type: 'GET',
        url: base_url + '/get_incoming_friend_reqs',
        data: {
            uid: uid
        },
        dataType: 'json',
        beforeSend: function() {
            $('#itemlist-incoming')
                .empty();
            $('#itemlist-incoming')
                .append($('<div class="loader">loading</div>'));
        },
        success: function(data) {
            $('#itemlist-incoming')
                .empty();
            incoming_friend_requests = data;
        },
        error: function(err) {
            console.log('Problem getting incoming friend reqs:', err);
            incoming_friend_requests = [];
        },
        complete: function() {
            set_incoming_friends();
        }
    });
}
var friends;
var outgoing_friend_requests;
$.ajax({
    type: 'GET',
    url: base_url + '/get_username',
    data: {
        uid: uid
    },
    dataType: 'json',
    success: function(data) {
        //alert(data);
        un_input.val(data);
    },
    error: function(err) {
        newUserPopup();
    }
});

function removeFriend(friend_dom) {
    console.log(friend_dom);
    friend_name = friend_dom.text();
    if (confirm('Do you want to remove ' + friend_name + ' from your friends?')) {
        //do it
        $.ajax({
            type: 'GET',
            url: base_url + '/delete_friend',
            data: {
                uid: uid,
                deleteusername: friend_name
            },
            beforeSend: function() {
                //LOADING ICON
            },
            success: function(data) {
                //RED X, or GREEN CHECK, which will be erased when typing resumes
                friend_dom.remove();
            },
            //error: ,
            complete: function() {
                //set_friends_list();
            }
        });
    }
}

function addFriendDom(friendName) {
    var newitem = $('<label class="item"></label>');
    newitem.text(friendName);
    newitem.addClass('pending');
    reloadFriends();
}
$.fn.itemFriendList = function() {
    this.each(function() {
        var $list = $(this);
        $list.children('label')
            .each(function() {
                var $deleteButton = $('<div class="delete-item"></div>');
                $deleteButton.click(function() {
                    removeFriend($(this)
                        .parent());
                });
                $(this)
                    .append($deleteButton);
            });
        // var $addButton = $('<div class="item add-item">Add one more...</div>');
        //$list.append($addButton);
    });
};
un_input = $('#un-input');
un_input[0].addEventListener('input', function() {
    $.ajax({
        type: 'GET',
        url: base_url + '/username_in_use',
        data: {
            username: un_input.val(),
            uid: uid
        },
        dataType: 'json',
        beforeSend: function() {
            //LOADING ICON
        },
        success: function(data) {
            console.log(data);
            if (data == '"False"') {
                $('#border-target')
                    .removeClass('bad');
                $('#border-target')
                    .addClass('good');
                $('#un-label')
                    .text('Username available!');
            } else {
                $('#border-target')
                    .removeClass('good');
                $('#border-target')
                    .addClass('bad');
                $('#un-label')
                    .text('Username already taken.');
            }
            //RED X, or GREEN CHECK, which will be erased when typing resumes
        },
        error: function(data) {
            console.log('we lost');
            console.log(data);
        },
        complete: function() {
            //set_friends_list();
        }
    });
});
un_input.keypress(function(e) {
    var key = e.which;
    if (key === 13) {
        set_username();
    }
});
$('#friend-input')
    .keypress(function(e) {
        var key = e.which;
        if (key === 13) {
            friendClick($(this)[0].value, $(this));
        }
    });
setButton = $('#set-btn');
checkButton = $('#check-btn');
friendButton = $('#friend-btn');

function set_username() {
    uname = un_input.val();
    $.ajax({
        type: 'GET',
        url: base_url + '/set_username',
        data: {
            uid: uid,
            username: uname
        },
        success: function(data) {
            if (data == 'ok') {
                alert('Name was successfully changed to ' + uname + '!');
            } else {
                alert('Name was successfully set to ' + uname + '!');
            }
        },
        error: function(e) {
            alert('Something went wrong!  Name was NOT set to ' + uname + '.');
        },
        complete: function() {
            //console.log("e");
        }
    });
};
setButton[0].addEventListener('click', set_username);

function sendFriendRequest(fname, success, failure) {
    $.ajax({
        type: 'GET',
        url: base_url + '/send_friend_request',
        data: {
            uid: uid,
            addusername: fname
        },
        beforeSend: function() {},
        success: function(data) {
            console.log(data);
            console.log(data.length);
            success();
        },
        error: function(e) {
            console.log(e);
            failure(e);
        },
        complete: function() {}
    });
}
friendButton[0].addEventListener('click', function() {
    fname = $(this)
        .prev()
        .children()[0].value;
    inpu = $(this)
        .prev()
        .children()[0];
    sendFriendRequest(fname, function() {
        addFriendDom(fname);
        inpu.value = '';
    }, function() {
        alert('Something went wrong—friend request not sent to ' + fname + '.');
    });
});
reloadFriends();
