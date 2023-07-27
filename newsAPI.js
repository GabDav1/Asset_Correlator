
function get_news(query, assetNo) {

    //api restriciton: only fetch news from current month
    const now = new Date();
    //const newsDate =new Date(now.getFullYear()+'-'+(now.getMonth()-5)+'-'+'01');
    const timeOffset = 28*24*3600*1000;//28 days in milliseconds
    const newsDate =new Date(Date.now() - timeOffset);
    
    //console.log(newsDate.toLocaleDateString());
        
    var url = 'https://newsapi.org/v2/everything?' +
        'q=' + query +
        '&from='+newsDate.toLocaleDateString()+'&' +
        'sortBy=popularity&' +
        'apiKey=' + NEWS_KEY;

    //var url2 = 'https://api.newscatcherapi.com/v2/search?q=' + query;
    //'&x-api-key=' + NEWS_KEY2;

    //console.log(url);
    var req = new Request(url);
    //req.headers.append("x-api-key", NEWS_KEY2); //add header in request js(for url2)

    let prom = fetch(req);
    //transform promise to object, then populate containers
    prom.then((response) => response.json())
        .then((objson) => {
            //console.log(objson.articles[1].description);
            //console.log(objson.articles[0].title);
            //console.log(objson);

            /*switch(assetNo){case 'ass1' : i = 1; case 'ass2' : i = 2; }*/
            let assetIterator = (assetNo == 'ass1') ? 1 : 2;

            let newsIterator = 0;
            for (let i = assetIterator; i <= newsItems; i += 4) {
                    //news title+link
                    try{
                        document.getElementById('news-' + i).innerHTML = "<a class='row'" +
                            "href='" + objson.articles[newsIterator].url + "'>" +
                            objson.articles[newsIterator].title + "</a>";
                    
                        //news body
                        let j = i + 2;

                        //based on i but needs to start from 1 always
                        let k = (i % 2 == 0) ? (i - 1) : i;

                        document.getElementById('news-' + j).innerHTML = "<label class='home-title'>"+
                        "<span>"+objson.articles[newsIterator].description+"</span></label>";

                        if (i <= newsItems - 4 && document.getElementById('news-' + (i + 4)) == null) {
                            //console.log(document.getElementById('news-' + (i+4)));
    
                            //just adds the next rows
                            add_news_row(k + 4, 'demo3/4');
                            add_news_row(k + 6, 'demo5');
                        }
                        newsIterator++;

                }catch(err){
                    console.log(err);
                }
            }
            
        });
}

function add_news_row(n, styling) {
    //odd numbers get title styling, the rest get description styling: let styling = (n%2 == 0) ? 'demo5' : 'demo4';
    let idRight = n + 1;
    //titles are colored, descriptions are not
    let styling1 = (styling == 'demo5') ? 'demo5' : 'demo4';
    let styling2 = (styling == 'demo5') ? 'demo5' : 'demo3';

    //let newsDiv = document.getElementById('news-div');
    let newRow = document.createElement('div');
    let pad = document.createElement('div');
    let titleLeft = document.createElement('div');
    let titleRight = document.createElement('div');
    newRow.setAttribute('class', 'row py-2 text-center');
    pad.setAttribute('class', 'col-lg-1 d-flex justify-content-center');
    titleLeft.setAttribute('class', 'col-lg-5 d-flex justify-content-center ' + styling1);
    titleLeft.setAttribute('id', 'news-' + n);
    titleRight.setAttribute('class', 'col-lg-5 d-flex justify-content-center ' + styling2);
    titleRight.setAttribute('id', 'news-' + idRight);
    titleLeft.innerText = 'Kirkland TestGold';
    titleRight.innerText = 'by TestAutomation';
    newRow.append(pad);
    newRow.append(titleLeft);
    newRow.append(titleRight);
    newsDiv.append(newRow);
}

function infiniteScroll() {

    let contentHeight = fullContainer.scrollHeight;
    let viewPort = window.innerHeight+ window.scrollY; 

    if(viewPort > contentHeight-80) {
        
        //console.log('viewport: '+viewPort);
        //console.log('contentheight: '+ contentHeight);

        //triggers news fetch, then bounce
        if(!isBounced && newsItems<maxNewsItems){
                newsItems+=8;
                get_news(apiCall[1].description, 'ass2');
                get_news(apiCall[0].description, 'ass1');
        }
        isBounced = true;
        setTimeout(()=> isBounced = false, 1000);
    };
}

window.addEventListener('scroll', infiniteScroll);