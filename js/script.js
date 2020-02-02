window.addEventListener("DOMContentLoaded", () => {
    "use strict";
    //Шаблонная функция с методами get post
    function HTTP() {
        return {
            get(url, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.send();
    
                    xhr.addEventListener("load", () => {
                        if (Math.floor(xhr.status/100 !== 2)) {
                            return cb(`Error: ${xhr.status}`, xhr);
                        }
                        const res = JSON.parse(xhr.responseText);
                        cb(null, res);
    
                    });    
                } catch (error) {
                    cb(error);
                }
                
            },
            post(url, headers, body, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", url);
                    xhr.send(body);
                    if(headers) {
                        Object.entries(headers).forEach(item => {
                            xhr.setRequestHeader(item[0], item[1]);
                        });
                    }
    
                    xhr.addEventListener("load", () => {
                        if (Math.floor(xhr.status !== 2)) {
                            return cb(xhr.status, xhr);
                        }
                        const res = JSON.parse(xhr.statusText);
                        cb(null, res);
    
                    });    
                } catch (error) {
                    cb(error);
                }
            }

        };
    }
    const myHttp = HTTP();

    // newsAPP
    
    //elements
    const form = document.querySelector("#main-form");
    const formSelect = form.querySelector("select");
    const formText = form.querySelector("input");
    newsAppService();
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearContainerNews();
        newsAppService();
        form.reset();
    });

    function newsAppService() {
        const apiKey = "027215a8645c428cb3d05c1ac0f9f9e0";
        const server = "https://newsapi.org/v2";

        const country = formSelect.value;
        const searchText = formText.value;
        // const language = formSelect.value;
        const headlinesURL = `${server}/top-headlines?country=${country}&apiKey=${apiKey}`;
        const everythingURL = `${server}/everything?q=${searchText}&apiKey=${apiKey}`;

        if (searchText) {
            getNewsHeadlines(everythingURL);
        } else {
            getNewsHeadlines(headlinesURL);
        }
        
    }

    function getNewsHeadlines(headlinesURL) {
        // const url = `${server}/top-headlines?country=ua&apiKey=${apiKey}`;
        myHttp.get(headlinesURL, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(res);
            createNewsBlock(res);
        });
    }

    function createNewsBlock({articles}) {
        let fragment = "";
        const newsWrapper = document.querySelector(".news__wrapper");
        articles.forEach(item => {
            fragment += `
                <div class="card">
                    <div class="card__img-block">
                        <img src="${item.urlToImage}">
                        <div class="card__title"> ${item.title} </div>
                    </div>
                    <div class="card__descr">
                        ${item.description}
                    </div>
                    <div class="card__link">
                        <a href="${item.url}"> read more </a>
                    </div>
                </div>            
            `;
        });
        newsWrapper.insertAdjacentHTML("afterbegin", fragment);
    }

    function clearContainerNews() {
        const container = document.querySelector(".news__wrapper");
        console.log(container.lastElementChild);
        while(container.lastElementChild) {
            container.lastElementChild.remove();
        }
    }
});