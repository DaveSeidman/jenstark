import React, { useRef } from "react";
import './index.scss';
import { pages } from '../../../config.json'


function Progress({ scrollPercent, setCarouselPage }) {
  const labelsRef = useRef();

  let activeIndex = 0;
  const totalPercent = (scrollPercent % 1) * 100;
  let betweenPercent = 0;
  let progressBarWidth = 0;
  for (let i = 0; i < pages.length; i += 1) {
    if (pages[i].percent > totalPercent) {
      activeIndex = i - 1;
      const range = pages[i].percent - pages[i - 1].percent;
      const offset = totalPercent - pages[i - 1].percent;
      betweenPercent = offset / range;
      // console.log(`active index is ${i}, totalPercent: ${totalPercent}`, pages[i - 1].percent, pages[i].percent, betweenPercent);
      break;
    }
  }

  if (labelsRef.current) {
    const left1 = (activeIndex / pages.length) * innerWidth;
    const left2 = ((activeIndex + 1) / pages.length) * innerWidth;
    progressBarWidth = left1 + ((left2 - left1) * betweenPercent);
  }

  return (
    <div className="progress">
      <div className="debug">{Math.round(100 * (scrollPercent % 1))}</div>
      <div className="progress-bar"
        style={{ width: `${progressBarWidth}px` }}
      ></div>
      <div
        className="progress-labels"
        ref={labelsRef}
      >
        {pages.map((page, index) => (<span
          key={page.slug}
          onClick={() => { setCarouselPage(index); }}
          className={`progress-labels-label ${activeIndex === index ? 'active' : ''}`}
        // style={{ left: `${page.percent * 100}%` }}
        >{page.title}</span>)
        )}
      </div>
    </div>
  )
}


export default Progress;