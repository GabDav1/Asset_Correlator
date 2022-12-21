
function get_news(newsItem, assetNo) {
    let i;//for later odd/even iteration over news items
    var query = newsItem;
    var url = 'https://newsapi.org/v2/everything?' +
          'q=' + query +
          '&from=2022-10-10&' +
          'sortBy=popularity&' +
          'apiKey=' + NEWS_KEY;

    var url2 = 'https://api.newscatcherapi.com/v2/search?q=' + query;
            //'&x-api-key=' + NEWS_KEY2;

    var req = new Request(url);
    req.headers.append("x-api-key", NEWS_KEY2); //add header in request js(for url2)

    let prom = fetch(req);
    //transform promise to object, then populate containers
    prom.then((response) => response.json())
        .then((objson) => {
            console.log(objson.articles[1].description);
            console.log(objson.articles[0].title);
            console.log("<a " + "href='" + objson.articles[0].url + " '>" + objson.articles[0].title + "</a>");
            
            switch(assetNo){
                case 'ass1' : i = 1;
                    break;
                case 'ass2' : i = 2;
                    break;
            }
            for (; i <= 12; i+=4) {//TEST THIS!!!!!
                //news title+link
                document.getElementById('news-' + i).innerHTML = "<a class='row'" + 
                "href='" + objson.articles[i].url + "'>" +
                objson.articles[i].title + "</a>";
                //news body
                let j = i + 2;
                document.getElementById('news-' + j).innerText = objson.articles[i].description;
                if(i <= 6 && document.getElementById('news-' + (i+4)) == null ){
                    console.log(document.getElementById('news-' + (i+4)));
                    alert('news-' + (i+4));
                    add_news_row(i + 4, 'demo5');
                    add_news_row(i + 6, 'demo4');
                }
            }    
    });      
    }

    function add_news_row(n, styling){
        //odd numbers get title styling, the rest get description styling: let styling = (n%2 == 0) ? 'demo5' : 'demo4';
        let idRight = n + 1;

        let newsDiv = document.getElementById('news-div');
        let newRow = document.createElement('div');
        let pad = document.createElement('div');
        let titleLeft = document.createElement('div');
        let titleRight = document.createElement('div');
        newRow.setAttribute('class', 'row py-2 text-center');
        pad.setAttribute('class','col-lg-1 d-flex justify-content-center');
        titleLeft.setAttribute('class','col-lg-5 d-flex justify-content-center ' + styling);
        titleLeft.setAttribute('id','news-' + n);
        titleRight.setAttribute('class','col-lg-5 d-flex justify-content-center ' + styling);
        titleRight.setAttribute('id','news-' + idRight);
        titleLeft.innerText = 'Kirkland TestGold';
        titleRight.innerText = 'by TestAutomation';
        newRow.append(pad);
        newRow.append(titleLeft);
        newRow.append(titleRight);
        newsDiv.append(newRow);
    }