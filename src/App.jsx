import React, { useRef, useState } from 'react';
import './index.scss';
import { pages } from '../config.json';
import Scene from './components/scene';
// import Restart from './components/restart';
import Carousel from './components/carousel';
import Progress from './components/progress';
import Nav from './components/nav';
import Experience from './components/experience';
import Artist from './components/artist';
import Venue from './components/venue';
import Opportunities from './components/opportunities';
import VideoCover from './components/videocover';
import VideoBreak from './components/videobreak';
import Alloy from './components/alloy';
import Passcode from './components/passcode';
import icon2D from './assets/images/2d.svg';
import icon3D from './assets/images/3d.svg';
import downArrow from './assets/images/arrow.svg'
import { version } from '../package.json';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [overview, setOverview] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);
  const [passcode, setPasscode] = useState(null);
  const [triggerPlayback, setTriggerPlayback] = useState(false);
  const lookAhead = 0.005;

  const clicked = () => {
    setTriggerPlayback(true);
    setTimeout(() => {
      setTriggerPlayback(false);
    })
  }

  return (
    <div
      className={`app ${passcode ? '' : 'locked'}`}
      onClick={clicked}
    >
      <Scene
        overview={overview}
        scrollPercent={scrollPercent}
        lookAhead={lookAhead}
        setLoaded={setLoaded}
        triggerPlayback={triggerPlayback}
      ></Scene>
      <Carousel
        lookAhead={lookAhead}
        scrollPercent={scrollPercent}
        setScrollPercent={setScrollPercent}
        carouselPage={carouselPage}
        setCarouselPage={setCarouselPage}
        pages={pages}
      />
      <button
        type="button"
        className="map"
        onClick={() => { setOverview((prevOverview) => !prevOverview); }}
      ><img src={overview ? icon3D : icon2D} /></button>
      <Progress
        scrollPercent={scrollPercent}
        setScrollPercent={setScrollPercent}
        setCarouselPage={setCarouselPage}
      ></Progress>
      <a className="scrollHint" href="#nav"><img src={downArrow} />More Below<img src={downArrow} /></a>
      <Nav />
      <Experience />
      <Artist />
      <VideoBreak />
      <Alloy />
      <Venue />
      <Opportunities />
      <VideoCover loaded={loaded} />
      {!passcode && (<Passcode setPasscode={setPasscode} />)}
      < p className="version">{`version: ${version} | ${passcode}`}</p>
    </div >
  );
}

export default App;
