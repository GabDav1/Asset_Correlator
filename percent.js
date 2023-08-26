
function to_percent(item) {
	
	let frstVl;
	let diff = 0;

	///const percWait = parseInt(Math.random()*3000+3500);
	const data5 = [];
						
	data5[0] = []; data5[1] = [];
	//basically just dummy values to match the structure of the original array
	[data5[0][0], data5[0][1], data5[1][0], data5[1][1]] = ["Time", item.ticker, 0, 0];


	frstVl = item.data[1][1];
	//If it's 1-2 or above it gets converted to percentage
	for (let i = 2; i < item.data.length; i++) {
		data5[i] = [];
		diff = item.data[i][1] - frstVl;
		data5[i][1] = (diff * 100) / frstVl;
		data5[i][0] = item.data[i][0];
	}
	data5[1][0] = item.data[1][0];
	
	//todo: add experimental slope detection/comparrison(https://www.youtube.com/watch?v=H5Y-ONkezDM)
	return data5;
}

  function loadArray(item, errOffset, json){

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
				let timeD = json[fortimeD];
				console.log(json);
				//alert(item.totURL);
				
				//build array
				let arTest =[];
				let ind = 1;
			try{
				for(let i in Object.keys(timeD))
				{
					//this api's quirk means we have to invert the array
					let dataP = Object.keys(timeD).reverse()[i];
					arTest[ind] = [];
					arTest[ind][0] = dataP;
					arTest[ind][1] = Number(timeD[dataP]["4. close"]);
					ind++;
				}
				//table headers
				arTest[0] = [];
				arTest[0][0] = "Time";
				arTest[0][1] = "Price " + item.ticker;
				
				return arTest;
					
			}catch(error){
				console.log(error.name + ' ' +	error.message+' '+errOffset);
			}
				//console.log(isFinished);
}