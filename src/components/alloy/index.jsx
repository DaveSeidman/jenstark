import React, { useEffect, useState } from "react";
import './index.scss';
import logo from '../../assets/images/AlloyLogo.svg';
import { carousels } from '../../../config.json'

function Alloy() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex < carousels.alloy.length - 1 ? prevIndex + 1 : 0)
    }, 4000);

    return () => {
      clearInterval(interval)
    }
  }, [])


  return (
    <div id="alloy" className="alloy">
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

      <img className="alloy-logo" src={logo} />
    </div >
  )
}

export default Alloy;