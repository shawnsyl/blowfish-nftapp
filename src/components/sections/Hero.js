import React from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Image from '../elements/Image';

import {
    Button,
    Container,
    Loader,
} from 'semantic-ui-react'

import bCool from '../../assets/images/b_cool.png'
import bDark from '../../assets/images/b_dark.png'
import bFancy from '../../assets/images/b_fancy.png'
import bGreen from '../../assets/images/b_green.png'
import bPurple from '../../assets/images/b_purple.png'
import bShark from '../../assets/images/b_shark.png'
import dSpace from '../../assets/images/b_space.png'
import dInject from '../../assets/images/d_inject.png'
import logo from '../../assets/images/puff_logo.png'
import crate from '../../assets/images/crate.png'

import './Hero.css';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <>
    {/* <img src={lightRay1} alt="light" class="hero-light hero-light1" />
    <img src={lightRay2} alt="light" class="hero-light hero-light2" /> */}
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <Image src={logo} width={1000}/>
            <h2 className="mt-24 mb-24" data-reveal-delay="200">
              Collect them, auction them, battle them!<br></br>
              Lock BNB-BLOWF To Get Crates
            </h2>
            <div className="divpadding">
                <Button className='hero-button button-primary' href='/purchase'>Open A Crate</Button>
            </div>
            <div className="row">
              <div className="column">
                <Image src={bFancy}/>
              </div>
              <div className="column">
                <Image src={bGreen}/>
              </div>
              <div className="column">
                <Image src={bDark}/>
              </div>
            </div>
            <h2>
              How many CryptoPuffs will you find?
            </h2>
            <p>
              Find a CryptoPuff that's just right for you! Open PuffCrates to discover new CryptoPuff friends. With thousands of variations, you can collect your own unique Puff family.
            </p>
            <h2>
              What are CryptoPuffs?
            </h2>
            <p>
              CryptoPuffs are adorable pufferfish artwork minted as NFT's on the Binance Smart Chain. Puffs can be auctioned on our own marketplace (coming soon) or traded on any BSC platform that supports ERC721. 
            </p>
            <p>
              There are tens of thousands of variations of CryptoPuffs. Certain features and colors are much rarer than others. If you're really lucky, you might not get a pufferfish at all.
            </p>
            <div className="row">
              <div className="column">
                <Image src={bCool}/>
              </div>
              <div className="column">
                <Image src={dSpace}/>
              </div>
              <div className="column">
                <Image src={bShark}/>
              </div>
            </div> 
            <h2>
              How do I buy a CryptoPuff?
            </h2>
            <p>
              You can open a PuffCrate by swapping and locking BNB to BLOWF, or by adding BNB to the BlowFish-BNB liquidity pool. It's simpler than it sounds. Our smart contract handles all the logic???you just pick how much BNB you want to send and press a button.
            </p>
            <div className="divpadding">
                <Button className='hero-button button-primary' href='/purchase'>Open A Crate</Button>
            </div>
            <h2>
              CryptoPuffs strengthen The BlowFish Platform
            </h2>
            <p>
              CryptoPuffs are fun on the outside, but carry some serious tokenomics on the inside. Buying Puffs injects BNB into the BlowFish liquidity pool, increasing the price of BLOWF!
            </p>
            <Image src={dInject} width={600}/>
            <p className="mt-24">
              The upcoming <strong>Enhance & Battle</strong> will feature more benefits to locking tokens and liquidity! Upcoming games you can play with your Puffs.
            </p>
            <p>
              Visit <a href="https://www.blowfish.one/" target="_blank" rel="noopener noreferrer">blowfish.one</a> to learn more about the BlowFish platform and how to purchase $BLOWF.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;