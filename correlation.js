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
	corTable.innerHTML+= `<tr>
		<td><span>${urlFunc.substr(21, 5)}</span></td>
		<td><span class="dpsym">${dataCube[0][1]}</span></td>
		<td><span class="dpaon">${dataCube[0][2]}</span></td>
		<td><span class="dpcurtype">${corScore}</span></td>
		<td><span class="dpcond">${corPer}${' '}% </span></td>
		</tr>`;

}

function array_compiler(datax, datay, isPerc) {
	
	//taiem diferenta de lungime dintre array-uri prin splicing
	if (datax.length < datay.length){
		datay.splice(1,datay.length - datax.length);
		console.log(datax[datax.length - 1][0],' ',datay[datax.length - 1][0]);
	}else if(datax.length > datay.length){
		datax.splice(1,datax.length - datay.length);
		console.log(datax[datay.length - 1][0],' ', datay[datay.length - 1][0]);
	}//}else{
	
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
		console.log(error.name + ' ' +	error.message);
		console.log("array compiler error");
	}
	//calculates correlation score
    if(isPerc) correlation(dataG);
	
	return dataG;
}