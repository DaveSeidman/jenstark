import React, { useRef, useState, useEffect } from 'react';
import instagramIcon from '../../assets/images/socials-instagram.svg'
import twitterIcon from '../../assets/images/socials-twitter.svg'
import tikTokIcon from '../../assets/images/socials-tiktok.svg'
import './index.scss';

function Artist() {
  const socialsRef = useRef();
  const [showMandala, setShowMandala] = useState(false);

  const scroll = () => {
    const { top, height } = socialsRef.current.getBoundingClientRect();
    setShowMandala(innerHeight - (top + height / 2) > 0);
  }

  useEffect(() => {
    addEventListener('scroll', scroll);

    return () => {
      removeEventListener('scroll', scroll)
    }
  }, [])


  return (
    <div id="artist" className="artist">
      <div className="artist-body">
        <div className="artist-body-left">
          <div className="artist-body-left-photo"></div>
          <div ref={socialsRef} className="artist-body-left-socials">
            <div className={`artist-body-left-socials-background ${showMandala ? 'active' : ''}`}></div>
            <h1 className="artist-body-left-socials-title">SOCIALS</h1>
            <div className={`artist-body-left-socials-icons ${showMandala ? 'active' : ''}`}>
              <a href="http://instagram.com/jenstark" target="_blank"><img src={instagramIcon} /></a>
              <a href="http://twitter.com/jen_stark" target="_blank"><img src={twitterIcon} /></a>
              <a href="http://tiktok.com/@jenstark" target="_blank"><img src={tikTokIcon} /></a>
            </div>
          </div>
        </div>
        <div className="artist-body-right">
          <h2>Artist</h2>
          <p>Jen Stark’s art is driven by her interest in conceptualizing visual systems to simulate plant growth, evolution, infinity, fractals, mimetic topographies, and sacred geometries. Using available materials—paper, wood, metal, paint—Stark strives to make work that balances on a razor’s edge of optical seduction and perceptual engagement. In recent years, Stark has introduced new technologies into her diverse practice, delving into the digital realm of interactive projections and distinctive NFTs.</p>
          <p>The resulting works often resemble organic, molecular, cloud-like structures, and are imbued with kinetic, undulating effects that serve to dislocate the viewer from staid reality into an immersive ecosphere of echoing patterns and the implausible designs found in nature. Even her vivid colors are in direct conversation with the natural world; the attractant/ repellent properties of flowers encouraging pollination or insects warning birds of their poisonous traits, and the luminous mystery of phosphorescent sea creatures are among Stark's inspirations.</p>
          <p>Go to <a href="https://jenstark.com" target="_blank">JENSTARK.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Artist;
