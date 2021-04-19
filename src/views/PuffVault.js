import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Loader,
} from 'semantic-ui-react'

import Countdown from '../components/elements/Countdown';

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
}

const PuffVault = props => {
    const [lockedLiquidities, setLockedLiquidities] = useState(null);
    const [lockedTokens, setLockedTokens] = useState(null);

    const {
        contract,
        reloadRequired,
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
        if (!!web3 && !!user && !!contract) {
            if (user && Object.keys(contract.methods).length && !reloadRequired) {
                contract.methods.getLockedLiquidityForAddress(user).call()  
                    .then(response => {
                        setLockedLiquidities(response.map(liquidity => ({
                            tokenCount: liquidity.tokenCount,
                            expiryTimestamp: liquidity.expiryTimestamp
                        })))
                    })
                
                contract.methods.getLockedTokensForAddress(user).call()  
                    .then(response => {
                        setLockedTokens(response.map(token => ({
                            tokenCount: token.tokenCount,
                            expiryTimestamp: token.expiryTimestamp
                        })))
                    })
            }
        }
    }, [web3, user, contract, reloadRequired])

    const formatDate = (date) => {
        const fullDate = new Date(date);
        const month = months[fullDate.getMonth()];
        const day = fullDate.getDate();
        const year = fullDate.getFullYear();

        return `${month} ${day}, ${year}`
    }

    const getLiquidityTable = () => {
        return (
            <div className='liquidity-table-container'>
                <h1>Locked Liquidity</h1>
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
                            {lockedLiquidities.map((liquidity, index) => (
                                <tr key={index}>
                                    <td>
                                        {Number(web3.utils.fromWei(liquidity.tokenCount)).toFixed(2)}
                                    </td>
                                    <td>
                                        {formatDate(liquidity.expiryTimestamp * 1000)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h1>Locked Tokens</h1>
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
                            {lockedTokens.map((token, index) => (
                                <tr key={index}>
                                    <td>
                                        {Number(web3.utils.fromWei(token.tokenCount)).toFixed(2) + 'BLOWF'}
                                    </td>
                                    <td>
                                        {formatDate(token.expiryTimestamp * 1000)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <section className={outerClasses}>
            {Date.now() < 1618808400000 && !(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') ? (
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
                    <div style={{minHeight: '1028px'}}>
                    {!!lockedLiquidities && !!lockedTokens && !!web3 && !reloadRequired && contract ? (
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


