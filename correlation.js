function correlation(dataCube){
   
    let cursorX, cursorY, corPer; 
	let corScore = 0, corPerCount = 0;
    for (let i = 2; i <dataCube.length; i++) {
        
        cursorX = dataCube[i][1] - dataCube[i-1][1];
        cursorY = dataCube[i][2] - dataCube[i-1][2];
        
        //check for divergence
        if((cursorX>0 && cursorY<0) || (cursorX<0 && cursorY>0)){
            //when trends diverge we sum their absolute values
			corScore+= Math.abs(cursorX) + Math.abs(cursorY);
			//also count the instances
			corPerCount++;
        }
    }

	//percentage of instances of divergence
	corPer = (corPerCount / dataCube.length)* 100;
	//renders it
	const tRow = `<tr class="all-rows" id="row${rowID}">
		<td><span class="dpsym">${new Date().toLocaleDateString()}</span></td>
		<td><span>${urlFunc.substr(21, 5)}-${dataCube.length}</span></td>
		<td><span class="dpsym">${dataCube[0][1]}</span></td>
		<td><span class="dpaon">${dataCube[0][2]}</span></td>
		<td><span class="dpcurtype">${parseInt(corScore)}</span></td>
		<td><span class="dpcond">${corPer.toFixed(2)}${' '}% </span></td>
		</tr>`;
	(rowID===1)? corTable.innerHTML = tRow: corTable.innerHTML += tRow;

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
			news1G = correlationDict.get(row.id).data1N;
			news2G = correlationDict.get(row.id).data2N;

			get_news(news1G, 'ass1');
			get_news(news2G, 'ass2');

			///console.log(news1G, news2G);
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
	
	console.log(datay, datax);
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