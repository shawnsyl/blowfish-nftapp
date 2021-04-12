import React from 'react'
import classNames from 'classnames';

import {
    Container
} from 'semantic-ui-react'

import Countdown from '../components/elements/Countdown'

const Marketplace = props => {
    const outerClasses = classNames(
      'marketplace section container',
    //   topOuterDivider && 'has-top-divider',
    //   bottomOuterDivider && 'has-bottom-divider',
    //   hasBgColor && 'has-bg-color',
    //   invertColor && 'invert-color',
    //   className
    );
    
    const tilesClasses = classNames(
      'pufftiles-wrap center-content',
    );

    return (
        <section className={outerClasses}>
            {/* <p>TODO: what can we search by, what filters do we need</p>
            <p>pagination - gonna figure out the backend</p>
            <div className='container search'>
                <CatalogueSearch />
            </div>
            <div className='container'>
                <div className={tilesClasses}>
                    {puffData.map((puff, i) => {
                        return <PuffTile delay={i * 200} /> 
                    })}
                </div>
                <div>
                    hello
                </div>

            </div> */}
            <div className='container'>
                <Countdown endUnix={1619373600000} />
                <Container text className='mb-32'>
                    <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                    ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                    ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                    arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                    Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                    dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                    viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                    </p>
                    <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                    ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                    ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                    arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                    Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                    dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                    viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                    </p>
                </Container>
                
            </div>
        </section>
    )
}

export default Marketplace;