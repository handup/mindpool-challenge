import React from 'react';
import {
    IndexRoute,
    Route
} from 'react-router';
import RouteContainer from './app/RouteContainer';
// Containers
import AppContainer from './app/containers/app/App';
import HomeContainer from './app/containers/home/RouteHome';
// Error
import NotFoundContainer from './app/containers/NotFound';

export default (
    <Route>
        <Route path="/">
            <Route component={RouteContainer}>
                <Route
                    name="app"
                    component={AppContainer}>
                    {/* Home Page */}
                    <IndexRoute
                        name="home"
                        component={HomeContainer} />
                </Route>

                <Route
                    path="*"
                    component={NotFoundContainer}
                    status={404} />
            </Route>
        </Route>
    </Route>
);
