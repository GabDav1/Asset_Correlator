

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

/*
						//clearInterval(idIntv);
					
		//waitTime +=50;
		console.log(waitTime);
		
		
		<div class="col-lg-3 d-flex justify-content-center align-items-center text-left">
					<label name="dsc1">
						Descriere 1: <label name='child'> - </label>
						</label> 
						
				</div>
				<div class="col-lg-3 d-flex justify-content-center align-items-center text-left">
					<label name="dsc2">
						Descriere 2:	<label name='child'> - </label>
						</label>
						
				</div>
				
				document.getElementById('y').onchange = function() {
	ticker2 = document.getElementById('y').value;
	tickers = [ticker1, ticker2];
	apiCall[1] = updateS(2);
	loadArray(apiCall[1]);
	//console.log(apiCall[1]);
};

'* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'Fira Code', monospace;
  width: 100%;
  height: 100%;
  font-size: 16px;
}


<p class="popout">
	<span>R</span>
	<span>I</span>
	<span>D</span>
	<span>E</span><br>
	<span>T</span>
	<span>H</span>
	<span>E</span><br>
	<span>W</span>
	<span>A</span>
	<span>V</span>
	<span>E</span>
	
</p>
*/