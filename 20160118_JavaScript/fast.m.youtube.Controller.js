fast.m.youtube.Controller = function() { };
fast.m.youtube.Controller.prototype = {
    playVideo: function() {
        this.Player = new fast.m.youtube.Player(data);
        this.List = new fast.m.youtube.List(data);
    }
    /*
    * xx.확장자
    * URL이 바뀌거나
    * https://m.search.naver.com/search.naver
    * http://search.daum.net/search
    * 메인 : https://www.youtube.com/
    * 서브 : https://www.youtube.com/watch?v=pi3jWN2IwzY
    * */
};