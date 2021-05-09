import React, { useState } from 'react'

import Puff from './Puff'

import { Button, Label } from 'semantic-ui-react';

const PuffTile = props => {
    const {
        href = null,
        hoverContent,
        puffId
    } = props;

    const [showHover, setShowHover] = useState(false);

    return (
        <div className={`tiles-item pufftile-container`} onMouseEnter={() => setShowHover(true)} onMouseLeave={() => setShowHover(false)}>
            <a href={href}>
                <div className="tiles-item-inner">
                    <div className="features-tiles-item-header">
                        <Puff size={128} puffId={puffId} />
                    </div>
                    <div className="pufftile">
                        {props.children}
                    </div>
                </div>
            </a>
            {showHover && !!hoverContent ? (
                <div className='tile-hover-content'>
                    {hoverContent}
                </div>
            ) : null}
        </div>
    )
}

export default PuffTile;