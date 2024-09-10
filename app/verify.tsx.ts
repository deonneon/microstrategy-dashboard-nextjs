import { useEffect, useState } from "react";
import Script from "next/script";

const MicroStrategyAuth: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptLoaded) return;

    const baseServerUrl = "https://demo.microstrategy.com";
    const libraryName = "MicroStrategyLibraryInsights";

    const createAuthToken = async (): Promise<string | null> => {
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
          console.log("LDAP login successful");
          return response.headers.get("x-mstr-authtoken");
        }
        console.log("Failed to create auth token. Status:", response.status);
        const json = await response.json();
        console.log("Error details:", json);
        return null;
      } catch (error) {
        console.error("LDAP Login failed:", error);
        return null;
      }
    };

    const getAndVerifyToken = async () => {
      const token = await createAuthToken();
      if (token) {
        setAuthToken(token);
        console.log("Auth token obtained:", token);
      } else {
        console.log("Failed to obtain auth token");
      }
    };

    getAndVerifyToken();
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
      {authToken ? (
        <p>Authentication token obtained successfully</p>
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </>
  );
};

export default MicroStrategyAuth;
