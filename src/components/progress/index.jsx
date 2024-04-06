import React from "react";
import './index.scss';
import { pages } from '../../../config.json'
console.log(pages)
function Progress({ scrollPercent, setCarouselPage }) {

  let activeIndex = 0;
  let closestAmount = Number.POSITIVE_INFINITY;
  pages.forEach((page, index) => {
    const dist = Math.abs((scrollPercent % 1) - (page.percent))
    if (dist < closestAmount) {
      closestAmount = dist
      activeIndex = index
    }
  })

  return (
    <div className="progress">
      <div className="progress-bar"
        style={{ width: `${scrollPercent * 100}%` }}
      ></div>
      <div className="progress-labels">
        {pages.map((page, index) => (<span
          key={page.slug}
          onClick={() => {
            // setScrollPercent(page.percent);
            setCarouselPage(index);
          }}
          className={`progress-labels-label ${activeIndex === index ? 'active' : ''}`}
        // style={{ left: `${page.percent * 100}%` }}
        >{page.title}</span>)
        )}
      </div>
    </div>
  )
}


export default Progress;