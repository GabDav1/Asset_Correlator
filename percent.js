
function to_percent(datax, item) {
	
	var frstVl;
	var diff = 0;

	var idIntvl = setInterval(() => { //checks every 300ms if data is "ready"
		///if(isFinished == 1) {
			//switch(datax){
				if(isFinished1 == 1 && datax =='ass1'){	
					//case 'ass1': //asset1: data5 is percentual representation of data3		
						data5[0] = []; data5[1] = [];
						//basically just dummy values to match the structure of the original array
						[data5[0][0], data5[0][1], data5[1][0], data5[1][1]] = ["Time", item.ticker, 0, 0];
						//data5 = [...data3];

						frstVl = data3[1][1];
						//If it's 1-2 or above it gets converted to percentage
						for (let i = 2; i < data3.length; i++) {
							data5[i] = [];
							diff = data3[i][1] - frstVl;
							data5[i][1]	 = (diff *100) / frstVl;
							data5[i][0] = data3[i][0];
						}
						data5[1][0] = data3[1][0];
						console.log(data5);
						//break;
						clearInterval(idIntvl);
				}
				//case 'ass2': //asset2: data6 is percentual representation of data4
				if(isFinished2 == 1 && datax =='ass2'){
					data6[0] = []; data6[1] = [];
					//basically just dummy values to match the structure of the original array
					[data6[0][0], data6[0][1], data6[1][0], data6[1][1]] = ["Time", item.ticker, 0, 0];
					//data6 = [...data4];

					frstVl = data4[1][1];
					//If it's 1-2 or above it gets converted to percentage
					for (let i = 2; i < data4.length; i++) {
						data6[i] = [];
						diff = data4[i][1] - frstVl;
						data6[i][1]	 = (diff *100) / frstVl;
						data6[i][0] = data4[i][0];
					}
					data6[1][0] = data4[1][0];

					console.log(data6);		
					//break;
					clearInterval(idIntvl);
				}
			//clearInterval(idIntvl);
		//}
	  }, 300);	
}

function loadArray(item){
	//isFinished = 0;
	item.index == 1 ? isFinished1 = 0 : isFinished2 = 0;//determine which flag to use
	
	//fiecare item e obiectul url-ului cu propr. de url si index etc
	$.getJSON(item.totURL, function(json) {
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
				//console.log(json);
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
				
				switch(item.index){
					case 1:
						data3 = arTest;
						isFinished1 = 1;
						console.log(data3);
						break;
					case 2:
						data4 = arTest;
						isFinished2 = 1;
						console.log(data4);
						break;
				}
			}catch(error){
				console.log(error.name + ' ' +	error.message);
				document.getElementById('err-try-catch').setAttribute("style", "display: contents;");
			}
				//console.log(isFinished);
			})
			.fail(function( textStatus, error ) {
				console.log( "Request Failed: " + textStatus + ", " + error );
				document.getElementById('err-gjson-fail').setAttribute("style", "display: contents;");
			})
			  .always(function() {
				//console.log( "complete" );
			  });
		
	//return isFinished
}