/**
 * 객체를 만드는 함수
 * 생성자함수 (constructor)
 */
/**
 * 과제 :
 * 1. 유튜브 동영상 플레이어의 HTML / CSS까지 구현해오기
 * 2. Player에서 이미지, 제목, 앨범, 아티스트명, 프로그레스까지 구현해오기
 * (해도 그만 안해도 그만) 플레이어에 CSS 입히기
 *
 * 이번 주 토요일 수업
 * Carousel (이미지 슬라이더)
 * Scroll 이벤트 (패럴렉스 스크롤링)
 * window, navigatior, 브라우저 내장 객체들
 *
 * 스크롤을 할 때, 스크롤의 현재 위치를 찾는 방법을 작성해보시오
 * offsetTop
 */
var Player = function(aData, oOption) { // oData 헝가리안 표기법 (접두어를 앞에 붙여서 타입을 체크할 수 있도록)
    // this란 무엇인가?
    // 생성할 객체
    this.aData = aData;
    this.nNowIndex = 0; // 변하는 값
    this.nPrevIndex = this.getPrevIndex(); // 변하는 값
    this.nNextIndex = this.getNextIndex(); // 변하는 값

    // DOM
    this.oWrapper = document.querySelector(oOption.wrapper);
    this.oAudio   = this.oWrapper.querySelector(oOption.audio);
    this.btnPrev  = this.oWrapper.querySelector(oOption.btnPrev);
    this.btnPlay  = this.oWrapper.querySelector(oOption.btnPlay);
    this.btnNext  = this.oWrapper.querySelector(oOption.btnNext);

    // DOM
    this.setAudio();
    this.bindBtns();

    // 이후에 생성하는 Player라는 객체에,
    // aData라는 속성이 들어가요
    /**
     * [Data]
     * 데이터
     *
     * [JS]
     * 현재곡 INDEX
     * 다음곡 INDEX
     * 이전곡 INDEX
     * 이전 INDEX 찾기
     * 다음 INDEX 찾기
     * 재생하기
     * 다음곡 재생하기
     * 이전곡 재생하기
     * 자동 재생하기
     *
     * [DOM]
     * 플레이 버튼
     * 이전 재생 버튼
     * 다음 재생 버튼
     * 노래 제목
     * 앨범 아트
     * 앨범 제목
     * 가수 명
     */
};
Player.prototype = {
    getPrevIndex: function() {
        var prevSong = this.nNowIndex - 1;
        if(prevSong === -1) {
            prevSong = this.aData.length - 1;
        }
        return prevSong;
    },
    getNextIndex: function() {
        var nextSong = this.nNowIndex + 1;
        if(nextSong === this.aData.length) {
            nextSong = 0;
        }
        return nextSong;
    },
    bindBtns: function() {
        var that = this;
        this.btnPrev.addEventListener("click", function() {
            that.prev();
        });
        this.btnNext.addEventListener("click", function() {
            that.next();
        });
        this.btnPlay.addEventListener("click", function() {
            that.play();
        });
    },
    setAudio: function() {
        var song = this.aData[this.nNowIndex];

        var audio = document.createElement("audio"),
            source = document.createElement("source");

        source.setAttribute("type", song.type);
        source.setAttribute("src", song.src);

        audio.appendChild(source);

        this.oAudio.innerHTML = "";
        this.oAudio.appendChild(audio);
        this.audio = audio;
    },
    play: function() {
        // HTML 개발자가 내가 정해놓은 코드대로 작성을 하고,
        // new Player()를 하면 플레이어가 생성되도록 한다
        if(this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    },
    prev: function() {
        this.nNowIndex = this.nPrevIndex;
        this.nPrevIndex = this.getPrevIndex();
        this.nNextIndex = this.getNextIndex();
        this.setAudio();
        this.play();
    },
    next: function() {
        this.nNowIndex = this.nNextIndex;
        this.nPrevIndex = this.getPrevIndex();
        this.nNextIndex = this.getNextIndex();
        this.setAudio();
        this.play();
    }
};
// 생성자함수로 생성한 객체 > 인스턴스

// 객체를 생성하는 생성자함수 = Object
// 함수를 생성하는 생성자함수 = Function
// 숫자를 생성하는 생성자함수 = Number
// 배열을 생성하는 생성자함수 = Array