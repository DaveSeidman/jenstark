import React from "react";
import './index.scss';
import { pages } from '../../../config.json'

function Progress({ scrollPercent, setScrollPercent, setCarouselPage }) {

  let activeIndex = 0;
  let closestAmount = Number.POSITIVE_INFINITY;
  pages.forEach((page, index) => {
    if (page.visible) {
      const disatnceToPercent = Math.abs((scrollPercent % 1) - (1 - page.percentAlongTour))
      if (disatnceToPercent < closestAmount) {
        closestAmount = disatnceToPercent
        activeIndex = index
      }
    }
  })

  return (
    <div className="progress">
      <div className="progress-bar"
        style={{ width: `${scrollPercent * 100}%` }}
      ></div>
      <div className="progress-labels">
        {pages.map((page, index) => (
          page.visible && (<span
            key={page.slug}
            onClick={() => {
              // setScrollPercent(page.percent);
              setCarouselPage(index);
            }}
            className={`progress-labels-label ${activeIndex === index ? 'active' : ''}`}
          // style={{ left: `${page.percentAlongTour * 100}%` }}
          >{page.title}</span>)
        ))}
      </div>
    </div>
  )
}


export default Progress;