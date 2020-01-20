import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Components
import LazyImage from './LazyImage';

export default class MaybeLazyImage extends PureComponent {
    static propTypes = {
        lazy: PropTypes.bool,
        src: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired
    };

    static defaultProps = {
        lazy: true
    };

    componentWillUnmount() {
        setImmediate(() => this.nextBase = null); // HACK: See https://github.com/developit/preact/issues/957
    }

    render() {
        const {
            lazy,
            src,
            alt,
            ...props
        } = this.props;

        return lazy ? (
            <LazyImage
                src={src}
                alt={alt}
                {...props} />
        ) : (
            <img
                key={`real.${src}`}
                src={src}
                alt={alt ? alt.replace(/\n\s*/g, ' ') : alt}
                {...props} />
        );
    }
}