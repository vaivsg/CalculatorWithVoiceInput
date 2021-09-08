'use strict';

const historyValue = document.getElementById('history-value');
const outputValue = document.getElementById('output-value');
const operator = document.getElementsByClassName('operator');
const number = document.getElementsByClassName('number');
const microphone = document.getElementById('microphone');

const getHistory = () => historyValue.innerText;
const printHistory = num => (historyValue.innerText = num);
const getOutput = () => outputValue.innerText;
const printOutput = num => {
  num === ''
    ? (outputValue.innerText = num)
    : (outputValue.innerText = getFormattedNumber(num));
};
const getFormattedNumber = num => {
  if (num == '-') return '';
  return +num.toLocaleString('en');
};
const reverseNumberFormat = num => +num.replace(/,/g, '');

[...operator].forEach(ops => {
  ops.addEventListener('click', function () {
    if (this.id == 'clear') {
      printHistory('');
      printOutput('');
    } else if (this.id == 'backspace') {
      let output = reverseNumberFormat(getOutput()).toString();
      if (output) {
        //if output has a value
        output = output.substr(0, output.length - 1);
        printOutput(output);
      }
    } else {
      let output = getOutput();
      let history = getHistory();
      if (output == '' && history != '') {
        if (isNaN(history[history.length - 1])) {
          history = history.substr(0, history.length - 1);
        }
      }
      if (output != '' || history != '') {
        output = output == '' ? output : reverseNumberFormat(output);
        history = history + output;
        if (this.id == '=') {
          const result = eval(history);
          printOutput(result);
          printHistory('');
        } else {
          history = history + this.id;
          printHistory(history);
          printOutput('');
        }
      }
    }
  });
});

[...number].forEach(mov => {
  mov.addEventListener('click', function () {
    let output = reverseNumberFormat(getOutput());
    if (output != NaN) {
      //if output is a number
      output = output + this.id;
      printOutput(output);
    }
  });
});

microphone.onclick = function () {
  microphone.classList.add('record');
  var SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.start();
  recognition.onspeechend = function () {
    setTimeout(function () {
      recognition.stop();
    }, 1000);
  };

  const operations = {
    plus: '+',
    minus: '-',
    multiply: '*',
    multiplied: '*',
    into: '*',
    divide: '/',
    divided: '/',
    reminder: '%',
    mod: '%',
    x: '*',
  };
  recognition.onresult = function (event) {
    let input = event.results[0][0].transcript;

    console.log(input);

    for (let property in operations) {
      input = input.replace(property, operations[property]);
    }

    outputValue.innerText = input;

    setTimeout(function () {
      evaluate(input);
    }, 2000);

    microphone.classList.remove('record');
  };
};
const evaluate = input => {
  try {
    const result = eval(input);
    console.log(result);
    outputValue.innerText = result;
  } catch (err) {
    console.error(err);
    alert(`Voice not identified. Try again. 🙄`);
    document.getElementById('output-value').innerText = '';
  }
};
