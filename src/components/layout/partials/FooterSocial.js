import React from 'react';
import classNames from 'classnames';

const FooterSocial = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-social',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <ul className="list-reset">
        <li>
          <a href="https://twitter.com/blowfishtoken" rel="noopener noreferrer" target="_blank">
            <svg
              width="24"
              height="24"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg">
              <title>Twitter</title>
              <path
                d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" />
            </svg>
          </a>
        </li>
        <li className='telegram'>
          <a href="https://t.me/blowfishtokengroup" rel="noopener noreferrer" target="_blank">
          <svg
          id="svg" 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="M330.859 74.913 C 301.705 85.507,59.548 179.751,56.538 181.675 C 47.700 187.324,47.414 194.461,55.859 198.631 C 58.333 199.852,127.471 221.875,128.831 221.875 C 129.267 221.875,164.887 199.603,207.986 172.381 C 299.252 114.738,293.917 117.823,297.001 120.908 C 298.236 122.142,297.531 122.801,232.422 181.270 C 199.766 210.596,171.740 235.860,170.144 237.412 L 167.240 240.234 165.276 270.703 C 164.196 287.461,163.101 303.369,162.844 306.055 L 162.376 310.938 164.807 310.938 C 169.572 310.938,172.725 308.523,190.973 290.892 C 201.133 281.077,209.693 272.966,209.996 272.866 C 210.299 272.767,225.864 284.017,244.585 297.866 C 263.306 311.716,279.954 323.674,281.581 324.440 C 290.734 328.753,299.458 325.624,302.723 316.857 C 304.525 312.016,350.782 93.189,350.777 89.526 C 350.760 77.157,342.123 70.821,330.859 74.913 " stroke="none" fillRule="evenodd"></path></g></svg>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default FooterSocial;

