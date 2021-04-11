import React from 'react'
import classNames from 'classnames';

import PuffTile from '../components/elements/PuffTile'

const puffData = [
    {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
]

const Catalogue = props => {
    const tilesClasses = classNames(
      'tiles-wrap center-content',
    );   

    const outerClasses = classNames(
      'catalogue section',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );

    return (
        <section className={outerClasses}>
            <div className='container'>
                <div className={tilesClasses}>
                    {puffData.map((puff, i) => {
                        return <PuffTile delay={i * 200} /> 
                    })}
                </div>
            </div>
        </section>
    )
}

export default Catalogue;