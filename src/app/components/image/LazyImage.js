import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Styles
import styles from './image.css';

const optimizeImagePath = (url='') => {
    if (!url.includes('.imgix.net')) {
        return url;
    }

    if (url.includes('auto=format,compress')) {
        return url;
    }

    if (url.includes('?')) {
        return `${url}&auto=format,compress`;
    }

    return `${url}?auto=format,compress`;
};

export default class LazyImage extends PureComponent {
    static propTypes = {
        alt: PropTypes.string,
        src: PropTypes.string.isRequired,
        srcSet: PropTypes.string,
        className: PropTypes.string
    };

    references = {};

    componentDidMount() {
        this.setObserver();
    }

    setObserver = () => {
        observeAndApplyImageWhenInViewport(this.references.image);
    };

    componentWillUnmount() {
        unobserve(this.references.image);
        setImmediate(() => this.nextBase = null); // HACK: See https://github.com/developit/preact/issues/957
        this.references.image = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src || nextProps.srcSet !== this.props.srcSet) {
            unobserve(this.references.image);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.src !== this.props.src || prevProps.srcSet !== this.props.srcSet) {
            this.setObserver();
        }
    }

    render() {
        const {
            alt,
            src,
            srcSet,
            className,
            ...props
        } = this.props;

        return (
            <div key={src}>
                <noscript dangerouslySetInnerHTML={{
                    __html: `<img alt="${alt || ''}" src="${src}" ${srcSet ? `srcset="${srcSet}"` : ''} ${props.itemProp ? `itemprop="${props.itemProp}"` : ''} />`
                }} />
                <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    key={srcSet || src}
                    ref={c => this.references.image = c}
                    alt={alt}
                    data-src={optimizeImagePath(src)}
                    data-srcset={srcSet}
                    className={classNames(styles.lazy, className)}
                    style={{opacity: 0}}
                    {...props} />
            </div>
        );
    }
}

// -- helpers --

const observeAndApplyImageWhenInViewport = element => element && observer().observe(element);

const unobserve = element => element && observer().unobserve(element);

let _observer = null;

const observer = () => _observer || (_observer = new IntersectionObserver(callback, {
    rootMargin: '100px 0px',
    threshold: 0.01
}));

function fadeInImage(image) {
    image.onload = null;
    image.onerror = null;

    return requestAnimationFrame(() => image.style.opacity = 1);
}

function callback(entries, observer) {
    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        }

        observer.unobserve(entry.target);
        applyImage(entry.target);
    });
}

function applyImage(image) {
    image.onload = () => fadeInImage(image);
    image.onerror = () => fadeInImage(image);
    if (image.getAttribute('data-srcset')) {
        image.setAttribute('srcset', image.getAttribute('data-srcset'));
    }

    image.setAttribute('src', image.getAttribute('data-src'));

    if (image.hasAttribute('width')) {
        image.removeAttribute('width');
    }

    if (image.hasAttribute('height')) {
        image.removeAttribute('height');
    }
}