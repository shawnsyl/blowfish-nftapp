import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';

import { Button, Label } from 'semantic-ui-react';

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext'

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool
}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {

  const [isActive, setIsactive] = useState(false);

  const nav = useRef(null);
  const hamburger = useRef(null);

  const {
      connectWallet,
      disconnectWallet,
      contractData,
      loadingData,
      reloadRequired,
      tokenInst
  } = useContractDataContext();

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('click', clickOutside);
      closeMenu();
    };
  });  

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
    setIsactive(true);
  }

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  }

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  }

  const clickOutside = (e) => {
    if (!nav.current) return
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  } 

  const getButtonText = () => {
      if (loadingData) {
          return 'CONNECTING'
      }

      if (tokenInst) {
          if (reloadRequired) {
              return 'CONNECT'
          }
          return 'DISCONNECT'
      }

      return 'CONNECT'
  }

  const classes = classNames(
    'site-header',
    bottomOuterDivider && 'has-bottom-divider',
    className
  );

  const buttonClasses = classNames(
    'button',
    'button-primary',
    'button-wide-mobile',
    'button-sm',
    'text-xxxs',
    loadingData && 'button-disabled'
  )

  const connectButton = (type = 'desktop') => {
    return (
      <div className={`list-reset header-nav-right connect-button text-xs ${type}` }>
        <Button className='button-primary' disabled={loadingData} onClick={connectWallet}>{getButtonText()}</Button>
        {reloadRequired ? (
              <div className='navbar-warningMessage'>
                  <input type='hidden'/>
                  <Label pointing>Make sure your wallet is on the BSC network</Label>
              </div>
        ) : null}
      </div>
    )
  }

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            'site-header-inner',
            bottomDivider && 'has-bottom-divider'
          )}>
          <Logo />
          <ul
            className="list-reset header-nav-right connect-button desktop site-title"
          >
            <li>
              <Link to="/" onClick={closeMenu}>Cryptopuffs</Link>
            </li>
          </ul>
          {connectButton('mobile')}
          {!hideNav &&
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    'header-nav',
                    isActive && 'is-active'
                  )}>
                <div className="header-nav-inner">
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    <li>
                      <Link to="/catalogue" onClick={closeMenu}>Catalogue</Link>
                    </li>
                    <li>
                      <Link to="/marketplace" onClick={closeMenu}>Marketplace</Link>
                    </li>
                    <li>
                      <Link to="/battle" onClick={closeMenu}>Enhance & Battle</Link>
                    </li>
                    {getButtonText() === 'DISCONNECT' ? (
                      <li>
                        <Link to="/puffvault" onClick={closeMenu}>Puff Vault</Link>
                      </li> 
                    ) : null}
                  </ul>
                  {connectButton()}
                </div>
              </nav>
            </>}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
