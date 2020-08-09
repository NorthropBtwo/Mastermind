let message = 'Hello World';
console.log(message);

const number1 = 5;
const number2 = 2.8;

console.log(number1 + ' + ' + number2 + ' = ' + add(number1, number2));

function add(n1: number, n2: number): number {
    return n1 + n2;
}

function addTextBox() {
    var num1 = document.getElementById('addNum1') as HTMLInputElement;
    var num2 = document.getElementById('addNum2') as HTMLInputElement;

    var res = add(+num1.value, +num2.value);
    var numRes = document.getElementById('addNumRes') as HTMLInputElement;
    numRes.value = '' + res;
}

function AndLogic(b1: boolean, b2: boolean): boolean {
    return b1 && b2;
}

function AndLogicText() {
    var checkB1 = document.getElementById('checkB1') as HTMLInputElement;
    var checkB2 = document.getElementById('checkB2') as HTMLInputElement;
    var checkB3 = document.getElementById('checkB3') as HTMLInputElement;
    checkB3.checked = AndLogic(checkB1.checked, checkB2.checked);
}

//object type
const person: { name: string; age: number } = {
    name: 'Maximilian',
    age: 33
};

console.log(person.name);

//array are mixed content
const hobbies: string[] = [ 'sports', 'cooking' ];
console.log(hobbies);

const mixedArray: any = [ 'sports', 1 ];

for (const hobby of hobbies) {
    console.log('for: ' + hobby.toLocaleUpperCase());
}

//Tuple is fixed type and fixed length
const role: [number, string] = [ 2, 'author' ];

//enums
enum enRole {
    new = 5,
    old
}

const Myrole = enRole.new;

//union
function combine(input1: number | string, input2: number | string) {
    let result;
    if (typeof input1 === 'number')
        if (typeof input2 === 'number') {
            result = input1 + input2;
        } else {
            result = input1.toString() + input2.toString();
        }
    else {
        result = input1.toString() + input2.toString();
    }
    return result;
}

//literals
let literal: 'as-number' | 'as-text' = 'as-number';
literal = 'as-text';

//types aliasas
type litType = 'as-number' | 'as-text';
let lit2: litType = 'as-number';

//Classes
class Car {
    //field
    private engine: string;

    //cunstructor
    constructor(engine: string) {
        this.engine = engine;
    }

    //function
    dis(): void {
        console.log('Engine is: ' + this.engine);
    }
}

let BMW = new Car('M54');
BMW.dis();

//Inheritance
class Ferrari extends Car {
    static num: number;

    dis(): void {
        console.log('you asked a Ferrari:' + Ferrari.num);
        super.dis();
    }
}

Ferrari.num = 3;

let FerInst = new Ferrari('M54S');
FerInst.dis();

console.log(FerInst instanceof Car);
