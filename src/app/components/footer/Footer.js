import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formatDate from 'date-fns/format';
// Components
import {Link} from 'react-router';
import Icon from '../icon/Icon';
// Styles
import styles from './footer.css';

export default class Footer extends PureComponent {
    static propTypes = {
        themeColor: PropTypes.string
    };

    render() {
        return (
            <footer className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.companyInfo}>
                        <div className={styles.logo}>
                            <Icon name="logo" />
                        </div>
                        <p className={styles.address}>
                            Artillerivej 86, 2. th.<br />
                            2300 København S
                        </p>
                        <ul className={styles.companyDetails}>
                            <li className={styles.companyDetail}>
                                <span className={styles.companyDetailLabel}>Phone.</span>
                                <Link to="tel:+4511223344">+45 11 22 33 44</Link>
                            </li>
                            <li className={styles.companyDetail}>
                                <span className={styles.companyDetailLabel}>Email.</span>
                                <Link to="mailto:info@mindpool.com">info@mindpool.com</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.linkLists}>
                        <section className={styles.linkListContainer}>
                            <h4 className={styles.linkListTitle}>Product</h4>
                            <ul className={styles.linkList}>
                                <li><Link to="/solution">Solution</Link></li>
                                <li><Link to="/open-ideation">Open Ideation</Link></li>
                                <li><Link to="/crowd-predition">Crowd Prediction</Link></li>
                                <li><Link to="/cases">Cases</Link></li>
                            </ul>
                        </section>

                        <section className={styles.linkListContainer}>
                            <h4 className={styles.linkListTitle}>Company</h4>
                            <ul className={styles.linkList}>
                                <li><Link to="/blog">Blog</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/team">Team</Link></li>
                                <li><Link to="/career">Career</Link></li>
                            </ul>
                        </section>

                        <section className={styles.linkListContainer}>
                            <h4 className={styles.linkListTitle}>Social</h4>
                            <ul className={styles.linkList}>
                                <li>
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Linkedin
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://medium.com"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Medium
                                    </a>
                                </li>
                            </ul>
                        </section>
                    </div>

                    <div className={styles.bottom}>
                        <div className={styles.copyright}>
                            Copyright &copy; {formatDate(new Date(), 'YYYY')} Mindpool Software, Inc.
                        </div>

                        <div className={styles.bottomInlineLinks}>
                            <Link className={styles.bottomInlineLink} to="/terms-of-service">Terms of Service</Link>
                            <Link className={styles.bottomInlineLink} to="/privacy-policy">Privacy policy</Link>
                            <a
                                className={classNames(styles.bottomInlineLink, styles.getInTouch)}
                                href="/contact">
                                Get in touch
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
