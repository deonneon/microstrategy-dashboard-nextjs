import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    microstrategy: any;
  }
}

const MicroStrategyDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) return;

    const baseServerUrl = "https://demo.microstrategy.com";
    const libraryName = "MicroStrategyLibraryInsights";
    const url = `${baseServerUrl}/${libraryName}/app/EC70648611E7A2F962E90080EFD58751/837B57D711E941BF000000806FA1298F`;

    let dashboard: any;

    const createAuthToken = async (): Promise<string | undefined> => {
      const options: RequestInit = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          loginMode: 16,
          username: prompt("Please enter your LDAP username"),
          password: prompt("Please enter your LDAP password"),
        }),
      };

      try {
        const response = await fetch(
          `${baseServerUrl}/${libraryName}/api/auth/login`,
          options
        );
        if (response.ok) {
          console.log("A new LDAP login session has been created successfully");
          return response.headers.get("x-mstr-authtoken") ?? undefined;
        }
        console.log(
          "Failed to create new auth token. Status:",
          response.status
        );
        const json = await response.json();
        console.log("Error details:", json);
        return undefined;
      } catch (error) {
        console.error("Failed LDAP Login with error:", error);
        return undefined;
      }
    };

    const login = async (): Promise<string | undefined> => {
      console.log("Attempting to log in using LDAP...");
      let authToken = await createAuthToken();
      let retries = 3;
      while (!authToken && retries > 0) {
        console.log(`Login failed. Retrying... (${retries} attempts left)`);
        authToken = await createAuthToken();
        retries--;
      }
      if (authToken) {
        console.log("Successfully created new auth token");
        return authToken;
      }
      console.log("Failed to create new auth token after multiple attempts");
      return undefined;
    };

    const initDashboard = async () => {
      if (!containerRef.current || !window.microstrategy) return;

      const config = {
        url: url,
        placeholder: containerRef.current,
        containerHeight: "600px",
        containerWidth: "800px",
        customAuthenticationType:
          window.microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
        enableCustomAuthentication: true,
        enableResponsive: true,
        getLoginToken: login,
        navigationBar: {
          enabled: false,
        },
        errorHandler: (error: any) => {
          console.error("MicroStrategy Dashboard Error:", error);
          // You can add custom error handling here, such as displaying an error message to the user
        },
      };

      try {
        dashboard = await window.microstrategy.dossier.create(config);
        console.log("Dashboard created successfully");
      } catch (error) {
        console.error("Failed to create dashboard:", error);
      }
    };

    if (window.microstrategy) {
      initDashboard();
    }
  }, [scriptLoaded]);

  return (
    <>
      <Script
        src="https://demo.microstrategy.com/MicroStrategyLibraryInsights/javascript/embeddinglib.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("MicroStrategy script loaded");
          setScriptLoaded(true);
        }}
      />
      <div ref={containerRef} id="embedding-dossier-container"></div>
    </>
  );
};

export default MicroStrategyDashboard;
