import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Components
import {Link} from 'react-router';
import HeadPresenter from '../../components/Head';
import HTTPStatus from '../../components/http/HTTPStatus';
import Hero from '../../components/hero/Hero';
// Styles

const StatusMessages = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Page not found'
};

const DefaultStatusMessage = 'Something went wrong';

export class HTTPErrorController extends PureComponent {
    static propTypes = {
        code: PropTypes.number,
        headline: PropTypes.string,
        description: PropTypes.string
    };

    static defaultProps = {
        code: 500,
        description: `Ooops, something went wrong`
    };
    render() {
        const {
            code,
            headline
        } = this.props;

        const title = headline || StatusMessages[code] || DefaultStatusMessage;

        return (
            <HTTPStatus code={code}>
                <div>
                    <HeadPresenter title={title} />
                    <Hero
                        category={code}
                        image="http://placeimg.com/640/480/nature"
                        title={headline || 'Oh no,\nbrain freeze'} />
                </div>
            </HTTPStatus>
        );
    }
}

/**
 * The regular `Link` component will not render a `href` attribute if no router
 * context is available, like if we statically render a single component.
 * This wrapper provides `href` fallback for that situation.
 */
const LinkWithFallback = ({ to, ...props }) => <Link
    to={to}
    href={to}
    {...props}
/>;

LinkWithFallback.propTypes = {
    to: PropTypes.string.isRequired
};

/**
 * Default export
 */
export default HTTPErrorController;
