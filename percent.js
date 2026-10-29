
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

function normalizePriceSeries(arr, priceColIndex = 1) {
  // Return early if the array is empty or only contains headers
  if (!arr || arr.length <= 1) return arr;

  const headers = arr.data[0];
  const data = arr.data.slice(1);

  let min = Infinity;
  let max = -Infinity;

  // Step 1: Find the minimum and maximum values in the target column
  for (let i = 0; i < data.length; i++) {
    const price = Number(data[i][priceColIndex]);
    
      if (price < min) min = price;
      if (price > max) max = price;
  }

  // Define the target scale
  const scaleMin = 1;
  const scaleMax = 1000;

  // Step 2: Apply the normalization formula
  const normalizedData = data.map(row => {
    const newRow = [...row]; // Create a shallow copy to avoid mutating original data
    const price = Number(newRow[priceColIndex]);

      // Handle edge case: if all prices in the series are identical
      if (max === min) {
        newRow[priceColIndex] = scaleMin; 
      } else {
        // Apply the Min-Max formula
        newRow[priceColIndex] = scaleMin + ((price - min) * (scaleMax - scaleMin)) / (max - min);
      }
    return newRow;
  });

  // Reattach headers and return
  return [headers, ...normalizedData];
}

  function loadArray(item, errOffset, json){

		let fortimeD;
		let priceCandle;
				switch(urlFunc.substr(21, 5)){
					case "DAILY":
						// adapt to regular or adjusted endpoint for daily data
						const test = urlFunc.substr(21, 6);
						fortimeD = test === "DAILY&"? "Time Series (Daily)" : "Daily Adjusted Time Series";
						priceCandle = test === "DAILY&"? "4. close" : "5. adjusted close";
						break;
					case "WEEKL":
						fortimeD = "Weekly Adjusted Time Series";
						priceCandle = "5. adjusted close";
						break;
					case "MONTH":
						fortimeD = "Monthly Adjusted Time Series";
						priceCandle = "5. adjusted close";
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
					arTest[ind][1] = Number(timeD[dataP][priceCandle]);
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