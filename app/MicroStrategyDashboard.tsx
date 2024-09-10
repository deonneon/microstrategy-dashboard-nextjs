import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    microstrategy: any;
  }
}

const MicroStrategyDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const baseServerUrl = "https://demo.microstrategy.com";
    const libraryName = "MicroStrategyLibraryInsights";
    const url = `${baseServerUrl}/${libraryName}/app/EC70648611E7A2F962E90080EFD58751/837B57D711E941BF000000806FA1298F`;

    let dashboard: any;

    const verifyAuthToken = async (token: string): Promise<boolean> => {
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "content-type": "application/json",
          "X-MSTR-AuthToken": token,
        },
      };

      try {
        const response = await fetch(
          `${baseServerUrl}/${libraryName}/api/sessions`,
          options
        );
        return response.ok;
      } catch (error) {
        console.error("Failed to verify auth token:", error);
        return false;
      }
    };

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
        if (response.ok) {
          const token = response.headers.get("x-mstr-authtoken") ?? undefined;
          if (token && (await verifyAuthToken(token))) {
            console.log("Existing auth token verified successfully");
            return token;
          }
          console.log("Existing auth token failed verification");
        }
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
          const token = response.headers.get("x-mstr-authtoken") ?? undefined;
          if (token && (await verifyAuthToken(token))) {
            console.log("New auth token created and verified successfully");
            return token;
          }
          console.log("New auth token failed verification");
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
      let token = await getAuthToken();
      if (!token) {
        console.log("No existing session found, creating new auth token...");
        token = await createAuthToken();
      }
      if (token) {
        setAuthToken(token);
        return token;
      }
      console.log("Failed to obtain valid auth token");
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
        getLoginToken: () => Promise.resolve(authToken),
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

    if (window.microstrategy && authToken) {
      initDashboard();
    } else if (window.microstrategy) {
      login();
    }
  }, [authToken]);

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
