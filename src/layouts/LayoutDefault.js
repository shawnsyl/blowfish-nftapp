import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import Particles from "react-tsparticles"

const particlesInit = (main) => {
  console.log(main)
}

const particlesLoaded = (container) => {
  console.log(container);
}

const LayoutDefault = ({ children }) => (
  <>
    <Header navPosition="right" />
      <main className="site-content">
        {children}
      </main>
    <Footer />
  </>
);

export default LayoutDefault;  