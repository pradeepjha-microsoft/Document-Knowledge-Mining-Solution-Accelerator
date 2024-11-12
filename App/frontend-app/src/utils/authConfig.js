import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_AUTH_CLIENTID,// "eb24479c-61d0-4bff-8bf0-c86f1c481ea5",//"926d0e34-f19a-4ff7-8187-e2403d10c0e6",
        authority: import.meta.env.VITE_MSAL_AUTH_AUTHORITY,// "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47",
        redirectUri: import.meta.env.VITE_MSAL_AUTH_REDIRECTURI// "https://localhost:5173",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
};

export const loginRequest = {
    scopes: ["openid", "profile", import.meta.env.VITE_MSAL_LOGIN_SCOPE, "User.Read"]
};

export const tokenRequest = {
    scopes: [import.meta.env.VITE_MSAL_LOGIN_SCOPE],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const graphTokenRequest = {
    scopes: ["User.Read"]
};
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
export const apiEndPoint = import.meta.env.VITE_API_URL;// "https://localhost:7230";
