let message2 = 'Hello World';
console.log(message2);

let pegelColors: Color[] = [
    new Color(212, 114, 114),
    new Color(205, 212, 114),
    new Color(114, 148, 212),
    new Color(146, 114, 212),
    new Color(128, 212, 114),
    new Color(114, 207, 212),
    new Color(212, 114, 203)
];

function ReplaceElement(id: string, replacement: string) {
    let Obj = document.getElementById(id) as HTMLUnknownElement; //any element to be fully replaced
    if (Obj.outerHTML) {
        //if outerHTML is supported
        Obj.outerHTML = replacement; ///it's simple replacement of whole element with contents of str var
    } else {
        //if outerHTML is not supported, there is a weird but crossbrowsered trick
        var tmpObj = document.createElement('div');
        tmpObj.innerHTML = '<!--THIS DATA SHOULD BE REPLACED-->';
        let ObjParent = Obj.parentNode as HTMLDivElement; //Okey, element should be parented
        ObjParent.replaceChild(tmpObj, Obj); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
        ObjParent.innerHTML = ObjParent.innerHTML.replace(
            '<div><!--THIS DATA SHOULD BE REPLACED--></div>',
            replacement
        );
    }
}

class GuessFeedback {
    NumBlackPegels: number; //NumberOfMachtes
    NumWhitePegels: number; //NumberOfRightColorsButWongPosition
    CorrectGuess: boolean;

    constructor(NumBlackPegels: number, NumWhitePegels: number, pegsInRow: number) {
        this.NumBlackPegels = NumBlackPegels;
        this.NumWhitePegels = NumWhitePegels;
        this.CorrectGuess = NumBlackPegels == pegsInRow;
    }
}

class Mastermind {
    private pegsInRow: number;
    private NumberOfRows: number;
    private NumberOfPegColors: number;

    private secretCode: number[];
    private NumGuessed: number;

    constructor() {
        this.pegsInRow = 4;
        this.NumberOfRows = 8;
        this.NumGuessed = 0;
        this.NumberOfPegColors = 5;
    }

    GetPegsInRow(): number {
        return this.pegsInRow;
    }

    CreateRandomCode() {
        //this.secretCode = [ 0, 1, 2, 3 ];
        let sec_temp: number[] = [];
        for (let i = 0; i < this.pegsInRow; i++) {
            sec_temp.push(Random.RangeInt(0, this.NumberOfPegColors));
        }
        this.secretCode = sec_temp;
        console.log(this.secretCode);
    }

    GuessCode(guess: number[]): GuessFeedback {
        let numBlackPegels = 0;
        let NumWhitePegels = 0;
        let codeCopy = this.secretCode.slice();
        for (let i = 0; i < guess.length; i++) {
            const gi = guess[i];
            if (gi == codeCopy[i]) {
                codeCopy[i] = -1;
                numBlackPegels++;
            }
        }

        for (let i = 0; i < guess.length; i++) {
            const gi = guess[i];
            if (codeCopy[i] != -1) {
                for (let y = 0; y < guess.length; y++) {
                    if (gi == codeCopy[y]) {
                        codeCopy[y] = -2;
                        NumWhitePegels++;
                        break;
                    }
                }
            }
        }

        let gf = new GuessFeedback(numBlackPegels, NumWhitePegels, this.GetPegsInRow());
        this.NumGuessed++;
        return gf;
    }

    GetGuessesLeft(): Number {
        return this.NumberOfRows - this.NumGuessed;
    }
}

let mm = new Mastermind();
mm.CreateRandomCode();
let playerHasWon = false;

//userInput
function OnGuess(row: number): void {
    let in0 = document.getElementById('p0r' + row) as HTMLSelectElement;
    let in1 = document.getElementById('p1r' + row) as HTMLSelectElement;
    let in2 = document.getElementById('p2r' + row) as HTMLSelectElement;
    let in3 = document.getElementById('p3r' + row) as HTMLSelectElement;

    let guess = [ +in0.value, +in1.value, +in2.value, +in3.value ];
    //check input
    for (const guessVal of guess) {
        if (guessVal < 0) {
            alert('Use the blue fileds to select a color');
            return;
        }
    }

    let gf = mm.GuessCode(guess);

    //add text at end
    let answerDiv = document.getElementById('answerDiv') as HTMLUnknownElement;
    let div = document.createElement('div');
    let hi = document.createTextNode(
        in0.value +
            ' ' +
            in1.value +
            ' ' +
            in2.value +
            ' ' +
            in3.value +
            ' Black: ' +
            gf.NumBlackPegels +
            ' White: ' +
            gf.NumWhitePegels
    );
    div.appendChild(hi);
    //answerDiv.insertBefore(div, answerDiv.childNodes[0]);

    //replace guess button
    let gf_result: number[] = [];
    for (let i = 0; i < gf.NumBlackPegels; i++) {
        gf_result.push(1);
    }
    for (let i = 0; i < gf.NumWhitePegels; i++) {
        gf_result.push(2);
    }
    let output = '';
    for (let i = 0; i < mm.GetPegsInRow(); i++) {
        if (gf_result[i] == 1) {
            output += '<div class="blackResPegel"></div> ';
        } else if (gf_result[i] == 2) {
            output += '<div class="whiteResPegel"></div> ';
        } else {
            output += '<div class="transparentResPegel"></div> ';
        }
    }

    //let cmdGuess = document.getElementById('cmdGuessr' + row) as HTMLInputElement;
    //ReplaceElement('cmdGuessr' + row, 'Black: ' + gf.NumBlackPegels + ' White: ' + gf.NumWhitePegels);
    if (gf.CorrectGuess) {
        output = '<div class="SuccessResPegel">great work</div> ';
        ReplaceElement('cmdGuessr' + row, output);

        let divReplay = document.getElementById('divReplay') as HTMLDivElement;
        divReplay.classList.remove('divReplay-hide');

        playerHasWon = true;
    } else {
        ReplaceElement('cmdGuessr' + row, output);

        if (mm.GetGuessesLeft() <= 0 && !playerHasWon) {
            let lostDiv = document.getElementById('divLost') as HTMLDivElement;
            lostDiv.classList.remove('divLost-hide');

            let divReplay = document.getElementById('divReplay') as HTMLDivElement;
            divReplay.classList.remove('divReplay-hide');
        }
    }

    let selEles = in0.parentElement.parentElement.getElementsByClassName('select-selected');
    for (let i = 0; i < selEles.length; i++) {
        selEles[i].classList.add('no-after');
    }
    //replace All Eventlisterners
    let parent = in0.parentElement.parentElement;
    parent.parentNode.replaceChild(parent.cloneNode(true), parent);
    //remove arrow
}

function OnRestart(): void {
    location.reload();
    window.location = location;
}

//UI stuff
function DropDownChnageBgToSelected(sender: HTMLSelectElement) {
    let selectedOption = sender.options[sender.selectedIndex];
    let bgcol = window.getComputedStyle(selectedOption, null).getPropertyValue('background-color');
    sender.style.background = bgcol;
}

window.onload = function() {
    /*-------------------------------------------------------------------------*/
    /*custom select*/
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName('custom-select');
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName('select')[0];
        ll = selElmnt.length;
        selElmnt.selectedIndex = 0; //reset selection on reload
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement('DIV');
        a.setAttribute('class', 'select-selected');
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement('DIV');
        b.setAttribute('class', 'select-items select-hide');
        for (j = 1; j < ll; j++) {
            /* For each option in the original select element,
    create a new DIV that will act as an option item: */
            c = document.createElement('DIV');
            c.innerHTML = selElmnt.options[j].innerHTML;
            if (j - 1 < pegelColors.length) {
                c.style.background = pegelColors[j - 1].toHex();
                selElmnt.options[j].style.background = pegelColors[j - 1].toHex();
            }
            c.addEventListener('click', function(e) {
                // When an item is clicked, update the original select box,
                //   and the selected item:
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName('select')[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (
                        s.options[i].innerHTML == this.innerHTML &&
                        s.options[i].style.background == this.style.background
                    ) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        h.style.background = this.style.background;
                        y = this.parentNode.getElementsByClassName('same-as-selected');
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute('class');
                        }
                        this.setAttribute('class', 'same-as-selected');
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener('click', function(e) {
            // When the select box is clicked, close any other select boxes,
            //and open/close the current select box:
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });
    }
};
function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
  except the current select box: */
    var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i);
        } else {
            y[i].classList.remove('select-arrow-active');
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add('select-hide');
        }
    }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener('click', closeAllSelect);
