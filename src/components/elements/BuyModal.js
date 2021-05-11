import React, { Fragment, useState } from 'react'

import { useContractDataContext } from '../../hooks/contractData/useContractDataContext';

import { Button, Header, Input, Label, Modal } from 'semantic-ui-react';

import Puff from './Puff';

const contractAddress = process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_CRYPTOPUFF_CONTRACT;

const BuyModal = props => {
    const { puffPrice, puffId, tradeId } = props; 
    
    const [open, setOpen] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
 
    const {
        contract,
        marketContract,
        user,
        web3
    } = useContractDataContext();

    const approve = () => {
        setIsUnlocking(true);
        contract.methods.getApproved(puffId).call()
            .then(result => {
                if (result === user) {
                    setUnlocked(true);
                    setIsUnlocking(false);
                } else {
                    contract.methods.approve(user, puffId).estimateGas({from: user})
                    .then(gasEstimate => {
                        contract.methods.approve(user, puffId).send({gas: gasEstimate, from: user})
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

    const buyPuff = () => {
        console.log(contractAddress)
        marketContract.methods.executeERC721Trade(tradeId).estimateGas({from: user, value: web3.utils.toWei(puffPrice)})
            .then(gasEstimate => {
                console.log(gasEstimate);
                marketContract.methods.executeERC721Trade(tradeId).send({gas: gasEstimate, from: user, value: web3.utils.toWei(puffPrice)})
                    .then(result => {
                        console.log(result);
                    })
                    .catch(e => {
                        console.error(e);
                    })
            })
    }

    console.log(tradeId);
    
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
                BUY THIS PUFF
            </Button>}
        >
            <Modal.Header>Buy CryptoPuff: {puffId}</Modal.Header>
            <Modal.Content>
                <div className='sell-modal-content'>
                <Puff puffId={puffId} />
                <p>Price: {puffPrice}</p>
                
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                Cancel
                </Button>
                {unlocked || true ? (
                    <Button
                    content="BUY"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={buyPuff}
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

export default BuyModal;