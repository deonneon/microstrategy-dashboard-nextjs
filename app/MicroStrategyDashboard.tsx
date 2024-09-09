import React, { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    microstrategy: {
      dossier: {
        create: (config: MicroStrategyConfig) => void;
      };
      serverProxy: {
        login: (config: LoginConfig) => Promise<string>;
        getSessionInfo: () => Promise<SessionInfo>;
      };
    };
  }
}

interface MicroStrategyConfig {
  url: string;
  dossier: string;
  placeholder: string;
  navigationBar: {
    enabled: boolean;
    gotoLibrary: boolean;
    title: boolean;
    toc: true;
    reset: boolean;
    reprompt: boolean;
    share: boolean;
    comment: boolean;
  };
  enableCustomAuthentication?: boolean;
  customAuthenticationType?: string;
  getLoginToken?: () => Promise<string>;
}

interface LoginConfig {
  url: string;
  loginMode: number;
  username: string;
  password: string;
}

interface SessionInfo {
  authToken: string;
}

const MicroStrategyDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const login = async (): Promise<void> => {
      if (window.microstrategy) {
        const loginConfig: LoginConfig = {
          url: "YOUR_MICROSTRATEGY_SERVER_URL",
          loginMode: 1, // 1 for LDAP
          username: "YOUR_LDAP_USERNAME",
          password: "YOUR_LDAP_PASSWORD",
        };

        try {
          await window.microstrategy.serverProxy.login(loginConfig);
          const sessionInfo =
            await window.microstrategy.serverProxy.getSessionInfo();
          setAuthToken(sessionInfo.authToken);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    };

    const initDashboard = (): void => {
      if (window.microstrategy && isLoggedIn && authToken) {
        const config: MicroStrategyConfig = {
          url: "YOUR_MICROSTRATEGY_SERVER_URL",
          dossier: "YOUR_DOSSIER_ID",
          placeholder: "dossier-container",
          navigationBar: {
            enabled: true,
            gotoLibrary: true,
            title: true,
            toc: true,
            reset: true,
            reprompt: true,
            share: true,
            comment: true,
          },
          enableCustomAuthentication: true,
          customAuthenticationType: "token",
          getLoginToken: async () => authToken,
        };
        window.microstrategy.dossier.create(config);
      }
    };

    if (window.microstrategy) {
      login().then(() => {
        if (isLoggedIn && authToken) {
          initDashboard();
        }
      });
    }
  }, [isLoggedIn, authToken]);

  return (
    <>
      <Script
        src="https://env-XXXXX.customer.cloud.microstrategy.com/MicroStrategyLibrary/javascript/embeddinglib.js"
        strategy="lazyOnload"
      />
      {isLoggedIn ? (
        <div
          id="dossier-container"
          style={{ width: "100%", height: "600px" }}
        ></div>
      ) : (
        <div>Logging in...</div>
      )}
    </>
  );
};

export default MicroStrategyDashboard;
