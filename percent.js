
function to_percent(item) {
	
	let frstVl;
	let diff = 0;
	//datax==='ass1'? isFinished1P = 0: isFinished2P = 0;
	///const percWait = parseInt(Math.random()*3000+3500);
	const data5 = [];
	//console.log(percWait);

	//let idIntvl = setInterval(async() => { //checks every 300ms if data is "ready"
		
				//if(apiCall[item.index-1].isAbsRdy ){	
						
						data5[0] = []; data5[1] = [];
						//basically just dummy values to match the structure of the original array
						[data5[0][0], data5[0][1], data5[1][0], data5[1][1]] = ["Time", item.ticker, 0, 0];
					

						frstVl = item.data[1][1];
						//If it's 1-2 or above it gets converted to percentage
						for (let i = 2; i < item.data.length; i++) {
							data5[i] = [];
							diff = item.data[i][1] - frstVl;
							data5[i][1]	 = (diff *100) / frstVl;
							data5[i][0] = item.data[i][0];
						}
						data5[1][0] = item.data[1][0];
					
						//apiCall[item.index-1].isPercRdy = true;
						//clearInterval(idIntvl);
						
				///}
				//case 'ass2': //asset2: data6 is percentual representation of data4
				/*if(apiCall[item.index-1].isAbsRdy && datax =='ass2'){
					data6[0] = []; data6[1] = [];
					//basically just dummy values to match the structure of the original array
					[data6[0][0], data6[0][1], data6[1][0], data6[1][1]] = ["Time", item.ticker, 0, 0];
					//data6 = [...data4];

					frstVl = data4[1][1];
					//If it's 1-2 or above it gets converted to percentage
					for (let i = 2; i < data4.length; i++) {
						data6[i] = [];
						diff = data4[i][1] - frstVl;
						data6[i][1]	 = (diff *100) / frstVl;   //TODO: maybe try rewritting this by wrapping in a promise?!? 
						data6[i][0] = data4[i][0];
					}
					data6[1][0] = data4[1][0];

					console.log(data6);		
					//break;
					//isFinished2P = 1;
					apiCall[item.index-1].isPercRdy = true;
					clearInterval(idIntvl);
					return;
				}
			//clearInterval(idIntvl);
		//}**/
	  //}, percWait);
	  return data5;
}

  function loadArray(item, errOffset, json){
	
	///let fetchedArray =[];
	
	//return $.getJSON(item.totURL, function(json) {

		//let isFinished = item.index%2;
		//isFinished === 1 ? isFinished1 = 0 : isFinished2 = 0;//determine which flag to use

		let fortimeD;
				switch(urlFunc.substr(21, 5)){
					case "DAILY":
						fortimeD = "Time Series (Daily)";
						break;
					case "WEEKL":
						fortimeD = "Weekly Time Series";
						break;
					case "MONTH":
						fortimeD = "Monthly Time Series";
						break;
					default:
						console.log(urlFunc.substr(20, 6));
				}
				var timeD = json[fortimeD];
				console.log(json);
				//alert(item.totURL);
				
				//build array
				var arTest =[];
				let ind = 1;
			try{
				for(var i in Object.keys(timeD))
				{
					//inversarea proprietatilor obiectului si adaugarea lor intr-un array(datele in obiect sunt teoretic neordonate si practic ordonate invers)
					let dataP = Object.keys(timeD).reverse()[i];
					arTest[ind] = [];
					arTest[ind][0] = dataP;
					arTest[ind][1] = Number(timeD[dataP]["4. close"]);
					ind++;
				}
				//CAPETE DE TABEL
				arTest[0] = [];
				arTest[0][0] = "Time";
				arTest[0][1] = "Price " + item.ticker;
				
				//switch(isFinished){
					//case 1:
						//data3 = arTest;
						//apiCall[item.index-1].isAbsRdy = true;
						return arTest;
						//apiCall[item.index-1].data = arTest;
						//fetchedArray = arTest;
						//isFinished1 = 1;
						
						//console.log(data3);
						//break;
					//case 0:
						//data4 = arTest;
						//apiCall[item.index-1].isAbsRdy = true;
						return arTest;
						//apiCall[item.index-1].data = arTest;
						//fetchedArray = arTest;
						//isFinished2 = 1;
						
						//console.log(data4);
						//break;
				//}
			}catch(error){
				console.log(error.name + ' ' +	error.message+' '+errOffset);
				//document.getElementById('err-try-catch').setAttribute("style", "display: contents;");
				//recursive
				//let loopWait = parseInt(Math.random()*3000+1000);
				//setTimeout(()=> loadArray(item, loopWait),loopWait); 
				//console.log(loopWait);
				//apiCall[item.index-1].isErr = true;
		
			}
				//console.log(isFinished);
		
		
}