import React, { useContext } from 'react';
import Navigation from './Navigation.js';
import { AuthContext } from './context/AuthContext.js';

function AppNav({ }) {
    const { userToken } = useContext(AuthContext);

    return (
        userToken !== null ? <Navigation initial='Dashboard' /> : <Navigation initial='Main' />
    );
}

export default AppNav;