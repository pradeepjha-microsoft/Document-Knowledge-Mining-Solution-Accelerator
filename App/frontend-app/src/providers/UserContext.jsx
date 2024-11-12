// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserInfo } from '../utils/msGraph';
import { apiEndPoint } from "../authConfig";
import { TokenContext } from './TokenProvider';

const UserContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { accessToken, graphToken } = useContext(TokenContext);

    useEffect(() => {
        const fetchUserAndSync = async () => {
            if (!accessToken || !graphToken) {
                setLoading(false);
                return;
            }

            try {
                const userInfo = await getUserInfo();

                const headers = new Headers();
                const bearer = `Bearer ${accessToken}`;
                headers.append("Authorization", bearer);
                headers.append("Content-Type", 'application/json');

                const user = {
                    DisplayName: userInfo.displayName,
                    Name: userInfo.givenName ? userInfo.givenName : userInfo.displayName,
                    Region: userInfo.officeLocation ? userInfo.officeLocation : "",
                    PrincipalName: userInfo.userPrincipalName,
                    JobRole: userInfo.jobTitle ? userInfo.jobTitle : ""
                };

                const response = await fetch(`${apiEndPoint}/User/SyncUser`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Failed to sync user with backend');
                }

                const syncedUser = await response.json();
                const userContext = { ...syncedUser };
                setUser(userContext);
            } catch (error) {
                console.error('Failed to fetch and sync user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndSync();
    }, [accessToken, graphToken]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
