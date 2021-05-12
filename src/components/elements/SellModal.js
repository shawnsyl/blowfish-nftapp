import React, { Fragment, useEffect, useState } from 'react'

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext';

import { Button, Header, Input, Label, Modal } from 'semantic-ui-react';

import Puff from './Puff';

const contractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_CRYPTOPUFF_CONTRACT;
const marketContractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_MARKET_CONTRACT : process.env.REACT_APP_TEST_MARKET_CONTRACT;

const axios = require('axios');

const SellModal = props => {
    const { puffId } = props; 
    

    const [approvingText, setApprovingText] = useState('APPROVING')
    const [infoText, setInfoText] = useState('');
    const [isSelling, setIsSelling] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(null);
    const [sellingText, setSellingText] = useState('SELLING')
    const [unlocked, setUnlocked] = useState(false);

    useEffect(() => {
        let timer;
        timer = setInterval(() => {
            if (sellingText === 'SELLING...') {
                setSellingText('SELLING');
            } else {
                setSellingText(sellingText + '.');
            }
        }, 1000)

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [sellingText])

    useEffect(() => {
        let timer;
        timer = setInterval(() => {
            if (approvingText === 'APPROVING...') {
                setApprovingText('APPROVING');
            } else {
                setApprovingText(approvingText + '.');
            }
        }, 1000)

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [approvingText])

 
    const {
        contract,
        contractData,
        loadingData,
        marketContract,
        reloadRequired,
        tokenInst,
        user,
        web3
    } = useContractDataContext();

    const approve = () => {
        setIsUnlocking(true);
        contract.methods.getApproved(puffId).call()
            .then(result => {
                if (result === marketContractAddress) {
                    setUnlocked(true);
                    setIsUnlocking(false);
                } else {
                    contract.methods.approve(marketContractAddress, puffId).estimateGas({from: user})
                    .then(gasEstimate => {
                        contract.methods.approve(marketContractAddress, puffId).send({gas: gasEstimate, from: user})
                            .then(approval => {
                                setUnlocked(true);
                                setIsUnlocking(false);
                                return approval;
                            })
                            .catch(e => {
                                console.error(e);
                                setUnlocked(false);
                                setIsUnlocking(false);
                            })
                    })
                    .catch(e => {
                        console.error(e);
                    })
                }
            })
        
    }

    const sellPuff = () => {
        setIsSelling(true);
        marketContract.methods.openERC721Trade(contractAddress, puffId, web3.utils.toWei(price)).estimateGas()
            .then(gasEstimate => {
                marketContract.methods.openERC721Trade(contractAddress, puffId, web3.utils.toWei(price)).send({gas: gasEstimate, from: user})
                    .then(result => {
                        console.log(result);
                        axios({
                            method: 'post', 
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                            url: 'cryptopuffs/remove',
                            data: JSON.stringify({
                                puffId: puffId
                            })
                        })
                        .then(response => {
                            setIsSelling(false);
                            console.log(response);
                            setInfoText('Succesfully Put CryptoPuff on sale!');
                            setTimeout(() => {
                                window.location.reload();
                            }, 7500);
                        })
                        .catch(err => {
                            console.error(err);
                            setIsSelling(false);
                            setInfoText('Failed Put CryptoPuff on sale!');
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        setIsSelling(false);
                        if (err.code === 4001) {
                            setInfoText('User cancelled transaction!');
                        }
                    })
            })
    }

    console.log(price);
    
    return (
        <Modal
        className='sell-modal'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='mini'
        trigger={<Button 
            className='button-secondary' 
            fluid
            onClick={(e) => {e.preventDefault(); setOpen(true)}}>
                SELL THIS PUFF
            </Button>}
        >
            <Modal.Header>Sell CryptoPuff: {puffId}</Modal.Header>
            <Modal.Content>
                <div className='sell-modal-content'>
                <Puff puffId={puffId} />
                <p>Price</p>
                <Input onChange={(_,d) => setPrice(d.value)} label={{ basic: true, content: 'BNB' }} labelPosition='right' />
                </div>
                <p className={infoText.toLowerCase().includes('failed') || infoText.toLowerCase().includes('cancelled') ? 'warn' : ''}>{infoText}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' disabled={isUnlocking || isSelling} onClick={() => setOpen(false)}>
                Cancel
                </Button>
                {unlocked ? (
                    <Button
                    content={!isSelling ? "SELL" : sellingText}
                    disabled={!price || parseFloat(price) === 0 || price === '' || isSelling}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={sellPuff}
                    positive
                    /> 
                ) :  (
                    <Button
                    content={!isUnlocking ? "APPROVE" : approvingText}
                    disabled={isUnlocking}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={approve}
                    positive
                    /> 
                )}
            </Modal.Actions>
        </Modal>
    )
}

export default SellModal;