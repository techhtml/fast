var count = 20;

console.log("test2", count);
// 1. undefined
// 2. 10

// Type 예제

var num = 10;
// Number

var str = "조은";
// String

var bol = true;
// State
// 스위치

var macbook = {
    model: "MacBook Pro",
    processorName: "Intel Core i5",
    processorSpeed: "2.7 GHz"
};

console.log(macbook.model); // Macbook Pro;
macbook.model ="iMac";

console.log(macbook.model); // iMac;

// 조은 -> 조은별
str = "조은별";

// menu off -> menu on
// klass = "menu off".replace("off", "on");


/* function move3() {
    console.log("조은 바보");
}*/
// 잘 안쓰이는 함수 선언문

var move2 = function() {
    console.log("조은 천재");
};
// 함수 표현식
move2();

var sum = function(num1, num2) {
    num1 = parseInt(num1, 10);
    num2 = parseInt(num2, 10);
    return num1 + num2;
};
// 함수 표현

var result = sum("10", 128);
// 함수 호출

console.log(result);
// 30

// 계산기
// 1. 숫자를 넣는다.
// 1.1. 1에서 넣은 숫자를 기억한다.
// 2. 행할 행위를 정한다 (더하기, 빼기, 곱하기, 나누기)
// 2.1. 2에서 넣은 행위를 기억한다.
// 3. 숫자를 또 넣는다.
// 4. 값을 반환한다.

var calc = function(numA) {
    numA = parseInt(numA, 10);
    return function(state) {
        return function(numB) {
            var result;
            numB = parseInt(numB, 10);
            if(state === "+") {
                result = numA + numB;
            } else if(state === "-") {
                result = numA - numB;
            } else if(state === "/") {
                result = numA / numB;
            } else if(state === "*") {
                result = numA * numB;
            }
            return result;
        }
    }
};

calc(10)("/")(50);

var body = document.querySelector("body");
var brwoserSize;
/**
 * 1. DOM 과제
 * 1.1. 버튼을 클릭했을 때 (1)
 * 1.2. 특정 요소에 Class를 변경하되,
 * 1.3. 클래스 명을 on / off 형태로 해주세요.
 * 1.4. 이 때, setAttribute를 쓰시되, on / off는 텍스트로 넣으시면 안됩니다.
 * 1.5. setAttribute("class", "on");
 * 1.6. String.replace();
 * 2. DOM 과제 2 (CSS 포함)
 * 2.1. 좌측에 메뉴가 있어요.
 * 2.2. 스크린이 가로로 길어졌을 때는 자동으로 보이게
 * 2.3. 스크린이 가로로 짧아졌을 때는 보이지 않게
 * 2.4. 메뉴가 보였을 때, 우측의 콘텐츠가 영향을 받도록 해주세요.
 * 2.5. 스크린이 클 때는 버튼을 클릭했을 때 메뉴가 보이도록 해주세요
 * 2.6. body에 padding을 조정하면 조금 더 구현하기 쉬움
 *
 *
 *
 *
 *
 */








