import React, { useEffect, useRef, useState } from 'react';
import drip1Image from '../../assets/images/drip1.png'
import './index.scss';

function Experience() {
  const experienceRef = useRef();
  const [inView, setInView] = useState(false);

  const scroll = () => {
    const { top, height } = experienceRef.current.getBoundingClientRect();
    setInView(innerHeight - (top + height / 2) > 0);
  }

  useEffect(() => {
    addEventListener('scroll', scroll);

    return () => {
      removeEventListener('scroll', scroll)
    }
  }, [])

  return (
    <div ref={experienceRef} id="experience" className={`experience ${inView ? 'inview' : ''}`}>
      <div className="experience-drip"></div>
      <div className="experience-body">
        <h2>Experience</h2>
        <p>Building on the success of its 2021 debut in New York, CASCADE will unveil its next edition in LA's Arts District in fall 2024, housed in the brand-new, cutting-edge Alloy building. This initiative, a collaboration between visual artist Jen Stark and New York gallerist Josh Liner, will immerse attendees in Stark's celebrated interactive artwork.</p>
        <p>Visitors will flow through enchanting interactive spaces filled with Stark’s signature colorful light, movement, and sound. The LA edition will level up the Cascade program as a unique immersive experience for all ages.</p>
        <p>Cascade offers a unique blend of meaningful marketing and merchandising opportunities through distinct engagement channels. These culminate in a lounge and gift shop featuring Stark's exclusive collaborations.</p>
      </div>
    </div>
  );
}

export default Experience;
