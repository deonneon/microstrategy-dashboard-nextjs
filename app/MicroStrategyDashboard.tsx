import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    microstrategy: any;
  }
}

const MicroStrategyDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseServerUrl = "https://demo.microstrategy.com";
    const libraryName = "MicroStrategyLibraryInsights";
    const url = `${baseServerUrl}/${libraryName}/app/EC70648611E7A2F962E90080EFD58751/837B57D711E941BF000000806FA1298F`;

    let dashboard: any;

    const getAuthToken = async (): Promise<string | undefined> => {
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: { "content-type": "application/json" },
      };

      try {
        const response = await fetch(
          `${baseServerUrl}/${libraryName}/api/auth/token`,
          options
        );
        if (response.ok)
          return response.headers.get("x-mstr-authtoken") ?? undefined;
        console.log(
          "Failed to get existing auth token. Status:",
          response.status
        );
        return undefined;
      } catch (error) {
        console.error("Failed to retrieve authToken with error:", error);
        return undefined;
      }
    };

    const createAuthToken = async (): Promise<string | undefined> => {
      const options: RequestInit = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          loginMode: 1,
          username: prompt("Please enter your username"),
          password: prompt("Please enter your password"),
        }),
      };

      try {
        const response = await fetch(
          `${baseServerUrl}/${libraryName}/api/auth/login`,
          options
        );
        if (response.ok) {
          console.log(
            "A new standard login session has been created successfully"
          );
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
        console.error("Failed Standard Login with error:", error);
        return undefined;
      }
    };

    const login = async (): Promise<string | undefined> => {
      console.log("Attempting to log in...");
      let authToken = await getAuthToken();
      if (authToken) {
        console.log("An existing login session has been found, logging in");
        return authToken;
      }
      console.log("No existing session found, creating new auth token...");
      authToken = await createAuthToken();
      if (authToken) {
        console.log("Successfully created new auth token");
        return authToken;
      }
      console.log("Failed to create new auth token");
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
  }, []);

  return (
    <>
      <Script
        src="https://demo.microstrategy.com/MicroStrategyLibraryInsights/javascript/embeddinglib.js"
        onLoad={() => console.log("MicroStrategy script loaded")}
      />
      <div ref={containerRef} id="embedding-dossier-container"></div>
    </>
  );
};

export default MicroStrategyDashboard;
