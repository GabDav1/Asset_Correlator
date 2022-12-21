google.charts.load('current', {'packages': ['corechart']});
//google.charts.setOnLoadCallback(loadData);

//Variabilele globale
const URL_KEY = "apikey=O3LKWM6IB2BF94KE";
const NEWS_KEY = "c7c7e05fa22c46c2a65a53205f9bf617";
const NEWS_KEY2 = "qHe3AG87CbJCa_N2655gIEIZbW_CMjXZCoB07Nh89_s";
var data3;
var data4;

//data 3 in percentage
var data5 = [];
//data4 in percentage
var data6 =[];

//global compiled arrays
var dataF; //in percentages
var dataFD; //in absolute/dollar values

var isFinished1; //first asset flag
var isFinished2; //second asset flag
var searchBox = [];
searchBox[0] = '';
const searchBoxApi = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='
var urlFunc = document.getElementById('z').value;
const waitTime = 300;//ticker-box interval (to call api only per "intention")
var isSearch = false;

//change time function
document.getElementById('z').onchange = function() {
	urlFunc = document.getElementById('z').value;
	//some of these run concurrently, i sync them manually with flags
	apiCall[0] = updateS(1);
	apiCall[1] = updateS(2);
	loadArray(apiCall[0]);
	loadArray(apiCall[1]);
	to_percent('ass1', apiCall[0]);
	to_percent('ass2', apiCall[1]);
};

//init ticker 1, then 2
var ticker1 = document.getElementById('x').value;
var ticker2 = document.getElementById('y').value;
var isAss1Sel = true;
var isAss2Sel = false;

$("[name = 'xy']").click(function() {
	//console.log(this.id);
	
	//$("#"+ this.id).toggleClass('card1');
	//$("#"+ this.id).toggleClass('card2');

	if(this.id == 'x' && (!isAss2Sel)){
		isAss1Sel = !isAss1Sel;
		$('#x').toggleClass('card1 card2');
		//console.log(isAss2Sel);
	}else if(this.id == 'x' && isAss2Sel){
		isAss2Sel = !isAss2Sel;
		isAss1Sel = !isAss1Sel;
		$('#y').removeClass('card3');
		$('#y').addClass('card4');
		$('#x').toggleClass('card1 card2');
	}

	if(this.id == 'y' && (!isAss1Sel)){
		isAss2Sel = !isAss2Sel;
		$('#y').toggleClass('card3 card4');
		//console.log(isAss2Sel);
	}else if(this.id == 'y' && isAss1Sel){
		isAss2Sel = !isAss2Sel;
		isAss1Sel = !isAss1Sel;
		$('#x').removeClass('card1');
		$('#x').addClass('card2');
		$('#y').toggleClass('card3 card4');
	}
  });

var tickers = ['PLC', 'PLC'];

var apiCall = ["",""];
//generam obiectele url-urilor
	for(let i = 1; i<=2; i++){
		//apiCall[i-1] = updateS(i); ???
		//console.log(apiCall[i-1].totURL);
	}

//$( document ).ready(function() {
//});

function loadData(){
	//fiecare url generat la incarcarea paginii e aruncat in functia care creeaza cuburile de date
	apiCall.forEach(loadArray);
}

function updateS(selector)//generare url ca obiect cu proprietati de totUrl si index
{	
	var urlBase = "https://www.alphavantage.co/query?";
	//var urlFunc = "function=TIME_SERIES_INTRADAY&";
	var urlTicker = "symbol=" + tickers[selector - 1] + "&";
	//var urlInterv = "interval=5min&";
	var urlSize = "outputsize=compact&";
	
	//"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=compact&apikey=O3LKWM6IB2BF94KE"
	var totURLOBJ = 
	{totURL: urlBase + urlFunc + urlTicker + "" + urlSize + URL_KEY,
	index: selector,
	ticker: tickers[selector - 1],
	timeInterval: ""};
	//console.log(apiCall);
	
	return totURLOBJ;
	}



document.getElementById('visualize').onclick = function(ev) {
	//console.log(apiCall[0], apiCall[1]);
	var idIntvl = 	setInterval(() => { //la fiecare 300ms verifica daca sunt gata datele
			if(isFinished1 == 0 || isFinished2 == 0) {
				//alert("data not ready");
				document.getElementById('lol').setAttribute("style", "display: contents;");
			}else{
				//var dataxx = [...data5];
				//var datayy = [...data6];
				document.getElementById('lol').setAttribute("style", "display: none;");
				dataF =	array_compiler(data5, data6);//percentage
				dataFD = array_compiler(data3, data4);///absolutes
				ev.preventDefault();
				console.log(dataF);//!!!!!!!!!!!!!!!!!!!!!!!!!!!
				drawC(dataF, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to "+ dataF[dataF.length - 1][0]);
				clearInterval(idIntvl);
			}
		  }, 300);
	
};

document.getElementById('search').onchange = function()
{
	//waitTime = 50;
	document.getElementById('err-try-catch').setAttribute("style", "display: none;");
	document.getElementById('err-gjson-fail').setAttribute("style", "display: none;");
	var thisTicker = this.value; 

	if(isAss1Sel){
		//console.log(this);
		//$('#dsc1').toggleClass('home-title');
		document.getElementById('x').firstElementChild.innerHTML = thisTicker;
		document.getElementById('dsc1').innerHTML ='<span>'+ document.getElementById(thisTicker).innerHTML +'</span>';
		
		$('#dsc1').removeClass('home-title');
		$('#dsc1').addClass('rederr');
		ticker1 = thisTicker;
		tickers[0] = ticker1;
		apiCall[0] = updateS(1);
		loadArray(apiCall[0]);
		//data5 here
		to_percent('ass1', apiCall[0]);
		//console.log(data3);
		styleWipe('ass1');
		//fetch the news about ticker
		get_news(ticker1, 'ass1');
	}
	if(isAss2Sel){
		document.getElementById('y').firstElementChild.innerHTML = thisTicker;
		document.getElementById('dsc2').innerHTML ='<span>'+  document.getElementById(thisTicker).innerHTML+'</span>';
		$('#dsc2').removeClass('home-title');
		$('#dsc2').addClass('rederr');
		ticker2 = thisTicker;
		tickers[1] = ticker2;
		apiCall[1] = updateS(2); 
		loadArray(apiCall[1]);
		//data6 here
		to_percent('ass2', apiCall[1]);
		//visual wipe effect
		styleWipe('ass2');
		//fetch the news about ticker
		get_news(ticker2, 'ass2');
	}
	searchBox[0] = '';	
	document.getElementById('search').value = '';
};

document.getElementById('search').onkeyup = function(event) 
{
	searchBox[0] = document.getElementById('search').value;
	//if(searchBox[0] != '' && (searchBox[0] != searchBox[1])){
	if(!isSearch && searchBox[0] != ''){
		isSearch = true;
		var idIntv = setInterval(() => { 
			if(searchBox[1] != searchBox[0]){
				searchBox[1] = searchBox[0];
				//console.log('skip search, 1 is '+searchBox[1]+' and 0 is '+searchBox[0]);
			}else{
				//console.log('run search, 1 is '+searchBox[1]+' and 0 is '+searchBox[0]);
				if(searchBox[0] == ''){
					clearInterval(idIntv);
					throw 'call cannot be empty';
			}
				var optionTxt = '';//fetch async await...
					$.getJSON(searchBoxApi+searchBox[0]+'&'+URL_KEY, function(json) {
						console.log(json);// Add try-catch block here aswell
						searchBox[1] = searchBox[0];
						json['bestMatches'].forEach (function (item, index, arr) {
							// Setting up the tickers for the drop-down box
							optionTxt += '<option value=' + '"' + arr[index]['1. symbol'] +'"' +' id='+ '"' + arr[index]['1. symbol'] +'"' + '>' +
								arr[index]['2. name'] +
								' - ' + arr[index]['3. type'] +' - '+ arr[index]['4. region'] + '</option>';
					});
						document.getElementById("tickers").innerHTML = optionTxt;
						})
				clearInterval(idIntv);
				isSearch = false;
			}
		}, waitTime);
	}
};


//Desenare grafic
function drawC(dat, assetN){
	
	var chart_el = document.getElementById('chart');
	
	var chart_opt = {
		title: assetN,
		legend: {position: 'top'},
		hAxis: {title: apiCall[0].timeInterval},
		vAxis: {title: "Dollar Price"},
	};
	
	var chart_obj = new google.visualization.LineChart(chart_el);
	var data_obj = new google.visualization.arrayToDataTable(dat);
	
	chart_obj.draw(data_obj, chart_opt);
}

function array_compiler(datax, datay) {
	//let dataG = [...datax];	
	
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
	//}
	
	return dataG;
}

