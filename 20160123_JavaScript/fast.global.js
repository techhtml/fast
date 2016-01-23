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
    bindSearchEvent: function() {
        var wrapper = document.querySelector("#search_area"),
            input = wrapper.querySelector(".inp_search"),
            btnSearch = wrapper.querySelector(".btn_search");
        btnSearch.addEventListener("click", function(e) {
            controller.search(input.value);
        });
    },
    drawList: function(res) {
        var searchList = document.querySelector("ul.search_list"),
            datas = res.items,
            ul = searchList || document.createElement("ul"),
            search_section = this.search_section;
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
            ul.innerHTML += htmlString;
        }
        search_section.appendChild(ul);
        search_section.style.display = "block";
        this.video_section.style.display = "none";
        this.video_section.innerHTML = "";
        this.bindVideoEvent();
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
            that = this;
        for(var i = 0; i < anchors.length; i += 1) {
            anchors[i].addEventListener("click", function(e) {
                history.pushState({}, null, this.href);
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
        model.searchRequest(q, 10);
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
    searchRequest: function(q, mx) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            q: q,
            maxResults: mx
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

window.addEventListener("load", function() {
    view.drawVideo();
});

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
