
function get_newsdata(query, assetNo){

    const reqUrl = "https://newsdata.io/api/1/news?apikey=" +NEWSDATA_KEY+ "&q="+query+"&language=en";
    let req = new Request(reqUrl);
    //req.headers.append("x-api-key", NEWS_KEY2); //add header in request js(for url2)

    let prom = fetch(req);
    //transform promise to object, then populate containers
    prom.then((response) => response.json())
        .then((objson) => {

            //console.log(objson);
            let assetIterator = (assetNo == 'ass1') ? 1 : 2;

            let newsIterator = 0;
			let errorTriggered = false;
            for (let i = assetIterator; i <= newsItems; i += 4) {
                    //news title+link
                    try{
                        document.getElementById('news-' + i).innerHTML = "<a class='row'" +
                            "href='" + objson.results[newsIterator].link + "'>" +
                            objson.results[newsIterator].title + ' - '+
                            objson.results[newsIterator].pubDate.slice(0,10)+"</a>";
                            
                        //news body
                        let j = i + 2;

                        //based on i but needs to start from 1 always
                        let k = (i % 2 == 0) ? (i - 1) : i;

                        //split text into hidden and visible
                        let descrH1 = objson.results[newsIterator].description.slice(0, 175);
                        if(descrH1.length === 175){
                            descrH1+=' <a href="'+objson.results[newsIterator].link+'">[Show more...]</a> ';
                        } else descrH1+=' <a href="'+objson.results[newsIterator].link+'">[...]</a> ';

                        //console.log(descrH1.length);
                        let descrH2 = objson.results[newsIterator].description.slice(175);
                        //console.log(descrH2);

                        document.getElementById('news-' + j).innerHTML = "<label class='home-title'>"+
                        "<span>"+descrH1+'<p class="hidd">'+descrH2+'</p>'+"</span></label>";

                        if (i <= newsItems - 4 && document.getElementById('news-' + (i + 4)) == null) {
                            //console.log(document.getElementById('news-' + (i+4)));
    
                            //just adds the next rows
                            add_news_row(k + 4, 'demo3/4');
                            add_news_row(k + 6, 'demo5');
                        }
                        if(newsIterator===9) break; 
                        newsIterator++;

                }catch(err){
					
					if(!errorTriggered){
						//console.log(err) TODO - add bing, google, etc.
						document.getElementById('news-' + i).innerHTML = query+" - All news loaded.";
						//redirect for more news(just duckduckgo for now)
						const moreNews = 'https://duckduckgo.com/?t=h_&q='+query+'&iar=news&ia=news'
						document.getElementById('news-' + (i+2)).innerHTML = "<p>Want more? &nbsp-&nbsp </p>"+
						' <a href="'+moreNews+'">Get more news here</a> ';
						
						//trigger it
						errorTriggered=!errorTriggered
					} else{
						//here we continue by replacing former news with dashes
						document.getElementById('news-' + i).innerHTML = "--";
						document.getElementById('news-' + (i+2)).innerHTML = "<p>--</p>";
					}
					
                }
            }
            
        });
}

document.querySelector('#crawler-test').addEventListener('click',function(){
    alert('Your questions and feedback to gabrielcdavid@gmail.com');
});
//Code for newscatcher and NewsAPI:
/*
function get_news(query, assetNo) {
    //api restriciton: only fetch news from current month
    const now = new Date();
    //const newsDate =new Date(now.getFullYear()+'-'+(now.getMonth()-5)+'-'+'01');
    const timeOffset = 28*24*3600*1000;//28 days in milliseconds
    const newsDate =new Date(Date.now() - timeOffset);
    //console.log(newsDate.toLocaleDateString());
    let url = 'https://newsapi.org/v2/everything?' +
        'q=' + query +
        '&from='+newsDate.toLocaleDateString()+'&' +
        'sortBy=popularity&' +
        'apiKey=' + NEWS_KEY;
    //var url2 = 'https://api.newscatcherapi.com/v2/search?q=' + query;
    //'&x-api-key=' + NEWS_KEY2;
    //console.log(url);
    let req = new Request(url);
    //req.headers.append("x-api-key", NEWS_KEY2); //add header in request js(for url2)
    let prom = fetch(req);
}*/

function add_news_row(n, styling) {
    //odd numbers get title styling, the rest get description styling: let styling = (n%2 == 0) ? 'demo5' : 'demo4';
    const idRight = n + 1;
    //titles are colored, descriptions are not
    const styling1 = (styling == 'demo5') ? 'demo5' : 'demo4';
    const styling2 = (styling == 'demo5') ? 'demo5' : 'demo3';

    //let newsDiv = document.getElementById('news-div');
    const newRow = document.createElement('div');
    const pad = document.createElement('div');
    const titleLeft = document.createElement('div');
    const titleRight = document.createElement('div');
    newRow.setAttribute('class', 'row py-2 text-center');
    pad.setAttribute('class', 'col-lg-1 d-flex justify-content-center');
    titleLeft.setAttribute('class', 'col-lg-5 d-flex justify-content-center ' + styling1);
    titleLeft.setAttribute('id', 'news-' + n);
    titleRight.setAttribute('class', 'col-lg-5 d-flex justify-content-center ' + styling2);
    titleRight.setAttribute('id', 'news-' + idRight);
    titleLeft.innerText = '-';
    titleRight.innerText = '-';
    newRow.append(pad);
    newRow.append(titleLeft);
    newRow.append(titleRight);
    newsDiv.append(newRow);
}

function infiniteScroll() {

    let contentHeight = fullContainer.scrollHeight;
    let viewPort = window.innerHeight+ window.scrollY; 

    if(viewPort > contentHeight-80) {
        //console.log('contentheight: '+ contentHeight);

        //triggers news fetch, then bounce
        if(!isBounced && newsItems<maxNewsItems){
                //newsItems=maxNewsItems;
                newsItems+=16;
                get_newsdata(news1G, 'ass1');
                get_newsdata(news2G, 'ass2');

                console.log(news1G, news2G);
        }
        isBounced = true;
        setTimeout(()=> isBounced = false, 1000);
    };
}

window.addEventListener('scroll', infiniteScroll);