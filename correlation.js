function correlation(dataCube0){
	//deep copy then get column headers
	const dataCube = [...dataCube0];
	const headers = dataCube.shift();
   
    let cursorX, cursorY, corPer;
	let pears1=0, pears2=0, pears3=0;  
	let corScore = 0, corPerCount = 0, runX = dataCube[0][1], runY = dataCube[0][2];

	const meanX2 = dataCube.reduce((acc, cur)=> acc +  cur[1], 0) / dataCube.length;
	const meanY2 = dataCube.reduce((acc, cur)=> acc +  cur[2], 0) / dataCube.length;
	//console.log("M-X: "+meanX2+" M--Y: "+meanY2);

    for (let i = 1; i <dataCube.length; i++) {
        
		//cursor values and running sums of x and y
        cursorX = dataCube[i][1] - dataCube[i-1][1];
        cursorY = dataCube[i][2] - dataCube[i-1][2];
		runX += dataCube[i][1];
		runY += dataCube[i][2];

		//pearson first component
		pears1 += (dataCube[i][1] - meanX2)*(dataCube[i][2] - meanY2);
		//pearson 2nd and 3rd components
		pears2 += (dataCube[i][1] - meanX2)*(dataCube[i][1] - meanX2);
		pears3 += (dataCube[i][2] - meanY2)*(dataCube[i][2] - meanY2);
        
        //check for divergence
        if((cursorX>0 && cursorY<0) || (cursorX<0 && cursorY>0)){
            //when trends diverge we sum their absolute values
			corScore+= Math.abs(cursorX) + Math.abs(cursorY);
			//also count the instances
			corPerCount++;
        }
    }

	const pearson = pears1 / Math.sqrt(pears2 * pears3); 
	//console.log('Pearson: '+pearson);

	//normalize corscore
	corScore = (corScore / dataCube.length)* 10;
	//percentage of instances of divergence
	corPer = (corPerCount / dataCube.length)* 100;


	//renders it
	const tRow = `<tr class="all-rows" id="row${rowID}">
		<td><span class="dpsym">${new Date().toLocaleDateString()}</span></td>
		<td><span>${urlFunc.substr(21, 5)}-${dataCube.length}</span></td>
		<td><span class="dpsym">${headers[1]}</span></td>
		<td><span class="dpaon">${headers[2]}</span></td>
		<td><span class="dpcurtype">${corScore.toFixed(1)}</span></td>
		<td><span class="dpcond">${corPer.toFixed(2)}${' '}% </span></td>
		<td><span class="dpcond">${pearson.toFixed(3)}</span></td>
		</tr>`;
	(rowID===1)? corTable.innerHTML = tRow: corTable.innerHTML += tRow;

	//todo: add Pearson correlation column in addition to basic correlation https://en.wikipedia.org/wiki/Pearson_correlation_coefficient

	//event listeners on rows
	updateRows();

	//row highlighter animation
	document.querySelector('#hr-slider').style.top = (30+(rowID * 33)) + 'px';
	//console.log((rowID * 30) + 'px');

	//todo: correlation temperatures for score and divergece percentage
}

function updateRows(){
	allRows = document.querySelectorAll('.all-rows');

	allRows.forEach(row =>{
		row.addEventListener('click', ()=>{
			///console.log(correlationDict.get(row.id));
			dataFglobal = correlationDict.get(row.id).perc;
			dataFDglobal = correlationDict.get(row.id).abs;

			//reset perc toggle to default
			document.querySelector('#flexSwitchCheckDefault').checked = false;
			document.querySelector('#PERC').classList = "form-check-label boss";
			document.querySelector('#ABS').classList = "form-check-label demotext";


			news1G = correlationDict.get(row.id).data1N;
			news2G = correlationDict.get(row.id).data2N;

			get_newsdata(news1G, 'ass1');
			get_newsdata(news2G, 'ass2');
			
			//set correct tickers [state management]
			//console.log(document.querySelector('#x').firstChild.innerHTML);
			//console.log(document.querySelector('#x').firstChild.innerText);
			document.querySelector('#x').firstElementChild.innerHTML = correlationDict.get(row.id).data1T;
			document.querySelector('#y').firstElementChild.innerHTML = correlationDict.get(row.id).data2T;
			document.querySelector('#dsc1').firstElementChild.innerHTML = correlationDict.get(row.id).data1N;
			document.querySelector('#dsc2').firstElementChild.innerHTML = correlationDict.get(row.id).data2N;

			//console.log(document.querySelector('#'+row.id).children[1].innerText);
			//selectors for time frame and number of data points
			const urlfuncSelec = document.querySelector('#'+row.id).children[1].innerText.split('-')[0];
			dataPnts = Number(document.querySelector('#'+row.id).children[1].innerText.split('-')[1]);
			console.log(dataPnts);
			//set time frame
			switch(urlfuncSelec){
			case 'DAILY':
				urlFunc = urlFunc_DAY;
				document.getElementById('z').selectedIndex=1;
				break;
			case 'WEEKL':
				urlFunc = 'function=TIME_SERIES_WEEKLY&';
				document.getElementById('z').selectedIndex=0;
				break;
			case 'MONTH':
				urlFunc = 'function=TIME_SERIES_MONTHLY&';
				document.getElementById('z').selectedIndex=2;
				break;
			}
			
			drawC(dataFglobal, dataFglobal[0][1] +' vs '+ dataFglobal[0][2]);

			//row highlighter animation
			const rowNo = Number(row.id.charAt(row.id.length-1));
			document.querySelector('#hr-slider').style.top = (30+(rowNo*33))+'px';
			//console.log((rowNo*30)+'px');
		});
	})
}

function array_compiler(datax, datay) {
	
	//keep the lowest number of data points or the set amount of data points(100/200/400)
	//if(datay.length >= dataPnts) datay.splice(1,datay.length - dataPnts);
	//if(datax.length >= dataPnts) datax.splice(1,datax.length - dataPnts);
	
	if (datax.length < datay.length){
		datay.splice(1,datay.length - datax.length);
		//console.log(datax[datax.length - 1][0],' ',datay[datax.length - 1][0]);
	}else if(datax.length > datay.length){
		datax.splice(1,datax.length - datay.length);
		//console.log(datax[datay.length - 1][0],' ', datay[datay.length - 1][0]);
	}
	
	//console.log(datay, datax);
	let dataG = [...datax];
	
	try{
	//Compilarea datelor - pastram cubul cu maxim 3 coloane
		if (dataG[0].length < 3){
			dataG.forEach (function (item, index, arr) {
					arr[index].push(datay[index][1]);
			});
		} else{
			dataG.forEach (function (item, index, arr) {
				arr[index].pop();
				arr[index].push(datay[index][1]);
		});
		}
	}catch(error){
		console.log("array compiler error" + error.name + ' ' +	error.message);
	}
	//calculates correlation score
    //if(isPerc) correlation(dataG);
	
	return dataG;
}