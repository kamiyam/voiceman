(function($){
    $(function(){
        $.voiceman = $.voiceman || {};

        //disp massage
        var dispMsg = $.voiceman.dispMsg = function ( data ){
            //画面にメッセージを表示する
            //上に表示されるメッセージが最新となる

            var message = data.message;
            if ( message == "" )
            {
                return;
            }

            var name = data.name;

            var msg = "";
            if ( name != null ) msg = name + "&nbsp;&gt;&nbsp;";
            msg += $('<div/>').html(message).text();

            var elem = $("<li>");
            elem.html( msg ).addClass("list").css({
                "opacity": 0.0
            }).hide();

            $( "#message" ).prepend( elem );

            var height = elem.height();
            elem.css({
                "height": 0
            }).show().animate({
                "height": height,
                "opacity": 1.0
            }, 200 );
        }

        //send message
        var sendMsg = $.voiceman.sendMsg = function(sendData){

            socket.emit("sendMsg", sendData );

        };


        var socket = io.connect( location.protocol + "//" + location.host );

        //
        socket.on('status', function (data) {

            var online = data.online;
            if ( typeof(online) == "number" ){
                $( "#online" )
              		.hide()
              		.css({
              			"opacity": 0.0
              		})
              		.html( online )
              		.show()
              		.animate({
              			"opacity": 1.0
              		}, 100 );
            }
        });

        //
        socket.on('message', dispMsg);



        $("#send").click(function(){

            //メッセージ入力欄が空白でなければメッセージを送信する
            var message = $( "#msg" ).val();
            if ( message === "" )
            {
                return;
            }
            var name = $( "#name" ).val();
            if ( name == null || name == "" ) name = "Anonymous";

            var sendData = {
                "name": name,
                "message": message
            };

            //
            sendMsg( sendData );

            $( "#msg" ).val( "" );
        });

    });

})(jQuery);