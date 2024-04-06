import React, { useEffect, useState, useRef } from 'react';
import './index.scss';

function Carousel({ setCamRotation, pages, scrollHint, setScrollHint, scrollPercent, setScrollPercent, carouselPage, setCarouselPage }) {
  const pagesRef = useRef();
  const prevCarouselPage = useRef();
  const pointer = useRef({ down: false })

  const scroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollPercent((prevScrollPercent) => {
      let nextScrollPercent = prevScrollPercent + (e.deltaY / -20000);
      // TODO: this should be the correct method but causes a bounce in the TourCamera
      // so instead we're setting the initial scroll percent high
      // if (nextScrollPercent <= 0) nextScrollPercent += 1;
      return nextScrollPercent;
    })
    setScrollHint(false);
  }

  // TODO: fix this
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
        setCamRotation((prevCamRotation) =>
          Math.abs(offset.y) > 5 ? 0 : prevCamRotation + (offset.x / 400)
        );

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
    </div>
  );
}

export default Carousel;
