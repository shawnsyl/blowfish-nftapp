import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Button,
    Container,
    Dropdown,
    Loader
} from 'semantic-ui-react'

import BuyModal from '../components/elements/BuyModal';
import PuffCarousel from '../components/elements/PuffCarousel';
import PuffTile from '../components/elements/PuffTile';

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
        marketContract,
        contractData,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    useEffect(() => {
        if (!!contractData && !!web3 && !reloadRequired) {
            if (contractData.marketPuffs) {
                let puffsToAdd = [];
                contractData.marketPuffs.map(marketPuff => {
                    puffsToAdd.push({
                        puffId: marketPuff.tokenId,
                        price: web3.utils.fromWei(marketPuff.nftTokenPrice),
                        seller: marketPuff.poster,
                        status: marketPuff.status,
                        tradeId: marketPuff.id
                    })
                })

                setCryptoPuffs(puffsToAdd)
            }
        }
    }, [web3, contractData, reloadRequired])

    const hoverContent = (puffId, price, tradeId) => (
        <Fragment>
            <BuyModal puffId={puffId} puffPrice={price} tradeId={tradeId} />
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
                {!!cryptoPuffs && !!web3 && !reloadRequired ? (
                    <div className='pufftiles container'>
                        <div className={tilesClasses}>
                            {cryptoPuffs.map((puff, i) => {
                                return (
                                    <PuffTile 
                                    key={i} hoverContent={hoverContent(puff.puffId, puff.price, puff.tradeId)} puffId={puff.puffId}>
                                        <div className="pufftile-text">
                                            <p className="mt-0 mb-0">
                                                ID: {puff.puffId}
                                            </p>
                                            <p className="mt-0 mb-0">
                                                Current Price
                                            </p>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <p className="mt-0 mb-0">
                                                {puff.price} BNB
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