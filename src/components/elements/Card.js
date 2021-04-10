import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Card = props => {
    const {
        className,
        color,
        fluid,
        tag,
        ...rest
    } = props;
    
    const classes = classNames(
        'card',
        fluid && 'card-fluid',
        className
    )

    const Component = tag;
    return (
        <Component 
        {...rest}
        className={classes} />
    )
}

Card.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    fluid: PropTypes.bool,
    tag: PropTypes.elementType
}

Card.defaultProps = {
    className: '',
    color: '',
    fluid: false,
    tag: 'div'
}

export default Card;