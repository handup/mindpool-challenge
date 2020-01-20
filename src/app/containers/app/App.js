import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Components
import Helmet from 'react-helmet';
import Header from './Header';
import Footer from '../../components/footer/Footer';
// Styles
import styles from './app.css';

const DefaultHead = () => (
    <Helmet
        defaultTitle="Mindpool - Collectively we are smarter"
        titleTemplate="%s | Mindpool"
        meta={[
            {
                property: 'og:site_name',
                content: 'Mindpool'
            },
            {
                property: 'og:title',
                content: 'Mindpool'
            },
            {
                property: 'og:description',
                content: `Let's get smarter together`
            },
            {
                name: 'robots',
                content: 'noindex, nofollow'
            }
        ]}
    />
);

class AppContainer extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        device: PropTypes.string,
        setViewportAndDeviceType: PropTypes.func,
        isTrial: PropTypes.bool,
        setIsTrial: PropTypes.func,
        isAuthorized: PropTypes.bool
    };

    render() {
        return (
            <div>
                <DefaultHead />
                <div className={styles.container}>
                    <Header />

                    {this.props.children}

                    <Footer />
                </div>
            </div>
        );
    }
}

export default AppContainer;