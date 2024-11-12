// contexts/TokenContext.js
// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { graphTokenRequest, tokenRequest } from '../authConfig';

const TokenContext = createContext();

// eslint-disable-next-line react/prop-types
const TokenProvider = ({ children }) => {
    const { instance, accounts } = useMsal();
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [graphToken, setGraphToken] = useState(localStorage.getItem('graphToken'));

    const acquireToken = async () => {
        const account = instance.getActiveAccount();
        if (account) {
            try {
                const tokenResponse = await instance.acquireTokenSilent({ ...tokenRequest, account });
                localStorage.setItem('accessToken', tokenResponse.accessToken);
                setAccessToken(tokenResponse.accessToken);

                const graphTokenResponse = await instance.acquireTokenSilent({
                    ...graphTokenRequest,
                    account
                });
                localStorage.setItem('graphToken', graphTokenResponse.accessToken);
                setGraphToken(graphTokenResponse.accessToken);
            } catch (error) {
                console.error('Token acquisition failed:', error);
                // Handle error (e.g., redirect to login page)
            }
        }
    };

    useEffect(() => {
        const refreshToken = async () => {
            await acquireToken();
        };

        if (accounts.length > 0) {
            acquireToken();
            const interval = setInterval(refreshToken, 15 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [accounts, instance]);

    return (
        <TokenContext.Provider value={{ accessToken, graphToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export { TokenContext, TokenProvider };
