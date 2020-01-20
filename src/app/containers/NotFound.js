import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// Components
import HeadPresenter from '../components/Head';
import HTTPErrorController from '../controllers/http_error/HTTPError';

/**
 * @name NotFound Container
 */
export default class NotFoundContainer extends PureComponent {
    static propTypes = {
        state: PropTypes.object
    };

    render() {
        return (
            <div>
                <HeadPresenter title="404 Page Not Found" />

                <HTTPErrorController code={404} />
            </div>
        );
    }
}
