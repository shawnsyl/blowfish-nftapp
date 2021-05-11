import React, { Fragment, useState } from 'react'

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext';

import { Button, Header, Input, Label, Modal } from 'semantic-ui-react';

import Puff from './Puff';

const contractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_CRYPTOPUFF_CONTRACT;
const marketContractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_MARKET_CONTRACT : process.env.REACT_APP_TEST_MARKET_CONTRACT;

const SellModal = props => {
    const { puffId } = props; 
    
    const [open, setOpen] = useState(false);
    const [price, setPrice] = useState(null);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
 
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
        console.log(contractAddress)
        marketContract.methods.openERC721Trade(contractAddress, puffId, web3.utils.toWei(price)).estimateGas()
            .then(gasEstimate => {
                console.log(gasEstimate);
                marketContract.methods.openERC721Trade(contractAddress, puffId, web3.utils.toWei(price)).send({gas: gasEstimate, from: user})
                    .then(result => {
                        console.log(result);
                    })
                    .catch(e => {
                        console.error(e);
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
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                Cancel
                </Button>
                {unlocked ? (
                    <Button
                    content="SELL"
                    disabled={!price || parseFloat(price) === 0 || price === ''}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={sellPuff}
                    positive
                    /> 
                ) :  (
                    <Button
                    content="APPROVE"
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