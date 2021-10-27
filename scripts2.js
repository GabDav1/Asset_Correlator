google.charts.load('current', {'packages': ['corechart']});
//google.charts.setOnLoadCallback(loadData);

//Variabilele globale
const URL_KEY = "apikey=O3LKWM6IB2BF94KE";
var data3;
var data4;
var isFinished;
var searchBox = [];
searchBox[0] = '';
const searchBoxApi = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='
var urlFunc = document.getElementById('z').value;
const waitTime = 300;//ticker-box interval (to call api only per "intention")
var isSearch = false;

//change time function
document.getElementById('z').onchange = function() {
	urlFunc = document.getElementById('z').value;
	
	apiCall[0] = updateS(1);
	apiCall[1] = updateS(2);
	loadArray(apiCall[0]);
	loadArray(apiCall[1]);
};

//init ticker 1, then 2
//var ticker1 = document.getElementById('x').value;!!!!!!!!!!!!!!!!!!!!!
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
		$('#y').removeClass('card1');
		$('#y').addClass('card2');
		$('#x').toggleClass('card1 card2');
	}

	if(this.id == 'y' && (!isAss1Sel)){
		isAss2Sel = !isAss2Sel;
		$('#y').toggleClass('card1 card2');
		//console.log(isAss2Sel);
	}else if(this.id == 'y' && isAss1Sel){
		isAss2Sel = !isAss2Sel;
		isAss1Sel = !isAss1Sel;
		$('#x').removeClass('card1');
		$('#x').addClass('card2');
		$('#y').toggleClass('card1 card2');
	}
  });

//var ticker2 = document.getElementById('y').value;!!!!!!!!!!!!!!!!!!!!!!

document.getElementById('y').onchange = function() {
	ticker2 = document.getElementById('y').value;
	tickers = [ticker1, ticker2];
	apiCall[1] = updateS(2);
	loadArray(apiCall[1]);
	//console.log(apiCall[1]);
};
var tickers = ['PLC', 'PLC'];

var apiCall = ["",""];
//generam obiectele url-urilor
	for(let i = 1; i<=2; i++){
		//apiCall[i-1] = updateS(i); 
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


function loadArray(item){
	isFinished = 0;
	//fiecare item e obiectul url-ului cu propr. de url si index etc
	//console.log(isFinished);
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
				
				//build array
				var arTest =[];
				let ind = 1;
			try{
				for(var i in Object.keys(timeD))//IMPLEMENT TRY-CATCH HERE
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
				arTest[0][0] = "Timp";
				arTest[0][1] = "Pret " + item.ticker;
				
				switch(item.index){
					case 1:
						data3 = arTest;
						console.log(data3);
						break;
					case 2:
						data4 = arTest;
						console.log(data4);
						break;
				}
				isFinished = 1;
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
		
	//return isFinished;	TODO REVIEW ASYNC AWAIT FETCH ALSO SEARCH ENDPOINT API
}


document.getElementById('visualize').onclick = function(ev) {
	//console.log(apiCall[0], apiCall[1]);
	var idIntvl = 	setInterval(() => { //la fiecare 300ms verifica daca sunt gata datele
			if(isFinished == 0) {
				//alert("data not ready");
				document.getElementById('lol').setAttribute("style", "display: contents;");
			}else{
				var dataxx = [...data3];
				var datayy = [...data4];
				document.getElementById('lol').setAttribute("style", "display: none;");
				var dataF =	array_compiler(dataxx, datayy);
				ev.preventDefault();
				drawC(dataF, apiCall[0].ticker + " vs " + apiCall[1].ticker + ", from " + dataF[1][0] + " to "+ dataF[dataF.length - 1][0]);
				//console.log(data3);
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
		document.getElementById('x').firstElementChild.innerHTML = thisTicker;
		ticker1 = thisTicker;
		tickers[0] = ticker1;
		apiCall[0] = updateS(1);
		loadArray(apiCall[0]);
	}
	if(isAss2Sel){
		document.getElementById('y').firstElementChild.innerHTML = thisTicker;
		ticker2 = thisTicker;
		tickers[1] = ticker2;
		apiCall[1] = updateS(2); 
		loadArray(apiCall[1]);
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
							optionTxt += '<option value=' + '"' + arr[index]['1. symbol'] +'"' + '>' +
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
	var dataG;
	
	//taiem diferenta de lungime dintre array-uri prin splicing
	if (datax.length < datay.length){
		datay.splice(1,datay.length - datax.length);
		console.log(datax[datax.length - 1][0],' ',datay[datax.length - 1][0]);
	}else if(datax.length > datay.length){
		datax.splice(1,datax.length - datay.length);//TODO DE IMPLEMENTAT DACA SUNT DIFERENTE PREA MARI CA PERIOADE
		console.log(datax[datay.length - 1][0],' ', datay[datay.length - 1][0]);
	}//}else{
		dataG = datax;	
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
	//}
	//console.log(data3);
	return dataG;
}

