import { useEffect, useState } from "react";
import Script from "next/script";

const MicroStrategyAuth: React.FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [headerResponse, setHeaderResponse] = useState<Headers | null>(null);
  const [cookieResponse, setCookieResponse] = useState<string | null>(null);

  useEffect(() => {
    const baseServerUrl = "https://demo.microstrategy.com";
    const libraryName = "MicroStrategyLibraryInsights";

    const createAuthToken = async (): Promise<Response | null> => {
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
          return response;
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
      const response = await createAuthToken();
      if (response) {
        const token = response.headers.get("x-mstr-authtoken");
        setAuthToken(token);
        setHeaderResponse(response.headers);
        setCookieResponse(response.headers.get("set-cookie"));
        console.log("Auth token obtained:", token);
        console.log("Headers:", response.headers);
        console.log("Cookies:", response.headers.get("set-cookie"));
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
      />
      {authToken ? (
        <div>
          <p>Authentication token obtained successfully</p>
          <p>Auth Token: {authToken}</p>
          <p>
            Headers:{" "}
            {JSON.stringify(
              Object.fromEntries(headerResponse?.entries() || [])
            )}
          </p>
          <p>Cookies: {cookieResponse}</p>
        </div>
      ) : (
        <p>Waiting for authentication...</p>
      )}
    </>
  );
};

export default MicroStrategyAuth;
