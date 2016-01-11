// $(".carousel");
// carousel이라는 클래스를 가진 요소를 가져와라
// document.querySelector / Element.querySelector
// $(".carousel");

// 모든 게 $로 시작한다.
// $()

/**
 * 기능 명세 >
 *
 * Carousel (이미지 슬라이드)
 * 갯수는 제한이 없다.
 * 오른쪽 화살표를 누르면, 다음 이미지로 이동한다.
 * 왼쪽 화살표를 누르면, 이전 이미지로 이동한다.
 * 첫번째에서 왼쪽 화살표를 누르면, 마지막 이미지가 왼쪽에서 나온다.
 * 마지막에서 오른쪽 화살표를 누르면, 첫번째 이미지가 오른쪽에서 나온다.
 *
 * 내가 사용해야하는 것 >
 * 데이터를 계속 반복시켜줄 수 있어야 한다.
 * 노드가 계속 변경될 수 있어야 한다.
 * 되도록이면 네비게이션에 대한 대책도 세워둔다.
 * 애니메이션도 동작 해야한다.
 */

var carouselData = [{
    img: "https://scontent.xx.fbcdn.net/hphotos-xfp1/t31.0-8/10259250_942071522542493_9014482121000555701_o.jpg"
},{
    img: "https://scontent.xx.fbcdn.net/hphotos-xfl1/t31.0-8/12362770_942071779209134_6808983702251497743_o.jpg"
},{
    img: "https://scontent.xx.fbcdn.net/hphotos-xpa1/t31.0-8/1412765_942071695875809_8034542480149890673_o.jpg"
},{
    img: "https://scontent.xx.fbcdn.net/hphotos-xaf1/t31.0-8/10470723_942071595875819_4806908960288032056_o.jpg"
},{
    img: "https://scontent.xx.fbcdn.net/hphotos-xpf1/t31.0-8/12371212_942071582542487_2048517773505821517_o.jpg"
},{
    img: "https://scontent.xx.fbcdn.net/hphotos-xfp1/t31.0-8/12377937_942071539209158_1931430353485253389_o.jpg"
}];

var getPrev = function() {
    var prev = now - 1;
    if(prev === -1) {
        prev = carouselData.length - 1;
    }
    return prev;
};

var getNext = function() {
    var next = now + 1;
    if(next === carouselData.length) {
        next = 0;
    }
    return next;
};


var now = 0;
var prev = getPrev();
var next = getNext();

var draw = function() {
    $(".carousel-panel").each(function(i, e) {
        var data;

        switch (i) {
            case 0:
                data = carouselData[prev].img;
                break;

            case 1:
                data = carouselData[now].img;
                break;

            case 2:
                data = carouselData[next].img;
                break;
        }

        /*
         if(i === 0) { data = carouselData[prev].img }
         if(i === 1) { data = carouselData[now].img }
         if(i === 2) { data = carouselData[next].img }
         */

        var img = $("<img>")
            .attr("src", data)
            .attr("alt", "")
            .css({"width": "100%"});

        var parentWidth = $(".carousel").width();

        $(this)
            .html("")
            .append(img)
            .css({
                "width": parentWidth,
                "float": "left"
            });
    });
};
draw();

var parentWidth = $(".carousel").width();
var totalWidth = parentWidth * $(".carousel-panel").length;

$(".carousel-wrap")
    .css({
        "position": "relative",
        "left": "-" + parentWidth + "px",
        "width": totalWidth,
        "overflow": "hidden"
    });

$(".carousel-mask").css({
    "width": parentWidth,
    "overflow": "hidden"
});

var prepare = function(that) {
    next = getNext();
    prev = getPrev();
    draw();
    $(that).css({
        "left": "-" + parentWidth + "px"
    })
};
var moveNext = function() {
    $(".carousel-wrap").animate({
        left: "-=" + parentWidth
    }, 500, function() {
        now = getNext();
        prepare(this);
    });
};

var movePrev = function() {
    $(".carousel-wrap").animate({
        left: 0
    }, 500, function() {
        now = getPrev();
        prepare(this);
    })
};