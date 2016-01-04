/**
 * Music Player
 * 기능명세서
 * 1. 음악을 재생할 수 있어야 한다.
 * 2. 이전, 다음 곡 재생이 가능해야한다.
 * 3. 현재 어디까지 재생했는 지 확인이 가능해야한다. (Progress)
 * 4. 현재시간 / 전체시간이 분:초로 나와야한다. (대응은 분:초까지) : 과제
 * 5. 앨범 커버가 있다면 앨범 커버도 보여줘야한다.
 * 6. 자동 재생을 지원해야한다.
 * audio API는 여기 (https://www.w3.org/wiki/HTML/Elements/audio)
 */

/**
 * 스크립트를 짜기 위해 어떤 일부터 하면 좋을까요?
 */

/**
 * 첫번째로 할일 : 객체 작성
 */

var musicPlayer = {
    playList    : [],
    nowSong     : 1,
    nextSong    : 2,
    prevSong    : 0,
    duration    : 400,
    currentTime : 0,
    play        : function() {},
    stop        : function() {},
    next        : function() {},
    prev        : function() {}
};

/**
 * 음악을 재생하는 기능을 구현해봅시다.
 */

/**
 * var audio = document.querySelector("audio");
 * audio.play();
 */

/**
 * 이전, 다음 곡 재생이 가능해야한다.
 * 데이터를 먼저 생성해야 한다.
 */
var playList = [{
    title  : "음오아예",
    artist : "마마무",
    album  : "음오아예",
    art    : "http://ilyricsbuzz.com/wp-content/uploads/2015/06/MAMAMOO-Pink-Funky.jpg",
    src    : "http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4",
    type   : "audio/mp3"
},{
    title  : "나팔바지",
    artist : "싸이",
    album  : "칠집싸이다",
    art    : "https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s640x640/sh0.08/e35/12338578_180329735646396_444237649_n.jpg",
    src    : "http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4",
    type   : "audio/mp3"
},{
    title  : "I",
    artist : "태연 (Feat. 버벌진트)",
    album  : "I - the first mini album",
    art    : "https://sleeplessaliana.files.wordpress.com/2015/10/taeyeon.jpg",
    src    : "http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4",
    type   : "audio/mp3"
},{
    title  : "청춘",
    artist : "김필 (Feat. 김창완)",
    album  : "응답하라 1998 OST Part 1",
    art    : "http://img.tenasia.hankyung.com/webwp_kr/wp-content/uploads/2015/10/2015103008424310983-540x540.jpg",
    src    : "http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4",
    type   : "audio/mp3"
},{
    title  : "사랑이 맞을거야",
    artist : "윤미래",
    album  : "THIS LOVE",
    art    : "http://cfile29.uf.tistory.com/image/2165B54D566E9B3538C9EB",
    src    : "http://media.w3.org/2010/07/bunny/04-Death_Becomes_Fur.mp4",
    type   : "audio/mp3"
}];

// playList[0] = 음오아예
// playList[1] = 나팔바지
// playList[2] = 태연 I
// playList[3] = 청춘
// playList[4] = 사랑이 맞을거야

/**
 * 이전곡 재생
 * playList의 숫자에서 하나 빼고...
 */

// JS
var nowSong = 0;
var getNext = function() {
    var nextSong = nowSong + 1;
    if(nextSong === playList.length) {
        nextSong = 0;
    }
    return nextSong;
};
var getPrev = function() {
    var prevSong = nowSong - 1;
    if(prevSong === -1) {
        prevSong = playList.length - 1
    }
    return prevSong;
};
var nextSong = getNext();
var prevSong = getPrev();

// DOM
var musicArea = document.querySelector("#music_area");
var progress = function() {
    var now = this.currentTime / this.duration * 100,
        progress = document.querySelector(".inner-progress");
    progress.style.width = now + "%";
};
var play = function() {
    // 가독성을 위해, 변수를 만들었어요.
    var song = playList[nowSong];

    // source를 바꾸는 것 만으로는 구현이 안되니까 audio를 생성해 줍니다.
    var htmlString = "<audio><source src=" + song.src + " type=" + song.type + "></audio>";
    musicArea.innerHTML = htmlString;

    // audio를 가져와서
    var audio = document.querySelector("audio");

    // 재생
    audio.play();

    // 플레이가 된 직후에 확인하기
    audio.addEventListener("timeupdate", progress);

    // 플레이가 끝났을 때
    audio.addEventListener("ended", next);
};
var stop = function() {
    var audio = document.querySelector("audio");

    audio.pause();
    audio.currentTime = 0;
};
var draw = function() {
    var song = playList[nowSong],
        img = document.querySelector("#player img"),
        title = document.querySelector("#player .music_title"),
        artist = document.querySelector("#player .music_artist");

    img.setAttribute("src", song.art);
    title.innerHTML = song.title;
    artist.innerHTML = song.artist + " / " + song.album;
};
var next = function() {
    nowSong = nextSong;
    nextSong = getNext();
    prevSong = getPrev();
    draw();
    play();
};
var prev = function() {
    nowSong = prevSong;
    nextSong = getNext();
    prevSong = getPrev();
    draw();
    play();
};

// 이벤트 바인딩
// 1. 플레이버튼 (현재, 이전, 다음)
var btnPlay = document.querySelector(".play");
var btnPrev = document.querySelector(".prev");
var btnNext = document.querySelector(".next");

btnPlay.addEventListener("click", play);
btnPrev.addEventListener("click", prev);
btnNext.addEventListener("click", next);

/**
 * 자동 재생?
 */
