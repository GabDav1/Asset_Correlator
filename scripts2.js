google.charts.load('current', { 'packages': ['corechart'] });

window.onload = async () => {
	//also render year
	footerYear.innerHTML = new Date().getFullYear();

	//just hardcode the initial values
	news2G = 'Barrick Gold';
	news1G = 'Tesla Motors';
	get_news(news2G, 'ass2');
	get_news(news1G, 'ass1');

	//"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=compact&apikey=O3LKWM6IB2BF94KE"
	urlFunc = await setDayParameter();//urlFunc = 'function=TIME_SERIES_DAILY&';
	//console.log(urlFunc);
	const tickers = ['TSLA', 'GOLD'];//tickers at page-load

	let dummy = [];
	dummy[0] = []; dummy[1] = [];
	//dummy values for initial rendering
	[dummy[0][0], dummy[0][1], dummy[1][0], dummy[1][1]] = ["Time", "Select from below", 0, 0];
	drawC(dummy, 'Please select the assets that you wish to compare.');

	loopTIckers(tickers,[news1G, news2G]);
};



//keep secrets here for now
const URL_KEY = "apikey=O3LKWM6IB2BF94KE";
const NEWS_KEY = "c7c7e05fa22c46c2a65a53205f9bf617";

//collection of asset pairs
const correlationDict = new Map();
//cached price data
const cacheData = new Map();
//const NEWS_KEY2 = "qHe3AG87CbJCa_N2655gIEIZbW_CMjXZCoB07Nh89_s"; this is deprecated

//row ID global
let rowID = 1;

//global compiled arrays
let dataFglobal; //in percentages
let dataFDglobal; //in absolute/dollar values
let news1G, news2G; //global news search-terms

///let isFinished1 = -1; //first asset flag
///let isFinished2 = -1; //second asset flag
//let isFinished1P = 0; 
//let isFinished2P = 0; 

let searchBox = [];
searchBox[0] = '';
const searchBoxApi = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='
let urlFunc;//global timeframe selector
const waitTime = 300;//ticker-box interval (to call api only per "intention")
//let loopWait = 2000;
let isSearch = false;

const corTable = document.querySelector('#table-body');//the main table
const visualize = document.querySelector('#visualize');//renderer button
const newsDiv = document.querySelector('#news-div');//news sector
const fullContainer = document.querySelector('#full-container');//full container
const htmlBody = document.querySelector('#html-body');//body
const footerYear =  document.querySelector('#footer-year');
const maxNewsItems = 40;//rather than infinite, scroll limited to this number
let isBounced = false;//debouncing for news-scroll

let newsItems = 16;//initial news segments
let allRows = [];

function loopTIckers(tickers, news = tickers){

	const apiCall = [''];//array of asset data

	let j=1, lasti, lastj, i = 0;
	//console.log(apiCall.length);
	
	let loopInterval = setInterval(()=>{	
		if((i+1)===tickers.length){
			clearInterval(loopInterval);
			return;
		}
		//starting for the first time or the cursors changed
		if((apiCall.length===1) || lasti!=i || lastj!=j || apiCall[i].isErr || apiCall[j].isErr){
			if((i+1)===tickers.length)	return;
			//only on first run
			if(apiCall.length===1) apiCall[1]='';
			//no changing on error
			if(!(apiCall[i].isErr===true || apiCall[j].isErr===true)) {
				apiCall[i] = updateS(tickers[i], news[i]);
				apiCall[j] = updateS(tickers[j], news[j]);

				//console.log(apiCall[i].isErr, apiCall[j].isErr);
			}

			const isBouncedI = (parseInt(Math.random()*10)%3) === 0;
			const isBouncedJ = (parseInt(Math.random()*10)%3) === 0;
			//console.log(parseInt(Math.random()*10));
			
			//endpoint call triggers for first try or random 1/3 bounces for retries
			const trigger1 = (!apiCall[i].isAbsRdy && !apiCall[i].isErr) || (apiCall[i].isErr && isBouncedI)
			if(apiCall[i].isErr) console.log('isB1 '+isBouncedI, trigger1);
			const trigger2 = (!apiCall[j].isAbsRdy && !apiCall[j].isErr) || (apiCall[j].isErr && isBouncedJ)
			if(apiCall[j].isErr) console.log('isB2 '+isBouncedJ, trigger2);

			trigger1 && $.when($.getJSON(apiCall[i].totURL)).then(function(x){
				try {
					apiCall[i].data= loadArray(apiCall[i], 1000, x);
					apiCall[i].dataP = to_percent(apiCall[i]);

					apiCall[i].isAbsRdy = true;
				} catch (error) {
					console.log(error);
					apiCall[i].isErr = true;
				}
				
			});

			//let test2 =  await loadArray(apiCall[j],1000);
			trigger2 && $.when($.getJSON(apiCall[j].totURL)).then(function(x){
				try {
					apiCall[j].data= loadArray(apiCall[j], 1000, x);
					apiCall[j].dataP = to_percent(apiCall[j]);

					apiCall[j].isAbsRdy = true;
					//console.log(apiCall[i].data, apiCall[i].dataP);
				} catch (error) {
					console.log(error);
					apiCall[j].isErr = true;
				}
			});
			//apiCall[j].dataP = await to_percent(apiCall[j]);
			//visualEye(false);

			lasti = i;
			lastj = j;
			
		}
		//one of the pairs is still loading
		//if(isFinished1===0 || isFinished2===0){
		if(!apiCall[i].isAbsRdy || !apiCall[j].isAbsRdy || !apiCall[i].isPercRdy || !apiCall[j].isPercRdy){
			//console.log('...working', apiCall);
			//console.log(lasti, i);
		}
		//both pairs finished
		//if(isFinished1===1 && isFinished2===1 && isFinished1P===1 && isFinished2P===1){
		//if(apiCall[i].isAbsRdy && apiCall[j].isAbsRdy && apiCall[i].isPercRdy && apiCall[j].isPercRdy){
		if(apiCall[i].isAbsRdy && apiCall[j].isAbsRdy){
			//cache here
			cacheData.set(apiCall[i].ticker,apiCall[i]);
			cacheData.set(apiCall[j].ticker,apiCall[j]);
			//renders here
			visualEye(apiCall[i], apiCall[j]);

			//console.log(apiCall[j].data, apiCall[j].dataP);
			//2nd cursor not at the end
			if(!((j+1)===tickers.length)) { 
				j++;
				apiCall[j]='';
				//console.log('j++ here');
				}else{
					i++;
					j=i+1;
					apiCall[i]='';
					apiCall[j]='';
			}
		}

	},777);
	
}

function visualEye(dataI, dataJ) {
	
	document.getElementById('lol').setAttribute("style", "display: none;");

	//reset perc toggle to default
	document.querySelector('#flexSwitchCheckDefault').checked = false;

	//we only need correlation score for percentages
	const dataF = array_compiler(dataI.dataP, dataJ.dataP);//percentage
	const dataFD = array_compiler(dataI.data, dataJ.data);///absolutes
	//load current globals
	dataFglobal = dataF;
	dataFDglobal = dataFD;
	//correlation score and updates table on page
	correlation(dataF);

	//update the dictionary of pairs
	correlationDict.set('row' + rowID, { perc: dataF, abs: dataFD, data1N: dataI.news, data2N: dataJ.news });
	rowID++;

	//drawC(dataF, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to " + dataF[dataF.length - 1][0]);
	drawC(dataF, dataF[0][1] + ' vs ' + dataF[0][2]);

	

	/* OLD CODE
	document.querySelector('#flexSwitchCheckDefault').checked = false;
	//console.log(apiCall[0], apiCall[1]);
	var idIntvl = setInterval(() => { //la fiecare 300ms verifica daca sunt gata datele
		if (isFinished1===0 || isFinished2===0 || isFinished1P===0 || isFinished2P===0) {
			//alert("data not ready");
			document.getElementById('lol').setAttribute("style", "display: contents;");
		} else {
			//var dataxx = [...data5];
			//var datayy = [...data6];
			document.getElementById('lol').setAttribute("style", "display: none;");

			//we only need correlation score for percentages
			dataF = array_compiler(data5, data6, true);//percentage
			dataFD = array_compiler(data3, data4, false);///absolutes

			//update the dictionary of pairs
			correlationDict.set('row'+rowID, {perc: dataF, abs: dataFD});
			rowID++;

			//ev.preventDefault();
			//console.log(dataF);//!!!
			drawC(dataF, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to " + dataF[dataF.length - 1][0]);
			clearInterval(idIntvl);
		}
	}, 30);*/
}

function updateS(ticker, news)
{
	const urlBase = "https://www.alphavantage.co/query?";
	//var urlFunc = "function=TIME_SERIES_INTRADAY&";
	const urlTicker = "symbol=" + ticker + "&";
	//var urlInterv = "interval=5min&";
	const urlSize = "outputsize=compact&";

	const totURLOBJ =
	{
		totURL: urlBase + urlFunc + urlTicker + "" + urlSize + URL_KEY,
		news: news,
		ticker: ticker,
		timeInterval: "",
		description: ticker,
		isAbsRdy: false,
		isErr:false,
		data: ['.'],
		dataP:['.']
	};
	//console.log(this);

	return totURLOBJ;
}

//bind function to button
visualize.addEventListener('click', visualEye);

//change time function
document.getElementById('z').onchange = async function () {
	//temp store asset description
	const desc1 = document.querySelector('#dsc1').firstElementChild.innerHTML.split(' - ')[0];
	const desc2 = document.querySelector('#dsc2').firstElementChild.innerHTML.split(' - ')[0];

	const asset1 = document.querySelector('#x').firstElementChild.innerHTML.trim();
	const asset2 = document.querySelector('#y').firstElementChild.innerHTML.trim();
	
	//all we do is change global time variable, then call the main function
	urlFunc = document.getElementById('z').value;
	//sets correct parameter for daily
	if(urlFunc.substr(21, 5)==='DAILY') urlFunc = await setDayParameter();
	
	//console.log(urlFunc);
	//console.log(document.querySelector('#dsc1').firstElementChild.innerHTML);//split(' - ')[0]
	loopTIckers([asset1, asset2], [desc1, desc2]);
};

//init ticker 1, then 2
//var ticker1 = document.getElementById('x').value;// same as apiCall.ticker?
//var ticker2 = document.getElementById('y').value;
let isAss1Sel = true;
let isAss2Sel = false;

/*function loadData() {
	//fiecare url generat la incarcarea paginii e aruncat in functia care creeaza cuburile de date
	apiCall.forEach(loadArray);
}*/


document.getElementById('search').onchange = function () {
	//waitTime = 50;
	document.getElementById('err-try-catch').setAttribute("style", "display: none;");
	document.getElementById('err-gjson-fail').setAttribute("style", "display: none;");
	const thisTicker = this.value;
	//console.log(description.split(' - ')[0]);

	if (isAss1Sel) {
		//console.log(document.getElementById(thisTicker).innerHTML);
		//$('#dsc1').toggleClass('home-title');
		document.getElementById('x').firstElementChild.innerHTML = thisTicker;
		const description1 = document.getElementById(thisTicker).innerHTML;
		const description2 = document.getElementById('dsc2').firstElementChild.innerHTML.trim();

		document.getElementById('dsc1').innerHTML = '<span>' + document.getElementById(thisTicker).innerHTML + '</span>';

		$('#dsc1').removeClass('home-title');
		$('#dsc1').addClass('rederr');
		
		//ticker1 = thisTicker;
		///tickers[0] = ticker1;
		//apiCall[0] = updateS(1, description);//!!!!
		//loadArray(apiCall[0]);
		//data5 here
		//to_percent('ass1', apiCall[0]);
		//console.log(thisTicker, document.getElementById('y').firstElementChild.innerHTML);
		const tickersData = [thisTicker.trim(), document.getElementById('y').firstElementChild.innerHTML.trim()];
		const tickersNews = [description1.split(' - ')[0], description2.split(' - ')[0]];
		console.log(description1.split(' - ')[0], description2.split(' - ')[0]);
		loopTIckers(tickersData, tickersNews);

		styleWipe('ass1');
		//fetch the news about ticker
		news1G = description1.split(' - ')[0];
		get_news(news1G, 'ass1');
	}
	if (isAss2Sel) {
		document.getElementById('y').firstElementChild.innerHTML = thisTicker;
		const description1 = document.getElementById('dsc1').firstElementChild.innerHTML.trim();
		const description2 = document.getElementById(thisTicker).innerHTML;

		document.getElementById('dsc2').innerHTML = '<span>' + document.getElementById(thisTicker).innerHTML + '</span>';
		$('#dsc2').removeClass('home-title');
		$('#dsc2').addClass('rederr');

		//ticker2 = thisTicker;
		//tickers[1] = ticker2;
		//apiCall[1] = updateS(2, description);
		///loadArray(apiCall[1]);
		//data6 here
		//to_percent('ass2', apiCall[1]);
		const tickersData = [document.getElementById('x').firstElementChild.innerHTML.trim(), thisTicker.trim()];
		const tickersNews = [description1.split(' - ')[0], description2.split(' - ')[0]];
		console.log(description1.split(' - ')[0], description2.split(' - ')[0]);
		loopTIckers(tickersData, tickersNews);

		//visual wipe effect
		styleWipe('ass2');
		//fetch the news about ticker
		news2G = description2.split(' - ')[0];
		get_news(news2G, 'ass2');
	}
	searchBox[0] = '';
	document.getElementById('search').value = '';
};

document.getElementById('search').onkeyup = function (event) {
	searchBox[0] = document.getElementById('search').value;
	//if(searchBox[0] != '' && (searchBox[0] != searchBox[1])){
	if (!isSearch && searchBox[0] != '') {
		isSearch = true;
		let idIntv = setInterval(() => {
			if (searchBox[1] != searchBox[0]) {
				searchBox[1] = searchBox[0];
				//console.log('skip search, 1 is '+searchBox[1]+' and 0 is '+searchBox[0]);
			} else {
				//console.log('run search, 1 is '+searchBox[1]+' and 0 is '+searchBox[0]);
				/*/if (searchBox[0] == '') {
					clearInterval(idIntv);
					console.log('call cannot be empty');
				}*/
				let optionTxt = '';
				$.getJSON(searchBoxApi + searchBox[0] + '&' + URL_KEY, function (json) {
					console.log(json);// Add try-catch block here aswell
					searchBox[1] = searchBox[0];
					json['bestMatches'].forEach(function (item, index, arr) {
						// Setting up the tickers for the drop-down box
						optionTxt += '<option value=' + '"' + arr[index]['1. symbol'] + '"' + ' id=' + '"' + arr[index]['1. symbol'] + '"' + '>' +
							arr[index]['2. name'] +
							' - ' + arr[index]['3. type'] + ' - ' + arr[index]['4. region'] + '</option>';
					});
					document.getElementById("tickers").innerHTML = optionTxt;
				})
				clearInterval(idIntv);
				isSearch = false;
			}
		}, waitTime);
	}
};


//Chart rendering
function drawC(dat, assetN) {

	var chart_el = document.getElementById('chart');

	var chart_opt = {
		title: assetN,
		legend: { position: 'top' },
		vAxis: { title: document.querySelector('#flexSwitchCheckDefault').checked? "Dollar Price": "Percentage change" },
		crosshair:{ 
			color:'green',
			trigger:'selection'
		}
	};

	var chart_obj = new google.visualization.LineChart(chart_el);
	var data_obj = new google.visualization.arrayToDataTable(dat);

	chart_obj.draw(data_obj, chart_opt);
}


//just changes styling on UI elements
$("[name = 'xy']").click(function () {
	//console.log(this.id);

	//$("#"+ this.id).toggleClass('card1');
	//$("#"+ this.id).toggleClass('card2');

	if (this.id == 'x' && (!isAss2Sel)) {
		isAss1Sel = !isAss1Sel;
		$('#x').toggleClass('card1 card2');
		//console.log(isAss2Sel);
	} else if (this.id == 'x' && isAss2Sel) {
		isAss2Sel = !isAss2Sel;
		isAss1Sel = !isAss1Sel;
		$('#y').removeClass('card3');
		$('#y').addClass('card4');
		$('#x').toggleClass('card1 card2');
	}

	if (this.id == 'y' && (!isAss1Sel)) {
		isAss2Sel = !isAss2Sel;
		$('#y').toggleClass('card3 card4');
		//console.log(isAss2Sel);
	} else if (this.id == 'y' && isAss1Sel) {
		isAss2Sel = !isAss2Sel;
		isAss1Sel = !isAss1Sel;
		$('#x').removeClass('card1');
		$('#x').addClass('card2');
		$('#y').toggleClass('card3 card4');
	}
});
