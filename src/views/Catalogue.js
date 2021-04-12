import React from 'react'
import classNames from 'classnames';

import CatalogueSearch from '../components/elements/CatalogueSearch'
import PuffTile from '../components/elements/PuffTile'
import Countdown from '../components/elements/Countdown'

const puffData = [
    {},{},{},{},{},{},{},{},{},{},{},{}
]

const Catalogue = props => {
    const outerClasses = classNames(
      'catalogue section container',
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
                <Countdown />
            </div>
        </section>
    )
}

export default Catalogue;