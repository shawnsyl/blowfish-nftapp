import React from 'react'
import classNames from 'classnames';

import {
    Container
} from 'semantic-ui-react'

import Countdown from '../components/elements/Countdown'

const Battle = props => {
    const outerClasses = classNames(
      'marketplace section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    return (
        <section className={outerClasses}>
            {/* <p>TODO: what can we search by, what filters do we need</p>
            <p>pagination - gonna figure out the backend</p>
            <div className='container search'>
                <CatalogueSearch />
            </div>
            <div className='container'>
                <div className={tilesClasses}>
                    {puffData.map((puff, i) => {
                        return <PuffTile delay={i * 200} /> 
                    })}
                </div>
                <div>
                    hello
                </div>

            </div> */}
            <div className='container'>
                <Countdown endUnix={1619978400000} />
                <Container text className='mb-32'>
                    <p>
                    Enhance and Battle will be a future update to CryptoPuffs.
                    </p>
                    <p>
                    Lock BLOWF tokens for a certain time period to receive upgrades. Place bets and battle with other CryptoPuffs to win rewards. More upgrades and BLOWF winnings.
                    </p>
                    <p>
                    
                    </p>
                </Container>
            </div>
        </section>
    )
}

export default Battle;