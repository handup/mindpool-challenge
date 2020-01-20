import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import getPath from 'lodash/get';
import classNames from 'classnames';
// Components
import {Link} from 'react-router';
import Icon from '../../components/icon/Icon';
// Styles
import styles from './header.css';

class Header extends PureComponent {
    static propTypes = {
        style: PropTypes.oneOf(['transparent']),
        themeColor: PropTypes.string
    };

    static defaultProps = {
        themeColor: `#75bca8`
    };

    state = {scrolled: false};

    componentDidMount() {
        global.window.addEventListener('scroll', this.handleScroll, false);
    }

    componentWillUnmount() {
        global.window.removeEventListener('scroll', this.handleScroll, false);
    }

    handleScroll = () => {
        cancelAnimationFrame(this.scrollDebounce);

        this.scrollDebounce = requestAnimationFrame(() => {
            const hasScrolled = Math.ceil(global.document.documentElement.scrollTop) >= 1;

            if (this.state.scrolled === hasScrolled) {
                return;
            }

            this.setState({
                scrolled: hasScrolled
            });
        });
    };

    get containerClasses() {
        return classNames(
            styles.container,
            this.props.style === 'transparent' && styles.transparent,
            this.state.scrolled && styles.scrolled
        );
    }

    render() {
        const {
            themeColor,
        } = this.props;

        const hoverBar = (
            <span style={{color: themeColor}} className={styles.linkListHoverBar} />
        );

        return (
            <div className={this.containerClasses}>
                <header className={styles.header}>
                    <div className={styles.content}>
                        <div className={styles.gridSmallOnly}>
                            <Link to="/" className={styles.logo}>
                                <Icon name="logo" />
                            </Link>

                            <nav className={styles.gridLargeOnly}>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link to="/solution">
                                            Solution
                                            {hoverBar}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/cases">
                                            Cases
                                            {hoverBar}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            Blog
                                            {hoverBar}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/about">
                                            About
                                            {hoverBar}
                                        </Link>
                                    </li>
                                </ul>

                                <button
                                    className={styles.login}
                                    to="/login">
                                    <span className={styles.loginIcon}><Icon name="avatar-hollow" /></span>
                                    <span className={styles.loginLabel}>Log in</span>
                                </button>
                            </nav>

                            <Link
                                style={{color: themeColor}}
                                to="/contact"
                                className={styles.bookADemo}>
                                <span className={styles.bookADemoLabel}>Book a demo</span>
                            </Link>
                        </div>
                    </div>
                </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    style: getPath(state, 'ui.settings.headerStyle', null)
});

export default connect(mapStateToProps)(Header);