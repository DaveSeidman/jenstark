import React, { useRef, useState, useEffect } from 'react';
import mapSrc from '../../assets/images/alloy-map.png';
import './index.scss';

import map from '../../assets/images/alloy-map.png'

function Venue() {
  const venueRef = useRef();
  const [inView, setInView] = useState(false);

  const scroll = () => {
    const { top, height } = venueRef.current.getBoundingClientRect();
    setInView(innerHeight - (top + height / 2) > 0);
  }

  useEffect(() => {
    addEventListener('scroll', scroll);

    return () => {
      removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <div ref={venueRef} id="venue" className={`venue ${inView ? 'inview' : ''}`}>
      <div className='venue-body'>
        <div className="venue-body-map" onClick={() => { window.open('https://maps.app.goo.gl/SCEKdFRQ3K8WGdMs6') }} >
          <img src={mapSrc} />
          <div className="venue-body-map-drip"></div>
        </div>
        <div className="venue-body-text back-purple">
          <h2>Venue</h2>
          <p>In the heart of LA’s Arts District, a new center of energy has emerged: a multifaceted community where work, retail, and living collide. ALLOY <a href="https://alloyla.com" target="_blank">(alloyla.com)</a>, a vibrant place for creatives, artists, and seekers alike. Here, each day brings new experiences and fresh encounters with a lively pedestrian paseo that connects it all. Cascade will be the premiere experience in Alloy's most prominent placement.</p>
        </div>
      </div>
    </div>
  );
}

export default Venue;
