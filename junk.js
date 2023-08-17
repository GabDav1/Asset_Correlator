$('#flexSwitchCheckDefault').click(function() {
	
	//toggles between percent and dollar values
	if(document.getElementById('flexSwitchCheckDefault').checked){ 
		//var dataF =	array_compiler(data3, data4);
		drawC(dataFDglobal, dataFDglobal[0][1] +' vs '+ dataFDglobal[0][2]);
		//toggle highlighted text
		$('#PERC').toggleClass('boss demotext');
		$('#ABS').toggleClass('demotext boss');
	}else{
		//var dataF =	array_compiler(data5, data6);
		drawC(dataFglobal, dataFglobal[0][1] +' vs '+ dataFglobal[0][2]);
		//toggle highlighted text
		$('#PERC').toggleClass('demotext boss');
		$('#ABS').toggleClass('boss demotext');
	}
	
});

function styleWipe(src){
	
		if (src=='ass1'){
			$('#dsc1').toggleClass('rederr home-title');
		}else if (src=='ass2'){
			$('#dsc2').toggleClass('rederr home-title');
		}
}

document.querySelector('#crawler-test').addEventListener('click',setDayParameter);

async function setDayParameter(){
	const test = await getDayParameter();

	//console.log(test);
	return test===200? 'function=TIME_SERIES_DAILY&' : 'function=TIME_SERIES_DAILY_ADJUSTED&';
}

function getDayParameter(){

	const testF = 'function=TIME_SERIES_DAILY&';
	const urlBase = "https://www.alphavantage.co/query?" + testF + "symbol=IBM&outputsize=compact&"+ URL_KEY;

	return fetch(urlBase).then(response => {
		//console.log(response.status);
		return response.status;
	});
}
