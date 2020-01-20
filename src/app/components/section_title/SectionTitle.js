import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Components
import Icon from '../icon/Icon';
// Styles
import styles from './section_title.css';

export default class SectionTitle extends PureComponent {
    static propTypes = {
        themeColor: PropTypes.string,
        variant: PropTypes.oneOf(['light', 'dark']),
        icon: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        alignment: PropTypes.oneOf(['left', 'center']),
        margin: PropTypes.number
    };

    static defaultProps = {
        variant: 'light',
        alignment: 'center',
        icon: 'hexagons',
        themeColor: '#75bca8'
    };

    render() {
        const {
            themeColor,
            icon,
            title,
            description,
            alignment,
            margin,
            variant
        } = this.props;

        const containerClasses = classNames(
            styles.container,
            alignment === 'left' && styles.alignLeft,
            variant === 'dark' && styles.dark
        );

        return (
            <header
                style={margin ? {marginBottom: margin} : {}}
                className={containerClasses}>
                <div style={{color: themeColor}} className={styles.icon}>
                    <Icon name={icon} />
                </div>
                <h3 className={styles.title}>{title}</h3>
                {description ? (
                    <p className={styles.description}>{description}</p>
                ) : null}
            </header>
        );
    }
}