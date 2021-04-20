import React, { useEffect, useState } from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Image,
    Loader,
} from 'semantic-ui-react'

const axios = require('axios');

const PuffView = props => {
    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();
    const puffId = props.match.params.puffId;

    const [ puff, setPuff ] = useState(null);

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
        }
    }, [puffId, web3, user, contract, reloadRequired])

    console.log(puff);

    return (
        <section className='section container'>
            <h2>CryptoPuff Id: {puffId}</h2>
            {!!puff ? (
                <div className='puffview'>
                    <div className="features-tiles-item-image mb-16">
                        <Image
                        src={require('./../assets/examples/crypto - blowfish NFTs 005.png')}
                        alt="Features tile icon 01" />
                    </div>
                    <h2>Owner: {puff.puffOwner}</h2>
                </div> 
            ) : (
                <div style={{minHeight: '740px'}}>
                    <Loader active inverted inline='centered'>Loading</Loader>
                </div>
            )}
        </section>
    )
}

export default PuffView;