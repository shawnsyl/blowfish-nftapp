import React from 'react';
import classNames from 'classnames';
import Image from '../../elements/Image';

const Logo = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'brand',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <h1 className="m-0">
          <a href="https://blowfish.one" rel="noopener noreferrer" target="_blank">
        
            <Image
            src={require('./../../../assets/images/blowfish-only.png')}
            alt="Open"
            width={32}
            height={32} />
          </a>
      </h1>
    </div>
  );
}

export default Logo;