import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {sanitizeAttributeValue} from '../../utilities/sanitize';
// Components
import Helmet from 'react-helmet';

/**
 * Head Presenter
 */
export default class HeadPresenter extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        script: PropTypes.array,
        link: PropTypes.array,
        meta: PropTypes.array,
        preload: PropTypes.array
    };

    get sanitizedMeta() {
        const { meta } = this.props;
        return meta && meta.map(item =>
            'content' in item ? { ...item, content: sanitizeAttributeValue(item.content) } : item
        );
    }

    render() {
        const {
            title,
            script,
            link
        } = this.props;

        return (
            <Helmet
                title={title}
                script={script}
                link={link}
                meta={this.sanitizedMeta} />
        );
    }
}
