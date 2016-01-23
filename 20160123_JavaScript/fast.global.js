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
    search_section: document.querySelector(".search_section"),
    video_section: document.querySelector(".video_viewer"),
    recommend_section: document.querySelector(".recommend"),
    bindSearchEvent: function() {
        var wrapper = document.querySelector("#search_area"),
            input = wrapper.querySelector(".inp_search"),
            btnSearch = wrapper.querySelector(".btn_search");
        btnSearch.addEventListener("click", function(e) {
            controller.search(input.value);
        });
    },
    drawSearch: function(res) {
        var searchList = document.querySelector("ul.search_list"),
            ul = searchList || document.createElement("ul"),
            search_section = this.search_section;
        ul.className = "search_list";
        ul.innerHTML = "";

        this.drawList(res, ul);

        search_section.appendChild(ul);
        search_section.style.display = "block";
        this.video_section.style.display = "none";
        this.bindVideoEvent();
    },
    drawRecommend: function(res) {
        var recommentList = document.querySelector("ul.recommend_list"),
            ul = recommentList || document.createElement("ul"),
            recommend_section = this.recommend_section;
        ul.className = "recommend_list";
        ul.innerHTML = "";

        this.drawList(res, ul);

        recommend_section.appendChild(ul);
        recommend_section.style.display = "block";
        this.bindVideoEvent();
    },
    drawList: function(res, ul) {
        var datas = res.items;
        for(var i = 0; i < datas.length; i += 1) {
            var data = datas[i],
                snippet = data.snippet,
                htmlString = "<li>" +
                    "<a data-href='?v=" + data.id.videoId + "'>" +
                        "<img src='" + snippet.thumbnails.high.url + "' alt=''>"  +
                        "<dl>" +
                            "<dt>" + snippet.title +"</dt>" +
                            "<dd>" + snippet.channelTitle +"</dd>" +
                        "</dl>" +
                    "</a>" +
                    "</li>";
            ul.innerHTML += htmlString;
        }
    },
    drawVideo: function() {
        var videoId = location.search.replace("?v=", ""),
            video_section = this.video_section,
            player = document.querySelector(".player");
        if(videoId !== "") {
            var iframe = '<iframe width="854" height="480" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>'
            this.search_section.style.display = "none";
            player.innerHTML = iframe;
            video_section.style.display = "block"
        }
    },
    bindVideoEvent: function() {
        var anchors = document.querySelectorAll("a"),
            that = this,
            query = model.query;
        for(var i = 0; i < anchors.length; i += 1) {
            anchors[i].addEventListener("click", function(e) {
                history.pushState({}, null, this.getAttribute("data-href"));
                controller.recommend(query);
                that.drawVideo();
                e.preventDefault();
            });
        }
    }
};

/**
 * VIEW와 Model 사이의 연결고리
 * @constructor
 */
fast.youtube.Controller = function() {};
fast.youtube.Controller.prototype = {
    search: function(q) {
        model.searchRequest(q, 10, this.makeSearchResult);
    },
    recommend: function(q) {
        console.log(q);
        model.searchRequest(q, 10, this.makeRecommendResult);
    },
    makeSearchResult: function(res) {
        view.drawSearch(res);
    },
    makeRecommendResult: function(res) {
        view.drawRecommend(res);
    }
};

/**
 * DATA 관련 내용
 * @constructor
 */
fast.youtube.Model = function() {
    this.query = "";
};
fast.youtube.Model.prototype = {
    searchRequest: function(q, mx, response) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q: q,
            maxResults: mx
        });
        this.query = q;
        request.execute(function(res) {
            response(res, this.query);
        });
    }
};

var model = new fast.youtube.Model();
var controller = new fast.youtube.Controller();
var view = new fast.youtube.View();

var onClientLoad = function() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
};
var onYouTubeApiLoad = function() {
    gapi.client.setApiKey('AIzaSyBrIfr_DI0XgHdq8oMkW_ZuFuoTcx1pKcs');
};

/**
 * 메인 페이지 (main.html)
 * - 검색 활성화
 *
 * 서브 페이지 (sub.html)
 * - 검색 활성화
 */
