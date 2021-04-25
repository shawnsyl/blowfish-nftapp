import React, { useEffect, useState } from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Image,
    Loader,
} from 'semantic-ui-react'

import Puff from '../components/elements/Puff';

const axios = require('axios');

const maxRetries = 12

const PuffView = props => {
    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();
    const puffId = props.match.params.puffId;

    const [imageUrl, setImageUrl] = useState(null);
    const [puff, setPuff] = useState(null);
    const [retries, setRetries] = useState(maxRetries);

    useEffect(() => {
        if (!!puffId && !!web3 && !!user &&!!contract && !reloadRequired) {
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/',
                params: {
                    user: user,
                    puffId: puffId
                }
            })
            .then(response => {
                setPuff(response.data.cryptopuffs[0]);
            })
            .catch(err => {
                console.error(err);
            })
            fetchNft();
        }
    }, [puffId, web3, user, contract, reloadRequired])

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
        <section className='section container'>
            <h2>CryptoPuff Id: {puffId}</h2>
            {!!puff ? (
                <div className='puffview'>
                    <Puff size={600} puffId={puffId} />
                    <h2>Owner: {puff.puffOwner}</h2>
                </div> 
            ) : (
                <div style={{minHeight: '740px'}}>
                    <Loader active inline='centered'>Loading</Loader>
                </div>
            )}
        </section>
    )
}

export default PuffView;