import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Dimmer,
    Loader,
    Pagination
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch';
import Countdown from '../components/elements/Countdown';
import PuffTile from '../components/elements/PuffTile';

const puffData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

const axios = require('axios');

const contractAddress = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_TEST_PUFF_CONTRACT : process.env.REACT_APP_TEST_PUFF_CONTRACT;

const PuffVault = props => {
    const [cryptoPuffs, setCryptoPuffs] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(props.match.params.page);
    const [sortBy, setSortBy] = useState(props.match.params.sortBy);

    const history = useHistory();

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
        if (user && Object.keys(contract.methods).length) {
            console.log(user);
            console.log(contract.methods);
            contract.methods.getLockedLiquidityForAddress(user).call()  
                .then(response => {
                    console.log(response);
                })
        }
    }, [user, contract])

    return (
        <section className={outerClasses}>
            <div className='container search'>
                <CatalogueSearch />
            </div>
            {Date.now() < 1618768800000 && process.env.NODE_ENV !== 'development' ? (
                <div className='container'>
                    <Countdown />
                    <Container text className='mb-32'>
                        <p>
                        View your locked liquidity tokens here and what dates you can unlock at.
                        </p>
                    </Container>
                </div>
            ) : (
                <Fragment>
                    <h1>Locked Liquidity</h1>
                        {/* <div style={{minHeight: '1028px'}}>
                            <Loader active inverted inline='centered'>Loading</Loader>
                        </div> */}
                </Fragment>
            )}
        </section>
    )
}

export default PuffVault;


