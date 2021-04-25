import React from 'react'

import Puff from './Puff'

const PuffTile = props => {
    const {
        puffId
    } = props;

    return (
        <div className="tiles-item pufftile-container">
            <a href={`/puff/${puffId}`}>
                <div className="tiles-item-inner">
                    <div className="features-tiles-item-header">
                        <Puff size={128} puffId={puffId} />
                    </div>
                    <div className="pufftile">
                        <h3 className="mt-0 mb-8">
                            ID: {puffId}
                        </h3>
                        {/* <p className='m-0'>
                            <strong>Characteristics</strong>
                        </p>
                        <ul className='list-reset'>
                            <li>hi</li>
                            <li>hi</li>
                            <li>hi</li>
                            <li>hi</li>
                        </ul> */}
                    </div>
                </div>
            </a>
        </div>
    )
}

export default PuffTile;