import React from 'react';
// import sections
import Countdown from '../components/elements/Countdown'
import Exchange from '../components/sections/Exchange';
import Hero from '../components/sections/Hero';

const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />
      <Countdown />
      <Exchange />
    </>
  );
}

export default Home;