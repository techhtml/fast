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

/**
 * jQuery를 사용한다는 것..
 * $를 쓴다
 * 베이스 $('').메서드()
 * btn_prev에 click 이벤트를 넣어줄거다
 * $(".btn_prev").click(function() { });
 * 모든게 $로 시작
 * $의 메서드 (click)들로 확장을 시켜나가는 형태
 * 메서드 확장 (사용자 정의 메서드를 지정할 수 있어야 한다)
 *
 * 플러그인
 * 특정 프로그램에 종속되어있는 기능을 추가하는 것 (확장하는 것)
 * jQuery에는 carousel 기능이 없음
 * jQuery에 carousel 플러그인을 생성함으로써, 누군가가 만든 플러그인을 갖다 씀으로써
 * jQuery 기능을 확장하는 게 가능해진다
 */

$.fn.carousel = function(options) {

    this.getPrev = function() {
        var prev = this.now - 1;
        if(prev === -1) {
            prev = this.data.length - 1;
        }
        return prev;
    };

    this.getNext = function() {
        var next = this.now + 1;
        if(next === this.data.length) {
            next = 0;
        }
        return next;
    };

    this.init = function() {
        this.data = options.data;
        this.now = 0;
        this.next = this.getNext();
        this.prev = this.getPrev();
    };

    this.getData = function(i) {
        var data;
        switch (i) {
            case 0:
                data = this.data[this.prev].img;
                break;

            case 1:
                data = this.data[this.now].img;
                break;

            case 2:
                data = this.data[this.next].img;
                break;
        }
        return data;
    };

    this.draw = function(data, parent) {
        var img = $("<img>")
            .attr("src", data)
            .attr("alt", "")
            .css({"width": "100%"});

        $(parent)
            .append(img)
            .css({
                "width": this.parentWidth,
                "float": "left"
            });
    };

    this.changeImg = function() {
        var that = this;

        $(this).find(options.panel).each(function(i, e) {
            var data = that.getData(i);
            $(this)
                .find("img")
                .attr("src", data);
        });
    };

    this.initDOM = function() {
        var that = this;

        this.parentWidth = $(this).width();
        this.totalWidth = this.parentWidth * $(this).find(options.panel).length;

        $(this).find(options.panel).each(function(i, e) {
            var data = that.getData(i);
            that.draw(data, this);
        });

        $(options.wrap).css({
            "position": "relative",
            "left": "-" + this.parentWidth + "px",
            "width": this.totalWidth,
            "overflow": "hidden"
        });

        $(options.mask).css({
            "width": this.parentWidth,
            "overflow": "hidden"
        });

    };

    this.bindEvent = function() {
        var that = this;

        $(options.prev).click(function() {
            that.movePrev();
        });

        $(options.next).click(function() {
            that.moveNext();
        });
    };

    this.prepare = function(that) {
        this.next = this.getNext();
        this.prev = this.getPrev();
        this.changeImg();
        $(that).css({
            "left": "-" + this.parentWidth + "px"
        })
    };

    this.moveNext = function() {
        var that = this,
            animated = false;

        $(options.wrap).animate({
            left: "-=" + that.parentWidth
        }, 500, function() {
            if(animated === false) {
                that.now = that.getNext();
                that.prepare(this);
                animated = true;
            } else {
                animated = false;
            }
        });
    };

    this.movePrev = function() {
        var that = this,
            animated = false;

        $(options.wrap).animate({
            left: 0
        }, 500, function() {
            if(animated === false) {
                that.now = that.getPrev();
                that.prepare(this);
                animated = true;
            } else {
                animated = false;
            }
        });
    };

    this.init();
    this.initDOM();
    this.bindEvent();

    return this;
};


var carousel = $(".carousel").carousel({
    data: carouselData,
    panel: ".carousel-panel",
    wrap: ".carousel-wrap",
    mask: ".carousel-mask",
    prev: ".btn_prev",
    next: ".btn_next"
});


/*
    $(".carousel-wrap2").carousel({
        data: carouselData2
    });
*/