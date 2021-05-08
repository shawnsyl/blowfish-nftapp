import React, { useEffect, useState } from 'react'

import Carousel, { arrowsPlugin, slidesToShowPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import { Button, Label } from 'semantic-ui-react';

import Puff from './Puff';

const PuffCarousel = props => {
    const {
        puffIds
    } = props;

    const [containerWidth, setContainerWidth] = useState(null);
    const [itemWidth, setItemWidth] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const carousel = Array.from(document.getElementsByClassName('customBrainhubCarousel'));

            if (carousel.length > 0) {
                const carouselWidth = carousel[0].scrollWidth;
                const arrowWidth = Array.from(carousel[0].getElementsByClassName('BrainhubCarousel__customArrows'))[0].scrollWidth;
                const carouselItemWidth = (carouselWidth - arrowWidth * 2)/3;

                setItemWidth(carouselItemWidth);
                setContainerWidth(carouselItemWidth * puffIds.length);
            }
        };
    
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    useEffect(() => {
        if (!itemWidth) {
            const carousel = Array.from(document.getElementsByClassName('customBrainhubCarousel'));

            if (carousel.length > 0) {
                const carouselWidth = carousel[0].scrollWidth;
                const arrowWidth = Array.from(carousel[0].getElementsByClassName('BrainhubCarousel__customArrows'))[0].scrollWidth;
                const carouselItemWidth = (carouselWidth - arrowWidth * 2) / 3;
                setItemWidth(carouselItemWidth);
            }
        }
    });

    useEffect(() => {
        if (!!itemWidth) {
            setContainerWidth(itemWidth * puffIds.length);
        }
    }, [itemWidth])

    if (!puffIds || !puffIds.length) {
        return null;
    }

    let containerStyles = {
        width: containerWidth + 'px',
        transform: "translateX(" + (itemWidth - itemWidth * selectedIndex).toString() + "px)",
        marginLeft: "0px",
        transitionDuration: '500ms, 500ms'
    }

    const carouselItem = (puffId, index) => {
        let itemStyles = {
            width: itemWidth + 'px',
            marginRight: '0px',
            marginLeft: '0px',
            maxWidth: itemWidth + 'px',
            minWidth:  itemWidth + 'px',
            transform: index === selectedIndex ? 'scale(1.5)': '',
            transitionDuration: '500ms, 500ms'
        }

        return (
            <li class="BrainhubCarouselItem BrainhubCarouselItem" style={itemStyles}>
                <div className='puffCarousel-puff' key={index}>   
                    <Puff puffId={puffId} />
                    
                    <p className="mt-0 mb-8">
                        Cryptopuff ID: {puffId}
                    </p>
                    
                    {index === selectedIndex ? (
                        <Button 
                        className='button-secondary' 
                        fluid
                        onClick={() => {}}>
                            SELL THIS PUFF
                        </Button>
                    ) : <div className='puffCarousel-buttonPlaceholder'>
                        </div>}
                </div>
            </li>
        )
    }   
    
    const clickRight = () => {
        setSelectedIndex(selectedIndex + 1);
    }
    
    const clickLeft = () => {
        setSelectedIndex(selectedIndex - 1);
    }

    return (
        <div className='puffCarousel-container'>
            <div className='BrainhubCarousel__container'>
                <div className='BrainhubCarousel customBrainhubCarousel'>
                    <div 
                    className={`BrainhubCarousel__customArrows BrainhubCarousel__arrow BrainhubCarousel__custom-arrowLeft ${selectedIndex === 0 ? 'carouselArrowContainer--disabled' : ''}`}
                    onClick={clickLeft}>
                        <span class="carousel-arrow">&lt;</span>
                    </div>
                    <div className='BrainhubCarousel__trackContainer'>
                        <ul className='BrainhubCarousel__track BrainhubCarousel__track--transition BrainhubCarousel__track--draggable customCarouselTrack' style={containerStyles}>
                            
                        {puffIds.map((puffId, index) => (
                            carouselItem(puffId, index)
                        ))}
                        </ul>
                    </div>
                    <div className={`BrainhubCarousel__customArrows BrainhubCarousel__custom-arrowLeft ${selectedIndex === puffIds.length - 1 ? 'carouselArrowContainer--disabled' : ''}`} onClick={clickRight}>
                        <span className="carousel-arrow ">&gt;</span>
                    </div>
                </div>
            </div>
            <div >

            </div>
        </div>
    )
}

export default PuffCarousel;

/*
<Carousel
plugins={[
    {
        resolve: slidesToShowPlugin,
        options: {
            numberOfSlides: 3
        }
    },
    {
        resolve: arrowsPlugin,
        options: {
            arrowRight: <span class={`carousel-arrow ${selectedIndex === puffIds.length - 1  ? 'disabled' : ''}`}>{'>'}</span>,
            // <button type="button" class="BrainhubCarousel__arrows BrainhubCarousel__arrowRight" disabled={selectedIndex === puffIds.length - 1}><span>next</span></button>,
            arrowLeft: <span class='carousel-arrow'>{'<'}</span>,
            // <button type="button" class="BrainhubCarousel__arrows BrainhubCarousel__arrowLeft"><span>prev</span></button>,
            addArrowClickHandler: true,
        }
    }
]}
breakpoints={breakpoints}
dots={true}
onChange={onChange}
value={selectedIndex}>
    {puffIds.slice(0,7).map((puffId, index) => (
        <div className='puffCarousel-puff' key={index}>   
            <Puff puffId={puffId} />
            
            <p className="mt-0 mb-8">
                Cryptopuff ID: {puffId}
            </p>
            
            <p className="mt-0 mb-8">
                Cryptopuff ID: {puffId}
            </p>
        </div>
    ))}
</Carousel> 
*/