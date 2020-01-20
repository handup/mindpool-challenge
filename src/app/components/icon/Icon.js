import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// Styles
import styles from './icon.css';

export default class Icon extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired
    };

    render() {
        const {name} = this.props;

        return (
            <svg className={styles.icon}>
                <use xlinkHref={`${'#'}svg-${name}`} />
            </svg>
        );
    }
}