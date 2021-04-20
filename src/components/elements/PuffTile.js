import React, { useEffect, useState } from 'react'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../elements/Image';


const axios = require('axios');

const PuffTile = props => {
    const {
        puffId
    } = props;

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        axios({
            method: 'get', 
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'https://api.blowfish.one/',
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.error(err);
        })
    }, [])


    return (
        <div className="tiles-item pufftile-container">
            <a href={`/puff/${puffId}`}>
                <div className="tiles-item-inner">
                    <div className="features-tiles-item-header">
                        {!!imageUrl ? (
                            <div className="features-tiles-item-image mb-16">
                                <Image
                                src={require('./../../assets/examples/crypto - blowfish NFTs 005.png')}
                                alt="Features tile icon 01"
                                width={128}
                                height={128} />
                            </div>
                        ) : (
                            <Loader active inline='centered'><p style={{color: '#004d6f'}}>Loading...</p></Loader>
                        )}
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