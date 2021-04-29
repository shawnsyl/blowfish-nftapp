import React, { useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views 
import Battle from './views/Battle';
import Catalogue from './views/Catalogue';
import Construction from './views/Construction';
import Home from './views/Home';
import Purchase from './views/Purchase';
import Marketplace from './views/Marketplace';
import PuffVault from './views/PuffVault';
import PuffView from './views/PuffView';

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
          <AppRoute exact path="/catalog/:page/:sortBy" component={Construction} layout={LayoutDefault} />
          <AppRoute exact path="/puffvault" component={Construction} layout={LayoutDefault} />
          <AppRoute exact path="/purchase" component={Construction} layout={LayoutDefault} />
          <AppRoute exact path="/battle" component={Construction} layout={LayoutDefault} />
          <AppRoute exact path="/marketplace" component={Construction} layout={LayoutDefault} />
          <AppRoute exact path="/puff/:puffId" component={Construction} layout={LayoutDefault} />
        </Switch>
      )} />
  );
}

export default App;