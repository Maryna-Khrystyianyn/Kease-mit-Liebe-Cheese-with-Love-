import { defineConfig } from "cypress";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret"; 

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
  
      on("task", {
        createToken(payload: Record<string, any>) {
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
          return token;
        },
      });

      return config;
    },
  },
});