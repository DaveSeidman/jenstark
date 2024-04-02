import React, { useEffect, useRef, useState } from "react";
import './index.scss';
import logo from '../../assets/images/AlloyLogo.svg';
import { carousels } from '../../../config.json'

function Alloy() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const alloyRef = useRef();
  const [inView, setInView] = useState(false);

  const scroll = () => {
    const { top, height } = alloyRef.current.getBoundingClientRect();
    setInView(innerHeight - (top + height / 2) > 0);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex < carousels.alloy.length - 1 ? prevIndex + 1 : 0)
    }, 4000);
    addEventListener('scroll', scroll);

    return () => {
      clearInterval(interval)
      removeEventListener('scroll', scroll)
    }
  }, [])


  return (
    <div ref={alloyRef} id="alloy" className={`alloy ? ${inView ? 'inview' : ''}`}>
      <div className="alloy-carousel">
        {
          carousels.alloy.map((image, index) => (
            <div
              key={image}
              className={`alloy-carousel-image ${index === currentIndex ? '' : 'hidden'}`}
              style={{ backgroundImage: `url('${location.pathname}/alloy/${image}'` }}></div>
          ))
        }
      </div>
      <div className="alloy-drip"></div>
      <img className="alloy-logo" src={logo} />
    </div >
  )
}

export default Alloy;