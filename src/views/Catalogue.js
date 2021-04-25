import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router';
import classNames from 'classnames';

import { useContractDataContext } from '../hooks/contractData/useContractDataContext'

import {
    Button,
    Container,
    Loader,
    Pagination
} from 'semantic-ui-react'

import CatalogueSearch from '../components/elements/CatalogueSearch'
import PuffTile from '../components/elements/PuffTile'
import Puff from '../components/elements/Puff'
import Countdown from '../components/elements/Countdown'

const axios = require('axios');

const Catalogue = props => {
    const [allPuffs, setAllPuffs] = useState(null);
    const [cryptoPuffs, setCryptoPuffs] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [numRecent, setNumRecent] = useState(4);
    const [page, setPage] = useState(props.match.params.page);
    const [recentMints, setRecentMints] = useState(null);
    const [sortBy, setSortBy] = useState(props.match.params.sortBy);
    const [totalSupply, setTotalSupply] = useState(0);
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

    useEffect(() => {
        if (!!web3 && !!contract && !reloadRequired && Object.keys(contract.methods).length) {
            contract.methods.totalSupply().call()
                .then(response => {
                    console.log(response);
                    setTotalSupply(parseInt(response));
                })
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/',
                params: {
                    puffOwner: user,
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
                    puffOwner: user,
                    sortBy: sortBy === 'none' ? null : sortBy
                }
            }).then(response => {
                setNumPages(Math.ceil(response.data.cryptopuffs.length/12));
            }).catch(err => {
                console.error(err);
            })
    
            axios({
                method: 'get', 
                headers: {
                    'Content-Type': 'application/json'
                },
                baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
                url: 'cryptopuffs/'
            }).then(response => {
                console.log(response)
                setAllPuffs(response.data.cryptopuffs)
            }).catch(err => {
                console.error(err);
            })
        }
    }, [web3, contract, reloadRequired])

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
                    puffOwner: user,
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

    useEffect(() => {
        if (numPages > 0) {
            setPage(props.match.params.page);
            setCryptoPuffs(null);
        }
    }, [props.match.params.page])

    useEffect(() => {
        if (!!allPuffs && totalSupply > 0) {
            setRecentMints([...allPuffs.slice(totalSupply - numRecent, totalSupply).reverse()])
        }
    }, [allPuffs, totalSupply, numRecent])

    const onPageChange = newPage => {
        history.push(`/catalog/${newPage}/${sortBy}`);
        setPage(newPage);
        setCryptoPuffs(null);
    }
    
    const loadMore = () => {
        if (numRecent + 8 < totalSupply) {
            setNumRecent(numRecent + 8)
        } else if (numRecent + 8 >= totalSupply) {
            setNumRecent(totalSupply);
        }
    }

    const getRecentMints = () => {
        return (
            <div className='recent-mints-table-container'>
                <div className='recent-mints-table'>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <th>
                                    Owner
                                </th>
                                <th>
                                    NFT
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentMints.map((mint, index) => (
                                <tr key={index}>
                                    <td>
                                        {mint.puffId}
                                    </td>
                                    <td>
                                        {mint.puffOwner}
                                    </td>
                                    <td>
                                        <a href={`/puff/${mint.puffId}`}>
                                            <Puff size={64} puffId={mint.puffId} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <section className={outerClasses}>
            {/* <div className='container search'>
                <CatalogueSearch />
            </div> */}
            {!(process.env.NODE_ENV === 'development' || process.env.REACT_APP_IS_STAGING == 'TRUE') ? (
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
                <h1>My CryptoPuffs</h1>
                    {!!cryptoPuffs && numPages > 0 && !!web3 && !!contract && !reloadRequired ? (
                        <Fragment>
                            <div className='pufftiles container'>
                                <div className={tilesClasses}>
                                    {cryptoPuffs.map((puff, i) => {
                                        return <PuffTile key={i} puffId={puff.puffId} /> 
                                    })}
                                </div>
                            </div>
                    
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
                    ) : (
                        <div>
                            <Loader active inverted inline='centered'>Loading</Loader>
                        </div>
                    )}
                    <h1>Recently Discovered CryptoPuffs</h1>
                    {!!recentMints && !!web3 && !!contract && !reloadRequired ? (
                        <div style={{paddingBottom: '48px'}}>
                            {getRecentMints()}
                            <Button className='button-primary' disabled={numRecent === totalSupply} onClick={loadMore}>
                                Load More
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Loader active inverted inline='centered'>Loading</Loader>
                        </div>
                    )}
                </Fragment>
            )}
        </section>
    )
}

export default withRouter(Catalogue);