import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';

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
      reloadRequired
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

  const isButtonDisabled = () => {
      if (loadingData) {
          return true;
      }

      return false;
  }

  const getButtonText = () => {
      if (loadingData) {
          return 'connecting'
      }

      if (contractData) {
          if (reloadRequired) {
              return 'connect'
          }
          return 'disconnect'
      }

      return 'connect'
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
            className="list-reset header-nav-right connect-button desktop"
          >
            <li>
              <Link to="/" onClick={closeMenu}>Cryptopuffs</Link>
            </li>
          </ul>
          <ul
            className="list-reset header-nav-right connect-button mobile"
          >
            <li>
              <Link to="#0" className={buttonClasses} onClick={closeMenu}>Sign up</Link>
            </li>
          </ul>
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
                      'list-reset text-xxxs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    <li>
                      <Link to="/catalogue" onClick={closeMenu}>Catalogue</Link>
                    </li>
                    <li>
                      <Link to="#0" onClick={closeMenu}>Search</Link>
                    </li>
                    <li>
                      <Link to="#0" onClick={closeMenu}>Documentation</Link>
                    </li>
                  </ul>
                  <ul
                    className="list-reset header-nav-right connect-button desktop"
                  >
                    <li>
                      <Link to="#0" className={buttonClasses} onClick={connectWallet}>Connect</Link>
                    </li>
                  </ul>
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
