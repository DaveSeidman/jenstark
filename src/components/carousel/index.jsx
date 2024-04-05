import React, { useEffect, useState, useRef } from 'react';
import './index.scss';

function Carousel({ jump, setJump, setReturnToLounge, pages, scrollPercent, scrollHint, setScrollHint, setScrollPercent, carouselPage, setCarouselPage }) {
  const pagesRef = useRef();
  const prevCarouselPage = useRef();
  const [continueHint, setContinueHint] = useState(false);
  const pointer = useRef({ down: false })

  const scroll2 = (e) => {
    // console.log(e)
    e.preventDefault();
    e.stopPropagation();

    // console.log(e.deltaY / 100);
    setScrollPercent((prevScrollPercent) => {
      let nextScrollPercent = prevScrollPercent + (e.deltaY / -20000);
      // if (nextScrollPercent > 1) nextScrollPercent -= 1;
      // if (nextScrollPercent < 0) nextScrollPercent += 1;

      return nextScrollPercent;
    })
    // console.log(scrollPercent)
  }

  useEffect(() => {
    console.log(carouselPage, scrollPercent);
    setScrollPercent((prevScrollPercent) => prevScrollPercent + (pages[carouselPage].percent / 10))
    // console.log(prevCarouselPage.current, carouselPage, pagesRef.current.children.length)
    // pagesRef.current.children[carouselPage].scrollIntoView({
    //   behavior: prevCarouselPage.current === 10 ? 'instant' : 'smooth',
    //   block: 'end',
    // });

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
      // console.log(e.clientY)
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
    }
  }

  useEffect(() => {
    // scrollToTop();
    // pagesRef.current.addEventListener('scroll', scroll2);
    pagesRef.current.addEventListener('mousewheel', scroll2);
    addEventListener('pointerdown', pointerdown);
    addEventListener('pointermove', pointermove);
    addEventListener('pointerup', pointerup);


    return (() => {
      // pagesRef.current.removeEventListener('scroll', scroll2);
      pagesRef.current.removeEventListener('mousewheel', scroll2);
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
        {/* {
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
        } */}
      </div>
      {/* <div className={`carousel-start ${scrollPercent < .01 ? '' : 'hidden'}`}>
        <button onClick={scrollToFirstPage}>Click to Enter</button>
      </div> */}
      <div className={`scroll-hint ${scrollHint ? '' : 'hidden'}`}>
        Scroll To Continue
      </div>
      <div className={`continue-hint ${continueHint ? '' : 'hidden'}`}>
        Continue Below
      </div>
      {/* <div className={`carousel-restart ${scrollPercent > .99 ? '' : 'hidden'}`}>
        <button onClick={() => {
          setJump(true);
          setCarouselPage(0);
          setTimeout(() => {
            setJump(false);
          })
        }}>Continue Exploring</button>
        <a href="#nav"><button>Read More</button></a>
      </div> */}
    </div>
  );
}

export default Carousel;
