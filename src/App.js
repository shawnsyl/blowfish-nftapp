import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Battle from './views/Battle';
import Catalogue from './views/Catalogue';
import Home from './views/Home';
import Marketplace from './views/Marketplace';
import PuffVault from './views/PuffVault';

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    document.body.classList.add('is-loaded')
    childRef.current.init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
          <AppRoute exact path="/catalogue/:page/:sortBy" component={Catalogue} layout={LayoutDefault} />
          <AppRoute exact path="/puffvault" component={PuffVault} layout={LayoutDefault} />
          <AppRoute exact path="/battle" component={Battle} layout={LayoutDefault} />
          <AppRoute exact path="/marketplace" component={Marketplace} layout={LayoutDefault} />
        </Switch>
      )} />
  );
}

export default App;