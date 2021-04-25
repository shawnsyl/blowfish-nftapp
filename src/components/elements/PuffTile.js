import React, { useEffect, useState } from 'react'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../elements/Image';

const maxRetries = 12
const axios = require('axios');

const PuffTile = props => {
    const {
        puffId
    } = props;

    const [imageUrl, setImageUrl] = useState(null);
    const [retries, setRetries] = useState(maxRetries);

    useEffect(() => {
        fetchNft();
    }, [])

    useEffect(() => {
        if (retries >= 0 && retries < maxRetries) {
            setTimeout(() => {fetchNft();}, 10000);
        }
    }, [retries])

    const fetchNft = () =>  {
        const api = process.env.REACT_APP_IS_STAGING == 'TRUE' || process.env.NODE_ENV === 'development' ? process.env.REACT_APP_NFT_API_TEST : 'https://api.blowfish.one/puff/'
        axios({
            method: 'get', 
            headers: {
                'access-control-allow-origin' : '*',
                'Content-Type': 'application/json'
            },
            url: api + puffId,
        }).then(response => {
            setImageUrl(response.data.image);

        }).catch(err => {
            console.error(err);
            setRetries(retries - 1);
        })
    }

    return (
        <div className="tiles-item pufftile-container">
            <a href={`/puff/${puffId}`}>
                <div className="tiles-item-inner">
                    <div className="features-tiles-item-header">
                        {!!imageUrl ? (
                            <div className="features-tiles-item-image mb-16">
                                <Image
                                src={imageUrl}
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