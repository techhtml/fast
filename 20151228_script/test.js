var count;
// 변수 선언
// 유효 범위

console.log(count);
// undefined

count = 10;
// 변수에 값을 넣어줬다

console.log(count);
// 10
// 전역변수 (Global)
// 스코프 (scope)

function move() {
    var num = 20;
    console.log("move", num);
    // 20
    function moveLeft() {
        var num = 30;
        console.log(num); // 30
    }
    moveLeft();
    console.log(num); // 20
}

function sum(a, b) {
    return a + b;
}
sum(30, 30);

function calc(a) {
    var num1 = a;
    return function(b) {
        var num2 = b;
        return num1 + num2;
    }
}

move();
// num is not defined
// 변수명 + is not defined가 나오면 오타일 가능성이크다

var cl = calc(1);
// num1 = 1

cl(30);
// num1, num2?
// num2 = 5
// num1 = ?



