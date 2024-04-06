import React, { useRef, useState, useEffect } from 'react';
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
  const startPercent = 100.00;
  const [loaded, setLoaded] = useState(false);
  const [overview, setOverview] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(startPercent);
  const [camRotation, setCamRotation] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);
  const [passcode, setPasscode] = useState(null);
  const [triggerPlayback, setTriggerPlayback] = useState(false);
  const [scrollHint, setScrollHint] = useState(false);
  const [amountLoaded, setAmountLoaded] = useState(0)
  const [returnToLounge, setReturnToLounge] = useState(false);
  const [scrolledPage, setScrolledPage] = useState(false);
  const [loopedScene, setLoopedScene] = useState(false);
  const lookAhead = 0.001;
  const appRef = useRef();
  const fontSize = 14;
  const continueHeight = fontSize * 5;

  const clicked = () => {
    setTriggerPlayback(true);
    setTimeout(() => {
      setTriggerPlayback(false);
    })
  }

  const scroll = () => {
    if (scrolledPage) return;
    const scrollposition = -appRef.current.getBoundingClientRect().top;
    const navInViewPosition = (innerHeight - continueHeight) / 2;
    const navInView = scrollposition > navInViewPosition;
    if (navInView) setScrolledPage(true);
  }

  useEffect(() => {
    addEventListener('scroll', scroll);

    return () => {
      removeEventListener('scroll', scroll);
    }
  })

  return (
    <div
      ref={appRef}
      className={`app ${passcode ? '' : 'locked'}`}
      onClick={clicked}
    >
      <Scene
        startPercent={startPercent}
        overview={overview}
        scrollPercent={scrollPercent}
        lookAhead={lookAhead}
        setLoaded={setLoaded}
        triggerPlayback={triggerPlayback}
        setAmountLoaded={setAmountLoaded}
        returnToLounge={returnToLounge}
        setReturnToLounge={setReturnToLounge}
        camRotation={camRotation}
      ></Scene>
      <Carousel
        startPercent={startPercent}
        lookAhead={lookAhead}
        scrollPercent={scrollPercent}
        setScrollPercent={setScrollPercent}
        carouselPage={carouselPage}
        setCarouselPage={setCarouselPage}
        scrollHint={scrollHint}
        setScrollHint={setScrollHint}
        scrolledPage={setScrolledPage}
        setCamRotation={setCamRotation}
        loopedScene={loopedScene}
        setLoopedScene={setLoopedScene}
        pages={pages}
      />
      <button
        type="button"
        className="map"
        onClick={() => { setOverview((prevOverview) => !prevOverview); }}
      ><img src={overview ? icon3D : icon2D} /></button>
      <Progress
        scrollPercent={scrollPercent}
        // setScrollPercent={setScrollPercent}
        setCarouselPage={setCarouselPage}
      ></Progress>
      <a href="#nav"><div className={`continue ${!scrolledPage && loopedScene ? 'shake' : ''}`}><img src={downArrow} />Continue Below<img src={downArrow} /></div></a>
      <Nav />
      <Experience />
      <Artist />
      <VideoBreak />
      <Alloy />
      <Venue />
      <Opportunities />
      <VideoCover loaded={loaded} setScrollHint={setScrollHint} />
      {amountLoaded < 100 && (<div className="preload">
        <h1>{`Loading... ${Math.round(amountLoaded)}%`}</h1>
      </div>)}
      {!passcode && (<Passcode setPasscode={setPasscode} />)}
      < p className="version">{`version: ${version} | ${passcode}`}</p>
    </div >
  );
}

export default App;
