
var age = 24;
// age 변수에 24라는 값
// age 변수는 전역 변수
// JavaScript에서는, 브라우저에서는 window를 전역공간
// 변수를 지정한다는 것 자체가 window라는 객체에
// 프로퍼티를 추가하는 것과 똑같음

// 브라우저에서 사용하는 자바스크립트
// window가 전역 네임스페이스

// 회사에서 개발을 할 때..
// 네임스페이스 선언 패턴
var baemin = baemin || {};
// if(baemin) {
//  baemin = baemin
// } else {
//  baemin = {};
// }
baemin.web = baemin.web || {};
baemin.app = baemin.app || {};

// window (전역 네임스페이스)
// window (여러분들이 보고있는 브라우저 창 그 자체)
console.log(window);
// DOM은 브라우저별로 가지고 있는 속성이 다를 수도..

// inner는 내가 사용할 수 있는 공간
console.log(innerWidth);
console.log(innerHeight);

// outer는 전체 공간
console.log(outerWidth);
console.log(outerHeight);

// 브라우저에서 스크롤이 발생을 해야해요.
// document
// document.body
// document.body > main
// 테스트 코드
window.addEventListener("wheel", function(e) {
    // 스크롤 이벤트
    // 1. 내 현재 스크롤 위치가 어디인지
    // console.log(e.clientY);
    // console.log(e.clientX);
    // console.log(e.layerX);
    // console.log(e.layerY);
    // console.log(e.offsetX);
    // console.log(e.offsetY);
    // console.log("event", e);
    console.log(window.pageYOffset);
    // 2. 내가 애니메이션을 시키든가.
    //    뭔가를 시킬 타겟의 위치가 어디인지

    var div = document.querySelector(".second-div");
    // 로직을 짠다 === 계산을 한다
    // 스크롤이벤트
    // 페이지 상단 스크롤 = window.pageYOffset; (0 ~ 최댓값)
    // 타겟이 위에서부터 얼마나 떨어져있는지 = Element.offsetTop (538)
    // 페이지 하단이 어느정도인지..
    // 다음 스크롤 좌표가 어느 지점 정도인지
    var divHeightHalf = div.offsetHeight / 2;
    var pageTop = window.pageYOffset + window.innerHeight;
    var targetTop = div.offsetTop + divHeightHalf;
    var targetBottom = div.offsetTop + div.offsetHeight;
    if(pageTop >= targetTop && pageTop <= targetBottom) {
        div.style.background = "red";
    }
    if(window.pageYOffset > targetBottom) {
        div.style.background = "green";
    }

    // 전체값
    // div가 더이상 보이지 않을 때의 좌표
});
window.addEventListener("scroll", function(e) {
    // console.log(e);
});

// 브라우저의 로딩이 끝났을 때 이 스크립트가 동작했으면...
/* window.addEventListener("load", function(e) {
 console.log(e);
 }); */