import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Container,
    Loader,
    Pagination
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch'
import PuffTile from '../components/elements/PuffTile'
import Countdown from '../components/elements/Countdown'

const axios = require('axios');

const Catalogue = props => {
    const [cryptoPuffs, setCryptoPuffs] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState(props.match.params.page);
    const [sortBy, setSortBy] = useState(props.match.params.sortBy);
    const outerClasses = classNames(
      'catalogue section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    const {
        contract,
        reloadRequired,
        user,
        web3,
    } = useContractDataContext();

    const history = useHistory();

    console.log(web3, contract);

    useEffect(() => {
        if (!!web3 && contract && !reloadRequired) {
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
        }
    }, [])

    useEffect(() => {
        if (numPages > 0) {
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
        }
    }, [page])

    const onPageChange = newPage => {
        history.push(`/catalog/${newPage}/${sortBy}`);
        setPage(newPage);
        setCryptoPuffs(null);
    }


    return (
        <section className={outerClasses}>
            {/* <div className='container search'>
                <CatalogueSearch />
            </div> */}
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
                    <h1>My Cryptopuffs</h1>
                    {!!cryptoPuffs && numPages > 0 && !!web3 && !!contract && !reloadRequired ? (
                        <div className='pufftiles container'>
                            <div className={tilesClasses}>
                                {cryptoPuffs.map((puff, i) => {
                                    return <PuffTile key={i} puffId={puff.puffId} /> 
                                })}
                            </div>
                        </div>
                    ) : (
                        <div style={{minHeight: '740px'}}>
                            <Loader active inverted inline='centered'>Loading</Loader>
                        </div>
                    )}
                    
                    {numPages > 0 ? (
                        <Pagination
                        onPageChange={(_,d) => onPageChange(d.activePage)}
                        boundaryRange={0}
                        defaultActivePage={page}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        siblingRange={1}
                        totalPages={numPages} /> 
                    ) : null}
                </Fragment>
            )}
        </section>
    )
}

export default Catalogue;