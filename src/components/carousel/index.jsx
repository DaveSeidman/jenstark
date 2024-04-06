import React, { useEffect, useState, useRef } from 'react';
import './index.scss';

function Carousel({ pages, scrollHint, setScrollHint, scrollPercent, setScrollPercent, carouselPage, setCarouselPage }) {
  const pagesRef = useRef();
  const prevCarouselPage = useRef();
  const [continueHint, setContinueHint] = useState(false);
  const pointer = useRef({ down: false })

  const scroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollPercent((prevScrollPercent) => {
      let nextScrollPercent = prevScrollPercent + (e.deltaY / -20000);
      return nextScrollPercent;
    })
    setScrollHint(false);
  }

  useEffect(() => {
    setScrollPercent((prevScrollPercent) => prevScrollPercent + (pages[carouselPage].percent / 10))
    prevCarouselPage.current = carouselPage;
  }, [carouselPage])


  const pointerdown = (e) => {
    pointer.current.down = true;
    pointer.current.x = e.clientX;
    pointer.current.y = e.clientY;
  }

  const pointerup = () => {
    pointer.current.down = false;
  }

  const pointermove = (e) => {
    if (pointer.current.down) {
      if (pointer.current.x) {
        const offset = {
          x: e.clientX - pointer.current.x,
          y: e.clientY - pointer.current.y
        }

        setScrollPercent((prevScrollPercent) => {
          let nextScrollPercent = prevScrollPercent + (offset.y / 4000);
          return nextScrollPercent;
        })
      }
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      setScrollHint(false);
    }
  }

  useEffect(() => {
    pagesRef.current.addEventListener('mousewheel', scroll);
    addEventListener('pointerdown', pointerdown);
    addEventListener('pointermove', pointermove);
    addEventListener('pointerup', pointerup);


    return (() => {
      pagesRef.current.removeEventListener('mousewheel', scroll);
      removeEventListener('pointerdown', pointerdown);
      removeEventListener('pointermove', pointermove);
      removeEventListener('pointerup', pointerup);
    })
  }, [])

  return (
    <div className="carousel">
      <div
        ref={pagesRef}
        className="carousel-pages"
        onScroll={scroll}
      >
      </div>
      <div className={`scroll-hint ${scrollHint ? '' : 'hidden'}`}>
        Scroll To Continue
      </div>
      <div className={`continue-hint ${continueHint ? '' : 'hidden'}`}>
        Continue Below
      </div>
    </div>
  );
}

export default Carousel;
