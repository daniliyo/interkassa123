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
				
				$('#'+formid+' input[name="ik_am"]').val(data._data.i_price);
				$('#'+formid+' input[name="ik_pm_no"]').val(data._data.i_id);
				$('#'+formid+' input[name="ik_desc"]').val(newinvdesc);
				
				

				$("#"+formid+" .modal-content")[0].submit();

			},
			complete: function (response) {
			    
			}
			
		});

		return false;
	});
	
	$(document).on("click",'.choose-pay__item label', function(){
	        var login = $(this).closest('.item-id').find(".buy-login").val();
	        var formid = $(this).closest('.item-id').attr("id");
	        
	        $(this).closest('label').find("input:first").prop('checked', true);
	        
	        var syspay = $(this).find("input:first").val();
	        if(syspay == 'unitpay'){
	            var paymentMethod = $(this).find("input:first").attr('url');
	        } else if(syspay == 'interkassa'){
	           var paymentMethod = 'https://sci.interkassa.com'; 
	        }
	        
	        $("#"+formid+" .modal-content").attr('action', paymentMethod);
	        
	        $(this).closest(".item-id").find(".choose-pay__item").removeClass("choose-pay__item_active");
	        $(this).closest(".choose-pay__item").addClass('choose-pay__item_active');
	        if(login != '') $('#'+formid+' .buy-item').prop('disabled', false);
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
					
					$(this).closest('label').find("input:first").prop('checked', true);
	        
                    $('#'+formid+' .buy-item').text('Купить за '+data._data.i_price+' руб.');
				    
				    var syspay = $('#'+formid).find('input[name="syspay"]:checked').val();
				    if((syspay == 'unitpay' || syspay == 'interkassa') && player != '') $('#'+formid+' .buy-item').prop('disabled', false);
				    
				}
			});
		}, 2000);

		return false;
	});
	
});