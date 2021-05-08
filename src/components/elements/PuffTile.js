import React from 'react'

import Puff from './Puff'

import { Button, Label } from 'semantic-ui-react';

const PuffTile = props => {
    const {
        puffId
    } = props;

    return (
        <div className="tiles-item pufftile-container">
            <a href={`/puff/${puffId}`}>
                <div className="tiles-item-inner">
                    <div className="features-tiles-item-header">
                        <Puff size={128} puffId={puffId} />
                    </div>
                    <div className="pufftile">
                        <p className="mt-0 mb-8">
                            Cryptopuff ID: {puffId}
                        </p>
                        <Button 
                        className='button-secondary' 
                        fluid
                        onClick={(e) => {e.preventDefault()}}>
                            SELL THIS PUFF
                        </Button>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default PuffTile;