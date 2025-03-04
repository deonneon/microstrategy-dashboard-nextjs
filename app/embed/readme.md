# notes

The Embedding SDK establishes a new session with the MicroStrategy server programmatically rather than relying on a preconstructed URL or browser cookies. It needs to authenticate to create this session, which is why you explicitly provide credentials (e.g., via customAuthentication) or configure an authentication workflow.

Check and Adjust Security Headers

What to Do: Use your browser's developer tools (e.g., press F12, go to the Network tab) to inspect the HTTP response headers when loading the Library dashboard URL in the iframe.
What to Look For:
X-Frame-Options: If set to DENY or SAMEORIGIN, it blocks embedding from Confluence.
Content-Security-Policy: Look for directives like frame-ancestors that restrict which domains can embed the content.
Fix It:
MicroStrategy Library Server: If the Library server sets restrictive headers, contact your MicroStrategy administrator to modify the server configuration (e.g., in the web server settings like Tomcat) to allow framing from your Confluence domain (e.g., set X-Frame-Options: ALLOW-FROM https://your-confluence-domain.com).
Identity Provider: Check if the IdP login page (e.g., Okta, Azure AD) blocks framing. Some IdPs allow you to whitelist trusted domains—adjust this setting if possible.
Why It Helps: Allowing the iframe to load both the IdP login and Library dashboard should let the SSO flow complete.
