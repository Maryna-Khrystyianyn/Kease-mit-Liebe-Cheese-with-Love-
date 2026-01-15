export async function getAccessToken(): Promise<string> {
  
    const baseUrl = process.env.PAYPAL_BASE_URL; // Sandbox: https://api-m.sandbox.paypal.com, Live: https://api-m.paypal.com
  
    if (!baseUrl) throw new Error("PAYPAL_BASE_URL is not set");
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET)
      throw new Error("PayPal credentials are missing");
  
    
    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PayPal token request failed: ${text}`);
    }
  
    const data = await res.json();
    if (!data.access_token) throw new Error("PayPal did not return access token");
  
    return data.access_token;
  }