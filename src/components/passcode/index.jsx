import React, { useRef } from 'react';
import { passcodes } from '../../../config.json'

import './index.scss';

function Passcode({ setPasscode }) {

  const passcodeRef = useRef();

  const submit = () => {
    const passCodeIndex = Object.keys(passcodes).indexOf(passcodeRef.current.value)
    if (passCodeIndex >= 0) {
      setPasscode(passcodes[Object.keys(passcodes)[passCodeIndex]].name)
    }
  }

  const keyDown = (e) => {
    if (e.key === 'Enter') submit();
  }

  return (
    <div className='passcode'>
      <input
        ref={passcodeRef}
        type="text"
        onKeyDown={keyDown}
        placeholder='passcode'
      ></input>
      <button
        type="button"
        className="passcode-submit"
        onClick={submit}
      >➜</button>
    </div>
  )
}


export default Passcode;