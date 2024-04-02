import React, { useState } from "react"
import './index.scss';

function VideoCover({ loaded }) {
  const [show, setShow] = useState(true);
  return (
    <div className={`videocover ${show ? '' : 'hidden'}`}
      onClick={() => {
        setShow(false)
      }}
    >
      <video
        playsInline
        muted
        autoPlay
        loop
        src={`${location.pathname}/VideoCover.mp4`}
      />
      <div className={`videocover-title ${loaded ? '' : 'hidden'}`}>
        <h1>CLICK &nbsp; TO &nbsp; ENTER &nbsp; CASCADE</h1>
        <p>Los Angeles</p>
      </div>
    </div>
  )
}

export default VideoCover