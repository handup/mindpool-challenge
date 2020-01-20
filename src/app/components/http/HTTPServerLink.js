import { Children } from 'react';
import PropTypes from 'prop-types';
import withSideEffect from 'react-side-effect';

function reducePropsToState(propsList) {
    return propsList.reduce((result, props) => ([
        ...result,
        ...props.link
    ]), []);
}

function handleStateChangeOnClient(code) {
    return code;
}

const HTTPServerLink = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(({ children }) => (children && Children.toArray(children).length) ? Children.only(children) : null);

HTTPServerLink.displayName = 'HTTPServerLink';

HTTPServerLink.propTypes = {
    children: PropTypes.node,
    link: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        rel: PropTypes.string,
        as: PropTypes.string,
        type: PropTypes.string
    })).isRequired
};

export default HTTPServerLink;
