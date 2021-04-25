import React, { useEffect, useState } from 'react'

import {
    Loader,
} from 'semantic-ui-react'

import Image from '../elements/Image';

const maxRetries = 12
const axios = require('axios');

const Puff = props => {
    const {
        size = 128,
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
            url: (process.env.REACT_APP_IS_STAGING == 'TRUE' ? '/nftapi/' : api) + puffId,
        }).then(response => {
            setImageUrl(response.data.image);

        }).catch(err => {
            console.error(err);
            setRetries(retries - 1);
        })
    }

    return (
        <div>
            {!!imageUrl ? (
                <div className="features-tiles-item-image mb-16">
                    <Image
                    src={imageUrl}
                    alt="Features tile icon 01"
                    width={size}
                    height={size} />
                </div>
            ) : (
                <Loader active inline='centered'><p style={{color: '#004d6f'}}>Loading...</p></Loader>
            )}
        </div>
    );
}

export default Puff;