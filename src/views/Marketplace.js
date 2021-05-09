import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Button,
    Container,
    Dropdown,
    Loader
} from 'semantic-ui-react'

import PuffCarousel from '../components/elements/PuffCarousel';
import PuffTile from '../components/elements/PuffTile';

const axios = require('axios');

const Marketplace = props => {
    const outerClasses = classNames(
      'marketplace section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );

    const [cryptoPuffs, setCryptoPuffs] = useState(null);

    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    useEffect(() => {
        if (!!web3 && !!contract && !reloadRequired && Object.keys(contract.methods).length) {    
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/',
                params: {
                    puffOwner: user,
                    sortBy: null
                }
            }).then(response => {
                setCryptoPuffs(response.data.cryptopuffs);
            }).catch(err => {
                console.error(err);
            })
        }
    }, [web3, contract, reloadRequired])

    const hoverContent = (
        <Fragment>
            <Button className='button-secondary' fluid>
                BUY THIS PUFF
            </Button>
        </Fragment>
    )

    return (
        <section className={outerClasses}>
            <h2>MARKETPLACE</h2>
            <div className='marketplace-viewer'>
                <div className='marketplace-filters'>
                    <h2>Options</h2>
                    {/* <Dropdown
                    fluid
                    selection
                    onChange={(_, d) => setViewOption(d.value)}
                    options={viewOptions}
                    value={viewOption} /> */}
                </div>
                <div className='puffs-viewer'>
                {!!cryptoPuffs && !!web3 && !!contract && !reloadRequired ? (
                    <div className='pufftiles container'>
                        <div className={tilesClasses}>
                            {cryptoPuffs.map((puff, i) => {
                                return (
                                    <PuffTile 
                                    key={i} hoverContent={hoverContent} puffId={puff.puffId}>
                                        <div className="pufftile-text">
                                            <p className="mt-0 mb-0">
                                                ID: {puff.puffId}
                                            </p>
                                            <p className="mt-0 mb-0">
                                                Current Price
                                            </p>
                                        </div>
                                        <div className="pufftile-text">
                                            <p className="mt-0 mb-0">
                                                Time Left: blah
                                            </p>
                                            <p className="mt-0 mb-0">
                                                Price
                                            </p>
                                        </div>
                                    </PuffTile>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div>
                        <Loader active inverted inline='centered'>Please connect your wallet</Loader>
                    </div>
                )}
                </div>
            </div>
            <Container text className='mb-32'>
                <p>
                Auction your CryptoPuffs here! Set your price and let the market decide.
                </p>
                <p>
                See a Puff you really like? Place a bid!
                </p>
                <p>
                MarketPlace to be released soon after CryptoPuffs initial launch.
                </p>
            </Container>
        </section>
    )
}

export default Marketplace;