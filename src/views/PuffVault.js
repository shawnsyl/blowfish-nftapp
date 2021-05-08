import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Button,
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
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawText, setWithdrawText] = useState('Withdrawing')

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

    useEffect(() => {
        let timer;
        timer = setInterval(() => {
            if (withdrawText === 'Withdrawing...') {
                setWithdrawText('Withdrawing');
            } else {
                setWithdrawText(withdrawText + '.');
            }
        }, 1000)

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [withdrawText])

    const formatDate = (date) => {
        const fullDate = new Date(date);
        const month = months[fullDate.getMonth()];
        const day = fullDate.getDate();
        const year = fullDate.getFullYear();
        const hour = fullDate.getHours();
        const minute = fullDate.getMinutes();

        return `${month} ${day}, ${year} ${hour > 12 ? hour - 12 : hour}:${minute < 10 ? '0' : ''}${minute} ${hour >= 12 ? 'PM' : 'AM'}`
    }

    const withdrawLiquidity = (index) => {
        setIsWithdrawing(true);
        contract.methods.withdrawLiquidityTokens(index).estimateGas({from: user})
            .then(gasEstimate => {
                contract.methods.withdrawLiquidityTokens(index).send({from: user, gas: gasEstimate + 50000})
                    .then(response => {
                        setIsWithdrawing(false);
                        window.location.reload();
                    })
                    .catch(e => {
                        setIsWithdrawing(false);
                        console.error(e);
                    })
            })
    }

    const withdrawTokens = (index) => {
        setIsWithdrawing(true);
        contract.methods.withdrawTokens(index).estimateGas({from: user})
            .then(gasEstimate => {
                contract.methods.withdrawTokens(index).send({from: user, gas: gasEstimate + 50000})
                    .then(response => {
                        setIsWithdrawing(false);
                        window.location.reload();
                    })
                    .catch(e => {
                        setIsWithdrawing(false);
                        console.error(e);
                    })
            })
       
    }

    const getLiquidityTable = () => {
        return (
            <div className='liquidity-table-container'>
                <h1>Locked Liquidity</h1>
                {!!lockedLiquidities && !!web3 && !reloadRequired && contract ? (
                    <div className='liquidity-table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        BLOWF/BNB
                                    </th>
                                    <th>
                                        Locked Until
                                    </th>
                                    <th>
                                        Withdraw
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lockedLiquidities.map((liquidity, index) => {
                                    if(liquidity.tokenCount !== '0')
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    {Number(web3.utils.fromWei(liquidity.tokenCount)).toFixed(2)}
                                                </td>
                                                <td>
                                                    {formatDate(liquidity.expiryTimestamp * 1000)}
                                                </td>
                                                <td>
                                                    <Button 
                                                    className='button-primary' 
                                                    disabled={Date.now() < liquidity.expiryTimestamp * 1000 || isWithdrawing || liquidity.tokenCount === '0'}
                                                    onClick={() => withdrawLiquidity(index)}>
                                                        <span className={isWithdrawing ? 'buttonText withdrawing' : 'buttonText'}>{isWithdrawing ? withdrawText  : 'Withdraw'}</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    else
                                        return null;
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Loader active inverted inline='centered'>{!web3 || reloadRequired ? 'Please connect your wallet.' : 'Loading locked liquidity'}</Loader>
                )}
                <h1>Locked BLOWF</h1>
                {!!lockedTokens && !!web3 && !reloadRequired && contract ? (
                    <div className='liquidity-table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        BLOWF
                                    </th>
                                    <th>
                                        Locked Until
                                    </th>
                                    <th>
                                        Withdraw
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lockedTokens.map((token, index) => {
                                    if (token.tokenCount !== '0') 
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {Number(web3.utils.fromWei(token.tokenCount)).toFixed(2)}
                                                </td>
                                                <td>
                                                    {formatDate(token.expiryTimestamp * 1000)}
                                                </td>
                                                <td>
                                                    <Button 
                                                    className='button-primary' 
                                                    disabled={Date.now() < token.expiryTimestamp * 1000 || isWithdrawing || token.tokenCount === '0'}
                                                    onClick={() => withdrawTokens(index)}>
                                                        <span className={isWithdrawing ? 'buttonText withdrawing' : 'buttonText'}>{isWithdrawing ? withdrawText  : 'Withdraw'}</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    else
                                        return null;
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <Loader active inverted inline='centered'>{!web3 || reloadRequired ? 'Please connect your wallet.' : 'Loading locked BLOWF'}</Loader>
                )}
            </div>
        )
    }

    return (
        <section className={outerClasses}>
            <Fragment>
                <Fragment>
                    {getLiquidityTable()}
                </Fragment>
                <div style={{minHeight: '1028px'}}>
                </div>
            </Fragment>
        </section>
    )
}

export default PuffVault;


