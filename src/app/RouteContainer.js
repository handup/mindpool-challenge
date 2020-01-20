import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * The RouteContainer determines whether to rerender the route or let it be as is.
 * If current state is "preventRouteRerender"; don't rerender.
 */
export default class RouteContainer extends Component {
    static propTypes = {
        children: PropTypes.node,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.shouldScrollToTop = true;
    }

    componentWillReceiveProps(nextProps) {
        const isSafe = location => location.state ? !location.state.preventRouteRerender && !location.state.restoreScrollTo : true;
        this.shouldScrollToTop = isSafe(this.props.location) && isSafe(nextProps.location);
    }

    shouldComponentUpdate(nextProps) {
        const { state } = nextProps.location;
        return state ? !state.preventRouteRerender : true;
    }

    componentDidUpdate() {
        if (this.shouldScrollToTop) {
            this.scrollToTop();
        }
    }

    /**
     * @name scrollToTop
     */
    scrollToTop() {
        if (typeof document === 'undefined') {
            return;
        }

        requestAnimationFrame(() => {
            if (document.body.scrollTop) {
                return document.body.scrollTop = 0;
            }

            return document.documentElement.scrollTop = 0;
        });
    }

    render() {
        return this.props.children;
    }
}