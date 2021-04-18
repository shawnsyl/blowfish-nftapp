import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Dimmer,
    Loader,
    Pagination
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch';
import Countdown from '../components/elements/Countdown';

const PuffVault = props => {
    const [lockedLiquidities, setLockedLiquidities] = useState(null);

    const history = useHistory();

    const {
        contract,
        contractData,
        loadingData,
        reloadRequired,
        tokenInst,
        user,
        web3
    } = useContractDataContext();

    const outerClasses = classNames(
      'puffvault section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );

    useEffect(() => {
        if (user && Object.keys(contract.methods).length) {
            console.log(user);
            console.log(contract.methods);
            contract.methods.getLockedLiquidityForAddress(user).call()  
                .then(response => {
                    console.log(response);
                    setLockedLiquidities(response.map(liquidity => ({
                        tokenCount: liquidity.tokenCount,
                        expiryTimestamp: liquidity.expiryTimestamp
                    })))
                })
        }
    }, [user, contract])

    const getLiquidityTable = () => {
        return (
            <div className='liquidity-table'>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Token Amount
                            </th>
                            <th>
                                Locked Until
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lockedLiquidities.map(liquidity => (
                            <tr>
                                <td>
                                    {liquidity.tokenCount}
                                </td>
                                <td>
                                    {liquidity.expiryTimestamp}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
    
    console.log(lockedLiquidities)

    return (
        <section className={outerClasses}>
            <div className='container search'>
                <CatalogueSearch />
            </div>
            {Date.now() < 1618768800000 && process.env.NODE_ENV !== 'development' ? (
                <div className='container'>
                    <Countdown />
                    <Container text className='mb-32'>
                        <p>
                        View your locked liquidity tokens here and what dates you can unlock at.
                        </p>
                    </Container>
                </div>
            ) : (
                <Fragment>
                    <h1>Locked Liquidity</h1>
                    <div style={{minHeight: '1028px'}}>
                    {!!lockedLiquidities ? (
                        <Fragment>
                            {getLiquidityTable()}
                        </Fragment>
                    ) : (
                        <Loader active inverted inline='centered'>Loading</Loader>
                    )}
                    </div>
                </Fragment>
            )}
        </section>
    )
}

export default PuffVault;


