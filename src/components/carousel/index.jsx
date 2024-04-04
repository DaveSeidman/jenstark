import React, { useEffect, useState, useRef } from 'react';
import './index.scss';

function Carousel({ pages, scrollPercent, scrollHint, setScrollHint, setScrollPercent, carouselPage, setCarouselPage }) {
  const pagesRef = useRef();

  // const [scrollHint, setScrollHint] = useState(false);

  const scroll = ({ target }) => {
    setScrollHint(false);
    const { scrollTop, scrollHeight } = target;
    const { height } = target.getBoundingClientRect();
    const nextScrollPercent = (scrollTop / (scrollHeight - height));
    setScrollPercent(nextScrollPercent);
  };

  const scrollToTop = () => {
    pagesRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const scrollToFirstPage = () => {
    setCarouselPage(1);
    setTimeout(() => {
      setCarouselPage(0);
    })
  }

  useEffect(() => {
    pagesRef.current.children[carouselPage].scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [carouselPage])

  useEffect(() => {
    scrollToTop();
  }, [])

  return (
    <div className="carousel">
      <div
        ref={pagesRef}
        className="carousel-pages"
        onScroll={scroll}
      >
        {
          pages.map((page) => {
            return (
              <div
                key={page.slug}
                className="carousel-pages-page"
                style={{
                  // height: `${page.pathLength * 100}vh`
                  height: '300vh'
                }}
              >
              </div>
            );
          })
        }
      </div>
      {/* <div className={`carousel-start ${scrollPercent < .01 ? '' : 'hidden'}`}>
        <button onClick={scrollToFirstPage}>Click to Enter</button>
      </div> */}
      <div className={`carousel-hint ${scrollHint ? '' : 'hidden'}`}>
        Scroll To Continue
      </div>
      <div className={`carousel-restart ${scrollPercent > .99 ? '' : 'hidden'}`}>
        <button onClick={scrollToTop}>Return to Lounge</button>
      </div>
    </div>
  );
}

export default Carousel;
