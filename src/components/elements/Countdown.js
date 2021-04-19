import React, { Fragment, useEffect, useState } from 'react'

import {
    Container
} from 'semantic-ui-react'

const Countdown = props => {
    const {
        endUnix = 1618974000000
    } = props;

    const getRemainingTime = () => {
        const now = Date.now()
        const nowDate = new Date(now);
        const endDate = new Date(endUnix);
        return endDate - nowDate   
    }
    
    const [remainingTime, setRemainingTime] = useState(getRemainingTime())

    useEffect(() => {
        let timer;
        timer = setInterval(() => {
            setRemainingTime(getRemainingTime());
        }, 1000);
        
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [])

    const formatTime = () => {
        const days = Math.trunc((remainingTime / (1000 * 60 * 60 * 24)));
        let leftoverHours = (remainingTime % (1000 * 60 * 60 * 24));

        const hours = Math.trunc((leftoverHours / (1000 * 60 * 60)));
        let leftoverMinutes = (leftoverHours % (1000 * 60 * 60));

        const minutes = Math.trunc(leftoverMinutes / (1000 * 60));
        let leftoverSeconds = (leftoverMinutes % (1000 * 60));

        const seconds = Math.trunc(leftoverSeconds / 1000);

        return (
            <Fragment>
                {Digit(days, 'DAYS')}
                {Digit(hours, 'HOURS')}
                {Digit(minutes, 'MINUTES')}
                {Digit(seconds, 'SECONDS')}

            </Fragment>
        );
    }

    const Digit = (number, text='placeholder') => {
        return <div className='countdown-digit'>
            <h1>{number}</h1>
            <p>{text}</p>
        </div>
    }

    return (
        <Fragment>
            <div className='container-sm'>
                <h1 style={{textAlign: 'center'}}>Coming soon!</h1>
                {endUnix === 1618974000000 ? (
                    <Container className='countdown-container'>
                        {formatTime()}
                    </Container>
                ) : null}
            </div>
        </Fragment>
    )
}

export default Countdown;