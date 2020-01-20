import { Children } from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

function reducePropsToState(propsList) {
    return propsList.reduce((acc, props) => ({
        ...acc,
        ...props
    }), {});
}

function handleStateChangeOnClient(state) {
    return state;
}

const HTTPCache = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(({ children }) => children ? Children.only(children) : null);

HTTPCache.propTypes = {
    children: PropTypes.node,
    expires: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.instanceOf(Date)
    ]),
    maxAge: PropTypes.number,
};

const getFinalState = HTTPCache.rewind;

HTTPCache.rewind = function() {
    const { expires, maxAge } = getFinalState() || {};
    return {
        ...parseExpires(expires),
        ...parseCacheControl(maxAge)
    };
};

function parseExpires(expires) {
    if (typeof expires === 'number' || expires instanceof Date) {
        return {
            'Expires': new Date(expires).toUTCString()
        };
    } else {
        return null;
    }
}

function parseCacheControl(maxAge) {
    if (typeof maxAge === 'number') {
        return {
            'Cache-Control': `max-age=${maxAge}`
        };
    } else {
        return null;
    }
}

export default HTTPCache;
