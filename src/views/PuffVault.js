import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Dimmer,
    Loader
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch';
import Countdown from '../components/elements/Countdown';
import PuffTile from '../components/elements/PuffTile';

const puffData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

const axios = require('axios');

const PuffVault = props => {
    const [cryptoPuffs, setCryptoPuffs] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(props.match.params.page);
    const [sortBy, setSortBy] = useState(props.match.params.sortBy);

    const {
        contract,
        contractData,
        loadingData,
        reloadRequired,
        tokenInst,
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
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    useEffect(() => {
        axios({
            method: 'get', 
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
            url: 'cryptopuffs/',
            params: {
                user: user,
                page: page,
                sortBy: sortBy === 'none' ? null : sortBy
            }
        })
        .then(response => {
            setCryptoPuffs(response.data.cryptopuffs);
        })
        .catch(err => {
            console.error(err);
        })

        axios({
            method: 'get', 
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
            url: 'cryptopuffs/',
            params: {
                user: user,
                sortBy: sortBy === 'none' ? null : sortBy
            }
        }).then(response => {
            setNumPages(Math.ceil(response.data.cryptopuffs.length/12));
        }).catch(err => {
            console.error(err);
        })
    }, [])

    console.log(cryptoPuffs, numPages);

    return (
        <section className={outerClasses}>
            {!!cryptoPuffs && numPages > 0 || Date.now() < 1618768800000 && process.env.NODE_ENV !== 'development' ? (
                <Fragment>
                    <div className='container search'>
                        <CatalogueSearch />
                    </div>
                    <div className='container'>
                        <div className={tilesClasses}>
                            {cryptoPuffs.map((puff, i) => {
                                return <PuffTile delay={i * 200} puffId={puff.puffId} /> 
                            })}
                        </div>
                    </div>
                    <div className='container'>
                        <Countdown />
                        <Container text className='mb-32'>
                            <p>
                            View your locked liquidity tokens here and what dates you can unlock at.
                            </p>
                        </Container>
                    </div>
                </Fragment>
            ) : (
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            )}
        </section>
    )
}

export default PuffVault;