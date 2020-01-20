import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// Components
import FixedSizeImage from '../image/FixedSizeImage';
import Icon from '../icon/Icon';
import HeadPresenter from '../Head';
// Styles
import styles from './hero.css';

export default class Hero extends PureComponent {
    static propTypes = {
        category: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.string
    };

    render() {
        const {
            category,
            title,
            subtitle,
            image,
            color
        } = this.props;

        return (
            <header className={styles.hero}>
                <HeadPresenter title={title} />
                <div className={styles.grid}>
                    <div className={styles.heroHexagon} />
                    <div className={styles.heroDotsContainer}>
                        <div className={styles.heroDots}><Icon name="dot-grid" /></div>
                    </div>
                    <div
                        style={color ? {color} : null}
                        className={styles.heroImageContainer}>
                        <FixedSizeImage
                            width={800}
                            className={styles.heroImage}
                            src={image} />
                    </div>
                    <div className={styles.heroContent}>
                        {category ? (
                            <span className={styles.category}>{category}</span>
                        ) : null}
                        <h1 className={styles.title}>{title}</h1>
                        {subtitle ? (<p className={styles.subtitle}>{subtitle}</p>) : null}
                    </div>
                </div>
            </header>
        );
    }
}