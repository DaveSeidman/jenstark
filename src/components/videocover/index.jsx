import React, { useState } from "react"
import './index.scss';

function VideoCover({ loaded, setScrollHint, setTriggerPlayback }) {
  const [show, setShow] = useState(true);
  return (
    <div className={`videocover ${show ? '' : 'hidden'}`}
      onClick={() => {
        console.log('clicked video cover')
        setShow(false)
        setScrollHint(true);
        setTriggerPlayback(true);
        setTimeout(() => {
          setTriggerPlayback(false);
        })
      }}
    >
      <video
        playsInline
        muted
        autoPlay
        loop
        src={`./videos/VideoCover.mp4`}
      />
      <div className={`videocover-title ${loaded ? '' : 'hidden'}`}>
        <h1>click to enter cascade</h1>
        <p>Los Angeles</p>
      </div>
    </div>
  )
}

export default VideoCover