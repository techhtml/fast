
// 2. 네비게이터
// window (현재 내가 사용하고 있는 브라우저 창)
// navigator (현재 내가 사용하고 있는 브라우저 그 자체)
// Netscape navigator
// 자바스크립트 개발한 회사 (Netscape navigator)
// 브라우저의 대명사 = navigator
console.log(navigator.userAgent);
// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1)
// AppleWebKit/601.2.7 (KHTML, like Gecko)
// Version/9.0.1 Safari/601.2.7 (index.html, line 26)

// Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1)
// AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/47.0.2526.106 Safari/537.36

// Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0)
// Gecko/20100101 Firefox/43.0

// Mozilla/5.0
// (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko)
// Version/8.0 Mobile/12A4345d Safari/600.1.4

// Mozilla/5.0
// (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E)
// AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/44.0.2403.20 Mobile Safari/537.36

// Mozilla/5.0 (MeeGo; NokiaN9)
// AppleWebKit/534.13 (KHTML, like Gecko)
// NokiaBrowser/8.5.0 Mobile Safari/534.13

//Mozilla/5.0
// (Linux; Android 4.2.2; GT-I9505 Build/JDQ39)
// AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/31.0.1650.59 Mobile Safari/537.36

var ua = navigator.userAgent;
if(ua.search("Safari") !== -1) {
    // 페이지를 모바일로 이동
}
// 서버단에서의 반응형
if(ua.search("MSIE 7") !== -1) {
    document.body.setAttribute("class","ie7");
}
// 모바일이라면 X라는 리소스를 내뱉고
// PC라면 Y라는 리소스를 내뱉어라

// 모바일이라면 m.naver.com
// PC라면 naver.com

// 모바일, PC 콘텐츠 다름
// 반응형보다는, 각 페이지별 사이트를 만드는게 더 효율적일 수 있다
// 적응형 웹 디자인

// 반응형 웹 디자인
// HTML은 그대로 두고, CSS랑 미디어쿼리를 가지고 특정한 해상도,
// 전체 기기에서 내가 원하는 최적의 사용성을 가질 수 있게 하는 기술

// 적응형 웹 디자인
// 개념 : 반응형하고 똑같음
// 리소스(HTML)를 불러 올 때, 서버에서 처리를 해서 불러옴.
// 네이버 : 적응형 웹 디자인
// m.naver.com (반응형)
// 리소스 (m.naver.com, naver.com)

// 단계적 기능향상 (Progressive Enhancement)
// Chrome 애니메이션, IE에서는 안돼
// 1. CSS3 Animation을 사용하되 IE를 포기한다
// 2. JavaScript로 구현한다. 다만 성능 보장은 안됨
// 1번 방법이 단계적 기능향상
// 2번 방법은 기존 방법

// 최신에서는 CSS3
// 옛날에서는 JS