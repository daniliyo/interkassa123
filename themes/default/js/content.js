$(function(){
	$('body').tooltip({selector: '[rel="tooltip"]'});

	$.qx = {
		server_ip: $('meta[name="server_ip"]').attr('content'),
	};

	$(".notify > .notify-close").click(function(){
		$(this).parent().fadeOut("normal");
		return false;
	});

	$('[name="delete"]').click(function(){
		if(!confirm("Вы уверены, что хотите удалить выбранные элементы?")){ return false; }
		return true;
	});

	$.ajax({
		url: "index.php?do=ajax&op=get_monitor", 
		dataType: "json",
		type: 'POST',
		async: true,

		error: function(data){ console.log(data); return false; },

		success: function(data){

			$("#server-ip > abbr").text(data._data.online);

		}
	});

	$("body").on("click", ".buy-item", function(){

		var formid = $(this).closest('.item-id').attr('id');

		var id = formid.split('_'); iid = id[2];
		var player = $('#'+formid+' .buy-login').val();

		if(player==''){ return false; }

		$("#"+formid+" .buy-item").html('<img src="/uploads/ajax-loader.gif" alt="loading..." />').prop('disabled', true);

		$.ajax({
			url: "index.php?do=ajax&op=get_option", 
			dataType: "json",
			type: 'POST',
			async: true,
			data: "act=new_trans&iid=" + iid + "&player=" + player,

			success: function(data){
				if(data._type == 'error'){
					$('#'+formid+' .buy-item').text(data._text);
					return false;
				}

				var invdesc		= $('#'+formid+' input[name="desc"]').val();
				var newinvdesc	= invdesc.replace(/\[LOGIN\]/g, data._data.i_login);

				$('#'+formid+' input[name="sum"]').val(data._data.i_price);
				$('#'+formid+' input[name="account"]').val(data._data.i_id);
				$('#'+formid+' input[name="desc"]').val(newinvdesc);

				$("#"+formid+" .modal-content")[0].submit();

			}
		});

		return false;
	});

	$("body").on("keyup", ".buy-login", function(){

		
		var formid = $(this).closest('.item-id').attr('id');

		var id = formid.split('_'); iid = id[2];
		var player = $('#'+formid+' .buy-login').val();

		$("#"+formid+" .buy-item").html('<img src="/uploads/ajax-loader.gif" alt="loading..." />').prop('disabled', true);

		if(typeof timeout != 'undefined'){ clearTimeout(timeout); }

		timeout = setTimeout(function(){
			$.ajax({
				url: "index.php?do=ajax&op=get_option",
				dataType: "json",
				type: 'POST',
				async: true,
				data: "act=get_price&iid=" + iid + "&player=" + player,

				error: function(data){
					$("#"+formid+" .buy-item").html('Ошибка! Повторите попытку');
					return false;
				},

				success: function(data){

					if(data._type == 'error'){
						$('#'+formid+' .buy-item').text(data._text);
						return false;
					}

					$('#'+formid+' .buy-item').text('Купить за '+data._data.i_price+' руб.').prop('disabled', false);
				}
			});
		}, 2000);

		return false;
	});
	
});