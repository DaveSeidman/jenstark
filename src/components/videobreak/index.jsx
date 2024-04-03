import React from "react";

import './index.scss';


function VideoBreak() {

  return (
    <div className="videobreak">
      <video
        muted
        loop
        playsInline
        autoPlay
        src={`./videos/VideoBreak.mp4`} />
    </div>
  )
}


export default VideoBreak