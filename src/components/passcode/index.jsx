import React, { useRef, useState, useEffect } from 'react';
import { passcodes } from '../../../config.json'

import './index.scss';

function Passcode({ setPasscode }) {
  const passcodeRef = useRef();
  const [invalid, setInvalid] = useState(false)

  const submit = () => {
    const passcode = passcodeRef.current.value.toLowerCase();
    const passCodeIndex = Object.keys(passcodes).indexOf(passcode)

    if (passCodeIndex < 0) {
      setInvalid(true);
      setTimeout(() => {
        setInvalid(false)
      }, 3000)
      return;
    }

    setPasscode(passcodes[Object.keys(passcodes)[passCodeIndex]].name);
    if (location.search.toLocaleLowerCase().includes('clearpasscode')) {
      // location.search = '';
      history.pushState(null, '', '/');
    }
    localStorage.setItem('passcode', passcode);
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') submit();
  }


  useEffect(() => {
    const clear = location.search.toLocaleLowerCase().includes('clearpasscode')
    if (clear) return localStorage.removeItem('passcode');
    const savedCode = localStorage.getItem('passcode');
    if (!clear && savedCode) setPasscode(passcodes[savedCode].name)

  }, [])

  return (
    <div className={`passcode ${invalid ? 'invalid' : ''}`}>
      <div className='passcode-body'>
        <div className='passcode-body-form'>
          <input
            ref={passcodeRef}
            type="password"
            className='passcode-body-form-input'
            onKeyDown={keyDown}
            placeholder='passcode'
          ></input>
          <button
            type="button"
            className="passcode-body-form-submit"
            onClick={submit}
          >➜</button>
        </div>
      </div>
    </div>
  )
}


export default Passcode;