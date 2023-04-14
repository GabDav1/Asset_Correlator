$('#flexSwitchCheckDefault').click(function() {
	//toggles between percent and dollar values
	if(document.getElementById('flexSwitchCheckDefault').checked){ 
		//var dataF =	array_compiler(data3, data4);
		drawC(dataFD, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to "+ dataF[dataF.length - 1][0]);
		//toggle highlighted text
		$('#PERC').toggleClass('boss demotext');
		$('#ABS').toggleClass('demotext boss');
	}else{
		//var dataF =	array_compiler(data5, data6);
		drawC(dataF, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to "+ dataF[dataF.length - 1][0]);
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


$('#crawler-test').click(function() {
	//add url via prompt
	const urlTcrawl = prompt('Insert URL here');
	crawlPage(urlTcrawl);		
});			

async function crawlPage(pageURL) {
	
	//const res = await fetch(pageURL, {
		//mode: "no-cors"	});

	//console.log(await res.text());
	fetch(pageURL, {
		mode: "no-cors"	})
		.then(response => {return response.text()})
		.then(res => {console.log(res)});	
}
