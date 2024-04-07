// The main driver for the TourCamera, sets up a fake scrolling mechanism
// that also responds to pointer movement (drag)


import React, { useEffect, useState, useRef } from 'react';
import './index.scss';

function Carousel({ startPercent, setCamRotation, pages, scrollHint, setScrollHint, setScrollPercent, carouselPage, loopedScene, setLoopedScene }) {
  const pagesRef = useRef();
  const prevCarouselPage = useRef();
  const pointer = useRef({ x: 0, y: 0, down: false })
  const prevPointer = useRef({ x: 0, y: 0 })

  const scroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollPercent((prevScrollPercent) => {
      let nextScrollPercent = prevScrollPercent + (e.deltaY / 20000);
      // TODO: this should be the correct method but causes a bounce in the TourCamera
      // so instead we're setting the initial scroll percent high
      // if (nextScrollPercent <= 0) nextScrollPercent += 1;
      if (!loopedScene) {
        if (Math.abs(nextScrollPercent - startPercent) > 1) {
          setLoopedScene(true);
        }
      }
      return nextScrollPercent;
    })

    setCamRotation(0);
    setScrollHint(false);
  }

  const pointerdown = (e) => {
    pointer.current.down = true;
    pointer.current.x = e.clientX;
    pointer.current.y = e.clientY;
    prevPointer.current.x = e.clientX;
    prevPointer.current.y = e.clientY;
  }

  const pointerup = () => {
    pointer.current.down = false;
    if (
      (Math.abs(pointer.current.x - prevPointer.current.x) < .1) &&
      (Math.abs(pointer.current.y - prevPointer.current.y) < .1)
    ) {
      setScrollPercent((prevScrollPercent) => {
        const nextScrollPercent = prevScrollPercent + .05
        // TODO: DRY:
        if (!loopedScene) {
          if (Math.abs(nextScrollPercent - startPercent) > 1) {
            setLoopedScene(true);
          }
        }
        return nextScrollPercent
      });
      setCamRotation(0);
    }
  }

  const pointermove = (e) => {
    if (pointer.current.down) {
      if (pointer.current.x) {
        const offset = {
          x: e.clientX - pointer.current.x,
          y: e.clientY - pointer.current.y
        }
        setCamRotation((prevCamRotation) =>
          Math.abs(offset.y) > 10 ? 0 : prevCamRotation + (offset.x / 400)
        );

        setScrollPercent((prevScrollPercent) => {
          let nextScrollPercent = prevScrollPercent + (-offset.y / 4000);
          if (!loopedScene) {
            if (Math.abs(nextScrollPercent - startPercent) > 1) {
              setLoopedScene(true);
            }
          }
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
    pagesRef.current.addEventListener('pointerdown', pointerdown);
    pagesRef.current.addEventListener('pointermove', pointermove);
    pagesRef.current.addEventListener('pointerup', pointerup);

    return (() => {
      pagesRef.current.removeEventListener('mousewheel', scroll);
      pagesRef.current.removeEventListener('pointerdown', pointerdown);
      pagesRef.current.removeEventListener('pointermove', pointermove);
      pagesRef.current.removeEventListener('pointerup', pointerup);
    })
  }, [])

  // TODO: fix this
  useEffect(() => {
    setScrollPercent((prevScrollPercent) => (Math.floor(prevScrollPercent) + (pages[carouselPage].percent + 1) / 100))
  }, [carouselPage])


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
