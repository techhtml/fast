// 1. 변수 선언하기
// var라는 키워드를 사용합니다
// variable (변할 수 있는, 변수)
// document.getElementById("menu");

// 1-1. 그냥 다 넣기
// document.getElementById("menu").setAttribute("class", "menu");
// document.getElementById("menu").getAttribute("class");
// 변수명은 숫자로 시작해선 안되며, 영문으로 시작해야 함.

// 1-2. 메뉴를 변수에 넣기
var menu = document.getElementById("menu");
menu.setAttribute("class", "menu");
menu.getAttribute("class");

// 1-3. 수정 예제
document.querySelector(".menu").setAttribute("class","menu on");
document.querySelector(".menu").setAttribute("class","menu off");
// menu라는 클래스를 가진 요소를 가져와서,
// class 속성의 값을 "class on"으로 준다

// 1-3-2. 수정 후
var navigation = document.querySelector(".menu");
var on = function() {
    navigation.setAttribute("class", "menu on");
};
var off = function() {
    navigation.setAttribute("class", "menu off");
};
on();
off();

// - 함수형 프로그래밍
// -- 일급 객체 (Frist Class Citizen)
// -- 함수, 변수, 객체를 모두 같은 등위
// -- 객체의 속성으로 함수를 넣을 수 있다
// -- 변수에 함수나 객체를 넣을 수 있다

// 2. 변수 문법 익히기
// 2-1. num이라는 변수에 10을 넣어보세요.
var num = 10;
// var num;
// Number (숫자, 인간)
// var num;
// undefined (정의되지 않음, 컴퓨터)
// var num = 10;
// Number (숫자, 컴퓨터)
// Number (숫자, 인간)

// 2-2. name이라는 변수에 본인 이름을 넣어보세요.
var name = "조은";
// String (문자열, 컴퓨터)
// String (문자열, 인간)

// 2-3. sum이라는 변수에 함수를 넣어보세요.
var sum = function() {

};
// Function (문자열, 컴퓨터)
// Function (문자열, 인간)

// 3. 타입별 특징 이해하기
// 3-1. Number (숫자)
var n = 1;
// n++;    n에 1을 더하시오.
n += 1; // n에 1을 더하시오.
// ++n;    n에 1을 더하시오.

// n--;    n에 1을 빼시오
n -= 1; // n에 1을 빼시오
// --n;    n에 1을 빼시오

var result = n + 1; // 덧셈
var result = n - 1; // 뺄셈
var result = n * 1; // 곱셈
var result = n / 1; // 나눗셈
var result = n % 1; // 나누고 나머지

var number = 10;
var result = number % 3; // 1
var result = number / 3; // 3.3333333333

// 3-2. String (문자열)
var firstName = "조";
var lastName = "은";
var name = firstName + lastName;
// "조은";

var number1 = "10";
var number2 = 20;
var res = number2 + number1; // 2010

var number1 = parseInt(number1, 10);
// (정수로 만들 대상, 진수);
// number1 = 10;

// 3-3. 객체 (이후 설명)
var obj = {};

// 3-4. boolean
var dfn = true;
var dfn = false;

// 3-5. undefined
var b;
// 선언을 끝냈잖아..
// undefined
// 선언 = declaration (DOCTYPE, DTD, Document Type Declaration)
// 변수 선언 (var b);
// var b = 10
// 변수 정의
b = 10;

// 3-6. null
var mind = null;
// 빈 값을 정의
// 미리 메모리 공간에 할당할 값을 좀 채워둠

// -- 10분까지 휴식

// 4. 함수 생성하기
var toggle = function() {};
// function close() {alert("close")}

// 4.1. 함수 구조 이해하기
var sum = function() {
    // 함수 BODY
    // 이 함수를 호출했을 때 실행할 것들
    var result = 10 + 20;
    // result = 30
};
// 4.1.1. 매개변수 이해하기
// 4.1.2. 함수 return 이해하기
var sum = function(num1, num2) {
    // 괄호 안에 들어가는 걸 매개변수(파라미터)라고 부름
    // 여러개를 써주고 싶으면 쉼표(,)를 써서 구분함
    // 매개변수는 함수 BODY안에서만 사용 가능

    var result = num1 + num2;
    // sum이라는 함수가 해야하는 역할
    // 1번째 숫자와 2번째 숫자를 받아서,
    // 두 숫자를 더한 뒤에 더한 값을 반환해줌

    return result;
};
var result = sum(20, 30);

// 5. 함수 호출하기
sum(10, 20);

// 6. 함수의 호출과 생성 이해하기
sum(10,20);
// sum이라는 함수
var sum = function(num1, num2) {
    var result = num1 + num2;
    return result;
};
// sum BODY 안 변수들
// num1, num2, result
// scope (변수의 유효범위)
// scope는 함수단위로 끊깁니다.

var num1 = 10;
var sum = function(num1, num2) {
    var result = num1 + num2;
    return result;
};
sum(50, 40);
// num1의 값
console.log(num1);
// 10이 찍힙니다

// 6.1. 클로져

// 조건이 두개
// 1. num1과 num2를 다른 시점에 넣어줘야한다
// 2. 다른 함수가 num1을 알고있어야 한다.

/*
var sum = function(num1, num2) {
    return num1 + num2;
};
*/

// 예전에 모 수강생이 이렇게도 만들었다...
var num3;
var sum1 = function(num1) {
    num3 = num1;
    return num1;
};
var sum2 = function(num2) {
    return num3 + num2;
};
sum1(10);
sum2(50);

var calc = function(num1) {
    return function(num2) {
        return num1 + num2;
    }
};
var firstCalc = calc(10);
firstCalc(30);

// 6.2. 커링
// 리턴값이 함수일 때, 함수를 다시 호출하는 기법
var result = calc(10)(30);

// E.g. input 두개에서 값을 받아와 더하는 함수 만들기
// E.g. 계산기 구현하기
// 과제로 내지 않을게요... 미안해요..

// 7. 스코프 이해하기
// 스코프 (scope - 목적)
// 변수의 유효범위
// 함수로 감싸지 않았다. = 전역 (Public)
// 함수로 감쌌다 = 지역 (Private)

var number1 = 50;

var sum = function() {
    var number1 = 100;
    // number1
};

// 8. 객체 이해하기
var ChoEun = {
    name: "ChoEun",
    age: 23,
    getAge: function() {
        return this.age;
    },
    setAge: function(age) {
        this.age = age;
    }
};
ChoEun.getAge(); // 23;
ChoEun.setAge(24); // 24;

// 9. 용어 정리 (속성, 메소드, 선언, 호출)

// 10. 생성자함수 이해하기 (constructor)
// 붕어빵이라는 객체를 만들기 위해, 사용하는 함수
// 형틀
// 생성자함수로 만든 객체를 각각 부를 때, 인스턴스

var VideoItem = function(options) {
    // 1. 데이터를 받아온다.
    this.url = options.url;
    this.img = options.img;
    this.time = options.time;
    this.title = options.title;
    this.write = options.write;
    this.count = options.count;

    // 2. 데이터를 해석한 뒤, 적절하게 처리한다
    this.timeData = {};
    this.getTime = function() {
        this.timeData.min = parseInt(this.time / 60, 10);
        this.timeData.sec = parseInt(this.time % 60, 10);
        if(this.timeData.min >= 60) {
            this.timeData.hour = parseInt(this.timeData.min / 60, 10)
            this.timeData.min = parseInt(this.timeData.min % 60, 10)
        }
    };
    this.getTime();
    // 3. DOM을 그려준다.
    // 3.1. React 같은.. 자바스크립트 VIEW 라이브러리를 쓴다
    // 3.2. DOM을 일일히 그려준다.
    var li = document.createElement("li"),
        elThumb = document.createElement("img"),
        elTerm = document.createElement("dl"),
        elTitle = document.createElement("dt"),
        elWrite = document.createElement("dd"),
        elCount = document.createElement("dd"),
        elAnchor = document.createElement("a");

    elAnchor.setAttribute("href", this.url);
    elThumb.setAttribute("src", this.img);
    elTitle.innerHTML = this.title;
    elWrite.innerHTML = "<strong>게시자</strong>" + this.write;
    elCount.innerHTML = "<strong>조회수</strong>" + this.count;

    elTerm.appendChild(elTitle);
    elTerm.appendChild(elWrite);
    elTerm.appendChild(elCount);

    elAnchor.appendChild(elThumb);
    elAnchor.appendChild(elTerm);

    li.appendChild(elAnchor);

    // 3.3. innerHTML에 넣어준다.
    var htmlString = "<li><a href=" + this.url + ">" +
        "<img src=" + this.img + " alt=''>" +
        "<dl>" +
        "<dt>" + this.title + "</dt>" +
        "<dd><strong>게시자</strong>" + this.write + "</dd>" +
        "<dd><strong>조회수</strong>" + this.count + "</dd>" +
        "</dl>" +
        "</a></li>";
    document.body.innerHTML = htmlString;
    // 4. 위에서 한 과정들을 메서드로 묶어준다

    // 5. 공통적인 메서드는 상속시킨다
};
var video = new VideoItem({
    url: "https://www.youtube.com/watch?v=QbmLx727aAI",
    img: "https://i.ytimg.com/vi/9WoCR4B_qNo/default.jpg",
    time: 3890,
    title: "秦 基博 / アイ",
    write: "OfficeAugusta ",
    count: 13149865
});

// 11. 생성자함수와 객체

// 12. this 이해하기
VideoItem.getTime();
// 1시간 몇분 몇초
// 메서드에서의 this
var ChoEun = {
    name: "조은",
    age: 24,
    getName: function() {
        this.name;
    }
};
ChoEun.getName();

// 생성자 함수에서의 this
var Person = function(name, age) {
    // 생성될 객체에 대한 정보를 갖고 있어야한다.
    // this === 생성될 객체
    this.name = name;
    this.age = age;
    this.getName = function() {
        return this.name;
    };
    this.setName = function(name) {
        this.name = name;
    };
};
var ChoEun = new Person("조은", 24);
// 과제. 자바스크립트로 비디오 플레이어 구현해보기
// E.g. 자바스크립트로 리스트 UI 구현해보기

// 13. 소프트웨어 메모리
var choeun;
// 브라우저 메모리
// 메모리가 부족한 상황이 생길 수 있다..
// 브라우저에서는... 메모리가 부족하면.. 브라우저가 꺼짐.
// 탭이 닫히거나, 응답을 안하거나
// 작업해야하는 무언가 (Quoue);

console.log("hello world"); // 1번째 작업
console.log("hello world 2"); // 2번째 작업
console.log("hello world 3"); // 3번째 작업

// 13.1. 자바스크립트 메모리 최적화
ChoEun = undefined;

// 13.2. 자바스크립트 메모리 누수

// 14. 상속
var Person = function(name, age) {
    this.name = name;
    this.age = age;
};
Person.prototype = {
    getName: function() {
        return this.name;
    },
    setName: function(name) {
        this.name = name;
    },
    getAge : function() {
        return this.age;
    },
    setAge : function(age) {
        this.age = age;
    }
};
var ChoEun = new Person("조은", 24);
ChoEun.getName(); // "조은"
ChoEun.getAge(); // 24

var IU = new Person("아이유", 24);
IU.getName(); // "아이유";
IU.getAge(); // 24

// 14.1. 프로토타입 상속

// E.g. 캐러셀 구현해보기