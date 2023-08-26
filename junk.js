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

document.querySelector('#crawler-test').addEventListener('click',changeDataPts);

function changeDataPts(elId){
	
	const elIdNo = Number(elId);
	switch(elIdNo){
		case 101:
			dataPnts = 101;
			break;
		case 201:
			dataPnts = 201;
			break;
		case 401:
			dataPnts = 401;
			break;
	}

	//retrieve last used terms
	const desc1 = document.querySelector('#dsc1').firstElementChild.innerHTML.split(' - ')[0];
	const desc2 = document.querySelector('#dsc2').firstElementChild.innerHTML.split(' - ')[0]
	const asset1 = document.querySelector('#x').firstElementChild.innerHTML.trim();
	const asset2 = document.querySelector('#y').firstElementChild.innerHTML.trim();

	//principal function
	loopTIckers([asset1, asset2], [desc1, desc2]);
}

document.querySelector('.slctrbx').addEventListener('click', (event)=>{

	//console.log(event.target.id);
	const thisEl = event.target;
	//only take nb buttons into account
	if(!thisEl.classList.contains('demo6')) return;

	//set data pts number
	changeDataPts(thisEl.id);
	//styling stuff
	const allEl = document.querySelectorAll('.demo6');
	allEl.forEach(el=>{
		//el.classList.remove('d6brd');
		el.style.backgroundColor = '#efefef';
	});

	//thisEl.classList.add('d6brd');
	thisEl.style.backgroundColor = 'orange';
});

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
