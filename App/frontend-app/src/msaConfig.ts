// msalConfig.ts
import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: "f9553678-94e9-433b-b847-f1151e144351", //import.meta.env.VITE_MSAL_AUTH_CLIENTID,//"f9553678-94e9-433b-b847-f1151e144351",
    authority: "https://login.microsoftonline.com/52b39610-0746-4c25-a83d-d4f89fadedfe", //import.meta.env.VITE_MSAL_AUTH_AUTHORITY,// "https://login.microsoftonline.com/52b39610-0746-4c25-a83d-d4f89fadedfe",
    redirectUri: "http://localhost:5900" //i
  },
  cache: {
    cacheLocation: 'localStorage', // Use localStorage for persistent cache
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === LogLevel.Error) console.error(message);
        if (level === LogLevel.Info) console.info(message);
        if (level === LogLevel.Verbose) console.debug(message);
        if (level === LogLevel.Warning) console.warn(message);
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
