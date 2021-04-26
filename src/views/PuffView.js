import React, { useEffect, useState } from 'react'

import {
    Image,
    Loader,
} from 'semantic-ui-react'

import Puff from '../components/elements/Puff';

const axios = require('axios');

const PuffView = props => {
    const puffId = props.match.params.puffId;

    const [puff, setPuff] = useState(null);

    useEffect(() => {
        if (!!puffId) {
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/',
                params: {
                    puffId: puffId
                }
            })
            .then(response => {
                setPuff(response.data.cryptopuffs[0]);
            })
            .catch(err => {
                console.error(err);
            });
        }
    }, [puffId])

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