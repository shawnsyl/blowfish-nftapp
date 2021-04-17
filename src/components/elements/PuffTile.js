import React from 'react'

import Image from '../elements/Image';

import sampleNft from './../../assets/examples/crypto - blowfish NFTs 005.png'

const PuffTile = props => {
    const {
        delay,
        puffId
    } = props;
    return (
        <div className="tiles-item pufftile-container">
            <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                    <Image
                    src={require('./../../assets/examples/crypto - blowfish NFTs 005.png')}
                    alt="Features tile icon 01"
                    width={128}
                    height={128} />
                    </div>
                </div>
                <div className="pufftile">
                    <h3 className="mt-0 mb-8">
                        ID: {puffId}
                    </h3>
                    <p className="m-0 text-xxs">
                        Buy for 10000BLOWF
                    </p>
                    <p className='m-0'>
                        <strong>Characteristics</strong>
                        <ul className='list-reset'>
                            <li>hi</li>
                            <li>hi</li>
                            <li>hi</li>
                            <li>hi</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PuffTile;