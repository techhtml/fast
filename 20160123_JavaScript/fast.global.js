var fast = fast || {};
fast.youtube = fast.youtube || {};

/**
 * 페이지를 그려주는 것
 * @constructor
 */
fast.youtube.View = function() {
    this.bindSearchEvent();
};
fast.youtube.View.prototype = {
    bindSearchEvent: function() {
        var wrapper = document.querySelector("#search_area"),
            input = wrapper.querySelector(".inp_search"),
            btnSearch = wrapper.querySelector(".btn_search");

        btnSearch.addEventListener("click", function(e) {
            controller.search(input.value);
        })
    },
    drawList: function(res) {
        var searchList = document.querySelector("ul.search_list"),
            datas = res.items,
            ul = searchList || document.createElement("ul");

        ul.className = "search_list";
        ul.innerHTML = "";

        for(var i = 0; i < datas.length; i += 1) {
            var data = datas[i],
                snippet = data.snippet,
                htmlString = "<li>" +
                    "<a href='?v=" + data.id.videoId + "'>" +
                    "<img src='" + snippet.thumbnails.high.url + "' alt=''>"  +
                    "<dl>" +
                    "<dt>" + snippet.title +"</dt>" +
                    "<dd>" + snippet.channelTitle +"</dd>" +
                    "</dl>" +
                    "</a>" +
                    "</li>";
            console.log(data.id.videoId);
            console.log(data);
            ul.innerHTML += htmlString;
        }
        document.body.appendChild(ul);
    }
};

/**
 * VIEW와 Model 사이의 연결고리
 * @constructor
 */
fast.youtube.Controller = function() {};
fast.youtube.Controller.prototype = {
    search: function(q) {
        model.searchRequest(q);
    },
    makeSearchResult: function(res) {
        view.drawList(res);
    }
};

/**
 * DATA 관련 내용
 * @constructor
 */
fast.youtube.Model = function() {
};
fast.youtube.Model.prototype = {
    searchRequest: function(q) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q: q,
            maxResults: 10
        });
        request.execute(this.onSearchResponse);
    },
    onSearchResponse: function(res) {
        controller.makeSearchResult(res);
    }
};

var model = new fast.youtube.Model();
var controller = new fast.youtube.Controller();
var view = new fast.youtube.View();

var onClientLoad = function() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
};
var onYouTubeApiLoad = function() {
    gapi.client.setApiKey('__YOUR_API_KEY__');
};

/**
 * 메인 페이지 (main.html)
 * - 검색 활성화
 *
 * 서브 페이지 (sub.html)
 * - 검색 활성화
 */
