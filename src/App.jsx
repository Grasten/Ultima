import './App.scss';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [currentInput, setCurrentInput] = useState(0);
  const [backInput, setBackInput] = useState([]);
  const [history, setHistory] = useState([{}]);
  const [fontEmCount, setFontEmCount] = useState(5);
  const isAcceptableValue = (value) => ['+', '-', '%', 'B', 'C', '=', '±', '.', '×', '÷'].includes(value);
  const isSymbol = (value) => ['+', '-', '×', '÷', '%'].includes(value);
  const keyMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 0,
    '+': '+',
    '-': '-',
    '%': '%',
    '.': '.',
    '/': '÷',
    '*': '×',
    Backspace: 'B',
    Delete: 'C',
    Enter: '=',
    '=': '=',
    C: 'C',
    c: 'C',
  };

  const handleInput = (e) => handleInsert(e.target.value);
  const handleKeyInput = ({ key }) => {
    if (keyMap[key] !== undefined) return handleInsert(keyMap[key]);
  };

  const handleInsert = (initValue) => {
    const value = String(initValue);
    if (isAcceptableValue(value) || Number.isInteger(parseInt(value))) {
      if (Number.isInteger(parseInt(value))) {
        if ((currentInput[0] === '0' && value !== '.' && !currentInput.includes('.')) || currentInput === 0) {
          setCurrentInput(value);
        } else {
          setCurrentInput(`${currentInput}${value}`);
        }
      }
      if (isSymbol(value)) {
        if (
          isSymbol(backInput[backInput.length - 1]) !== value &&
          isSymbol(backInput[backInput.length - 1]) &&
          currentInput === ''
        ) {
          let tempBackInput = backInput.slice(0, backInput.length - 1);
          setBackInput([...tempBackInput, value]);
        } else {
          setBackInput([...backInput, currentInput, value]);
          setCurrentInput('');
        }
      }
      if (value === 'B') {
        let localValue = currentInput;
        let localBackInput = backInput;
        let newValue;
        if (!currentInput.length) {
          localValue = backInput[backInput.length - 2] || ' ';
          localBackInput = [...backInput.slice(0, backInput.length - 2)];
          setBackInput(localBackInput);
          newValue = localValue;
        } else {
          newValue = localValue.slice(0, localValue.length - 1);
        }

        if (newValue === '' && !localBackInput.length) {
          setCurrentInput(0);
        } else if (currentInput !== 0) {
          setCurrentInput(newValue);
        }
      }
      if (value === 'C') {
        setBackInput([]);
        setCurrentInput(0);
        setHistory([{}]);
      }
      if (value === '±') {
        setCurrentInput(eval(currentInput * -1));
      }
      if (value === '.') {
        if (String(currentInput).includes('.')) {
          return;
        } else if (currentInput !== '') {
          setCurrentInput(`${currentInput}.`);
        } else {
          setCurrentInput('0.');
        }
      }
      if (value === '=') {
        if (currentInput !== 0) {
          let formula =
            currentInput === '' ? [...backInput.slice(0, backInput.length - 1)] : [...backInput, currentInput];
          let publicFormula = [...formula];
          formula.forEach((e, index) => {
            switch (e) {
              case '×': {
                formula[index] = '*';
                break;
              }
              case '%': {
                formula[index] = '/ 100 *';
                break;
              }
              case '÷': {
                formula[index] = '/';
                break;
              }
            }
          });
          let tempHistory = { formula: `${publicFormula.join(' ')} = `, result: `${eval(formula.join(' '))}` };
          setBackInput([]);
          setCurrentInput(0);
          setHistory([...history, tempHistory]);
        }
      }
      textResize();
    }
  };

  const displayBox = useRef();
  const fontReference = useRef();
  const textResize = () => {
    const e = displayBox.current;
    const sizeReference = fontReference.current.offsetWidth;
    const containerSize = e.parentNode.offsetWidth - e.parentNode.offsetWidth / 10;
    if (e.offsetWidth < e.scrollWidth && fontEmCount > 3) {
      setFontEmCount(fontEmCount - 1);
    } else if (containerSize > sizeReference && fontEmCount < 5) {
      setFontEmCount(fontEmCount + 1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyInput);

    return () => {
      document.removeEventListener('keydown', handleKeyInput);
    };
  }, [handleKeyInput]);

  return (
    <div className="backdrop">
      <div className="title">ULTIMA</div>
      <div className="main">
        <div className="main__screen">
          <p className="main__screen__referencer" ref={fontReference} style={{ fontSize: `${fontEmCount + 1}em` }}>
            {`${backInput.join(' ')} ${currentInput}`}
          </p>
          <div className="main__screen__past">
            <p className="main__screen__past__box">
              {history[history.length - 1].formula} {history[history.length - 1].result}
            </p>
          </div>
          <div className="main__screen__current">
            <p
              className="main__screen__current__box"
              ref={displayBox}
              style={{ fontSize: `${fontEmCount}em` }}
            >{`${backInput.join(' ')} ${currentInput}`}</p>
          </div>
        </div>
        <div className="main__keypad">
          <button value="%" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            %
          </button>
          <button value="C" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            C
          </button>
          <button value="B" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            ⌫
          </button>
          <button value="÷" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            ÷
          </button>
          <button value="7" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            7
          </button>
          <button value="8" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            8
          </button>
          <button value="9" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            9
          </button>
          <button value="×" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            ×
          </button>
          <button value="4" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            4
          </button>
          <button value="5" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            5
          </button>
          <button value="6" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            6
          </button>
          <button value="-" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            -
          </button>
          <button value="1" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            1
          </button>
          <button value="2" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            2
          </button>
          <button value="3" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            3
          </button>
          <button value="+" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            +
          </button>
          <button value="±" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            ±
          </button>
          <button value="0" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            0
          </button>
          <button value="." className="main__keypad__key" onClick={(e) => handleInput(e)}>
            .
          </button>
          <button value="=" className="main__keypad__key" onClick={(e) => handleInput(e)}>
            =
          </button>
        </div>
        <div className="main__history">
          {Object.keys(history)
            .reverse()
            .map((index) => {
              if (index === '1') {
                return;
              }
              return (
                <div className="main__history__record" key={index}>
                  <p className="main__history__record__formula">{history[index].formula}</p>
                  <p className="main__history__record__result">{history[index].result}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
