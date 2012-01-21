jQuery.fn.tagging = function(options)
{
	var settings = $.extend({
		source : '?input=',
		wrapperStyle : { border : '1px solid grey', padding:'2px' },
		dataListStyle : { listStyle:'none', display:'inline', padding:0 },
		dataItemStyle : { border:'1px solid grey', borderRadius:'3px', display:'block', padding:'1px 4px 0 4px', float:'left', margin:'1px', fontSize:'0.8em', background:'#CCC', cursor:'pointer' },
		searchListStyle : { display:'none', position:'absolute', listStyle:'none', padding:'0', border:'1px solid #ccc' },
		searchItemStyle : { padding:'3px', background:'#ddd' },
		searchItemStyleSelected : { background:'#ccc' }	
	}, options);
			
	var loading = false;
		
	$(this).wrapAll($('<div class="tagging-wrapper" />').css(settings.wrapperStyle));
	var wrapper = $('.tagging-wrapper');

	wrapper.append($('<ul class="tagging-data" />').css(settings.dataListStyle));
	var data = wrapper.find('ul.tagging-data');

	wrapper.append($('<ul class="tagging-search" />').css(settings.searchListStyle));
	var search = wrapper.find('ul.tagging-search');
	search.find('li').live('click', function()
	{
		addItem($(this).data('value'));
	});

	var original = $(this);
	original.css({'visibility':'hidden', position:'absolute', left:'-9999px' });
	
	wrapper.append($('<input type="text" class="tagging-input" />'));
	var input = wrapper.find('.tagging-input');
	input.css({border:'none', outline:'none'});

	updateValue = function()
	{
		var values = new Array();
		data.find('li').each(function(){
			values.push($(this).html());
		});
		original.val(values.join(','));
	}

	addItem = function(value)
	{
		data.append($('<li>'+value+'</li>').css(settings.dataItemStyle));
		search.hide();
		updateValue();
		input.val('');
	}

	if(original.val())
	{
		values = original.val().split(',');
		console.log(values);
		for (i in values)
		{
			addItem(values[i]);
		}
	}	

	data.find('li').live('click', function(){ $(this).remove(); updateValue(); });
	
	wrapper.on('click', function(){ input.focus() });
	
	input.on('keydown', function (e)
	{
		if (e.keyCode == 13) // ENTER - prevent form from being submited
		{
			e.preventDefault();
		}
		
		// this must run before erase the first input's char
		if (e.keyCode == 8 && !input.val()) // BACKSPACE and no input
		{
			data.find('li:last').remove();
			updateValue();
			return;
		}		
		
	});
	
	changeSelected = function(selected, next)
	{
		if (next.length == 0) { return; }
		selected.removeClass('tagging-selected')
		next.addClass('tagging-selected');
		selected.css(settings.searchItemStyle);
		next.css(settings.searchItemStyleSelected);
		return;
	}
	
	input.on('keyup', function(e)
	{
		if (e.keyCode == 38) // UP
		{
			selected = search.find('li.tagging-selected');
			prev = selected.prev();
			changeSelected(selected, prev);
			return;

		}
		if (e.keyCode == 40) // DOWN
		{
			selected = search.find('li.tagging-selected');
			next = selected.next();
			changeSelected(selected, next);
			return;
		}
	
		if (e.keyCode == 188) // ,
		{
			value = $.trim($(this).val().replace(',',''));
			if (value)
			{
				addItem(value);
				$(this).val('');
			}
			search.hide();
			return;
		}
		
		if (e.keyCode == 13) // ENTER
		{
			addItem(search.find('li.tagging-selected').data('value'));
			return;
		}
		
		$.ajax({url:settings.source + input.val(), success: function(data)
		{
			if (data)
			{
				search.show();
				search.html(data);
				search.css({left:input.position().left,top:input.position().top});
				search.find('li').css(settings.searchItemStyle);
				search.find('li:first').addClass('tagging-selected').css(settings.searchItemStyleSelected);
				return;
			}
			search.hide();
		}});
	});
};