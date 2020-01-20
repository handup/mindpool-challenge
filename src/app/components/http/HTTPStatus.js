import { Children } from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

const defaultCode = 200;

function reducePropsToState(propsList) {
    const innermostProps = propsList[propsList.length - 1];
    return innermostProps && innermostProps.code;
}

function handleStateChangeOnClient(code) {
    return code;
}

const HTTPStatus = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(({ children }) => (children && Children.toArray(children).length) ? Children.only(children) : null);

HTTPStatus.displayName = 'HTTPStatus';

HTTPStatus.propTypes = {
    children: PropTypes.node,
    code: PropTypes.number.isRequired
};

const { peek, rewind } = HTTPStatus;

HTTPStatus.peek = function() {
    const code = peek();
    return code || defaultCode;
};

HTTPStatus.rewind = function() {
    const code = rewind();
    return code || defaultCode;
};

export default HTTPStatus;
