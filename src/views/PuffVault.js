import React from 'react'
import classNames from 'classnames';

import {
    Container
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch';
import Countdown from '../components/elements/Countdown';
import PuffTile from '../components/elements/PuffTile';

const puffData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

const PuffVault = props => {
    const outerClasses = classNames(
      'puffvault section container',
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
            <div className='container search'>
                <CatalogueSearch />
            </div>
            <div className='container'>
                <div className={tilesClasses}>
                    {puffData.map((puff, i) => {
                        return <PuffTile delay={i * 200} /> 
                    })}
                </div>
            </div>
            <div className='container'>
                <Countdown />
                <Container text className='mb-32'>
                    <p>
                    View your locked liquidity tokens here and what dates you can unlock at.
                    </p>
                </Container>
            </div>
        </section>
    )
}

export default PuffVault;