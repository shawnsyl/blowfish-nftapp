import React from 'react'

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Loader,
} from 'semantic-ui-react'

import Exchange from '../components/sections/Exchange';

const Purchase = props => {
    const {
        contract,
        reloadRequired,
        web3,
    } = useContractDataContext();

    return (
        <section className='purchase section container'>
            {!!web3 && !!contract & !reloadRequired ? (
                <Exchange />
            ) : (
                    <div style={{minHeight: '740px'}}>
                        <Loader active inverted inline='centered'>Loading</Loader>
                    </div>
                )
            }
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </section>
    )
}

export default Purchase;