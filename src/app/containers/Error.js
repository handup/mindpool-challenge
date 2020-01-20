import React, {PureComponent} from 'react';
// Components
import HeadPresenter from '../components/Head';
import HTTPErrorController from '../controllers/http_error/HTTPError';

/**
 * @name Error Container
 */
export default class ErrorContainer extends PureComponent {
    render() {
        return (
            <div>
                <HeadPresenter title="500 - Internal Server Error" />

                <HTTPErrorController code={500} />
            </div>
        );
    }
}

