import React from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Dimmer,
    Loader,
    Pagination
} from 'semantic-ui-react'

import Exchange from '../components/sections/Exchange';

const Purchase = props => {
    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();

    return (
        <section className='section container'>
            {!!web3 && !!contract & !reloadRequired ? (
                <Exchange />
            ) : (
                    <div style={{minHeight: '740px'}}>
                        <Loader active inverted inline='centered'>Loading</Loader>
                    </div>
                )
            }
        </section>
    )
}

export default Purchase;