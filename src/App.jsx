import './App.scss';
import { useEffect, useRef, useState } from 'react';

function App() {
  const displayBox = useRef();
  const focusTarget = useRef();
  const fontReference = useRef();
  const secretBase = useRef();
  5;

  const [currentInput, setCurrentInput] = useState(0);
  const [backInput, setBackInput] = useState([]);
  const [history, setHistory] = useState([{}]);
  const [fontEmCount, setFontEmCount] = useState(5);
  const [superSecret, setSuperSecret] = useState('');
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
          localValue = backInput[backInput.length - 2] || 0;
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
          const tempHistory = { formula: `${publicFormula.join(' ')} = `, result: `${eval(formula.join(' '))}` };
          setBackInput([]);
          setCurrentInput(0);
          if (history[0].formula) {
            setHistory([...history, tempHistory]);
          } else {
            console.log(tempHistory);
            setHistory([tempHistory]);
          }
        }
      }
      textResize();
    }
    setTimeout(() => focusTarget.current.focus(), 10);
  };

  const handleInput = (e) => handleInsert(e.target.value);
  const handleKeyInput = ({ key }) => {
    if (keyMap[key] !== undefined) return handleInsert(keyMap[key]);
    setSuperSecret(`${superSecret}${key}`);
  };

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
  useEffect(() => {
    let e = secretBase.current;
    if (superSecret.slice(superSecret.length - 11, superSecret.length) === 'thekomakoma') {
      renderSecret('uBMcdIXePE0');
    }
    if (superSecret.slice(superSecret.length - 5, superSecret.length) === 'monke') {
      renderSecret('AGvy8ZR7xPo');
    }
    if (superSecret.slice(superSecret.length - 6, superSecret.length) === 'floppa') {
      renderSecret('zSZ2ay7VxPg');
    }
    return () => {
      e.style.display = 'none';
      e.children[0].innerHTML = '';
    };
  }, [superSecret]);
  const renderSecret = (url) => {
    let e = secretBase.current;
    e.children[0].innerHTML = '<iframe width="100%" height="100%" allow="autoplay" />';
    e.children[0].children[0].src = `https://www.youtube.com/embed/${url}?autoplay=1`;
    e.style.display = 'flex';
  };

  return (
    <div className="backdrop">
      <button className="focus_target" ref={focusTarget} />
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
              if (index === (history.length - 1).toString()) {
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
      <div className="secret" ref={secretBase} onClick={() => setSuperSecret('')}>
        <div className="secret__box" />
      </div>
    </div>
  );
}

export default App;
