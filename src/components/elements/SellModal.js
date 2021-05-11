import React, { Fragment, useState } from 'react'

import { Button, Header, Input, Label, Modal } from 'semantic-ui-react';

import Puff from './Puff';

const SellModal = props => {
    const { puffId } = props; 
    const [open, setOpen] = useState(false);
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
                <Input label={{ basic: true, content: 'BNB' }} labelPosition='right' />
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                Cancel
                </Button>
                <Button
                content="SELL"
                labelPosition='right'
                icon='checkmark'
                onClick={() => setOpen(false)}
                positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default SellModal;