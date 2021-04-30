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

import PuffTile from '../components/elements/PuffTile'
import Puff from '../components/elements/Puff'

const axios = require('axios');

const Catalogue = props => {
    const [allPuffs, setAllPuffs] = useState(null);
    const [cryptoPuffs, setCryptoPuffs] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
    const [page, setPage] = useState(props.match.params.page);
    const [recentsPage, setRecentsPage] = useState(1);
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

    useEffect(() => {
        setLoading(true);
        axios({
            method: 'get', 
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
            url: 'cryptopuffs/',
            params: {
                page: 1, 
                pageSize: 8,
                sortBy: 'puffId-desc'
            }
        }).then(response => {
            console.log(response)
            setLoading(false);
            setAllPuffs(response.data.cryptopuffs)
        }).catch(err => {
            setLoading(false);
            console.error(err);
        })
    } , [])

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

    const onPageChange = newPage => {
        history.push(`/catalog/${newPage}/${sortBy}`);
        setPage(newPage);
        setCryptoPuffs(null);
    }
    
    const loadMore = () => {
        setLoading(true);
        axios({
            method: 'get', 
            headers: {
                'Content-Type': 'application/json'
            },
            baseURL:  process.env.REACT_APP_BACKEND_HOST + 'api/',
            url: 'cryptopuffs/',
            params: {
                page: recentsPage + 1, 
                pageSize: 8,
                sortBy: 'puffId-desc'
            }
        }).then(response => {
            console.log(response)
            if (response.data.cryptopuffs.length) {
                setAllPuffs([...allPuffs, ...response.data.cryptopuffs])
                setRecentsPage(recentsPage + 1)
                setLoading(false);
            } else {
                setLoadMoreDisabled(true);
                setLoading(false);
            }
        }).catch(err => {
            setLoading(false);
            console.error(err);
        })
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
                            {allPuffs.map((mint, index) => (
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
                            boundaryRange={1}
                            siblingRange={1}
                            defaultActivePage={page}
                            ellipsisItem={undefined}
                            firstItem={null}
                            lastItem={null}
                            totalPages={numPages} /> 
                        ) : null}
                    </Fragment>
                ) : (
                    <div>
                        <Loader active inverted inline='centered'>Please connect your wallet</Loader>
                    </div>
                )}
                <h1>Recently Discovered CryptoPuffs</h1>
                {!!allPuffs ? (
                    <div style={{paddingBottom: '48px'}}>
                        {getRecentMints()}
                        <Button className='button-primary' disabled={loadMoreDisabled || loading} onClick={loadMore}>
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Loader active inverted inline='centered'>Loading</Loader>
                    </div>
                )}
            </Fragment>
        </section>
    )
}

export default withRouter(Catalogue);