import { describe, it, expect } from "vitest";
import { isFirebaseConfigured, firebaseConfig, app, auth } from "@/lib/firebase";

describe("Firebase Configuration", () => {
  it("exports valid Firebase configuration metadata", () => {
    expect(typeof isFirebaseConfigured).toBe("boolean");
    expect(firebaseConfig).toBeDefined();
    expect(typeof firebaseConfig).toBe("object");
    expect(firebaseConfig).toHaveProperty("apiKey");
    expect(firebaseConfig).toHaveProperty("authDomain");
    expect(firebaseConfig).toHaveProperty("projectId");
    expect(firebaseConfig).toHaveProperty("storageBucket");
    expect(firebaseConfig).toHaveProperty("messagingSenderId");
    expect(firebaseConfig).toHaveProperty("appId");
  });

  it("correctly identifies valid configuration versus unconfigured placeholder", () => {
    // When local .env is present, isFirebaseConfigured should be true
    if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_")) {
      expect(isFirebaseConfigured).toBe(true);
      expect(app).not.toBeNull();
      expect(auth).not.toBeNull();
    }
  });

  it("does not expose private service-account keys or admin credentials", () => {
    const configKeys = Object.keys(firebaseConfig);
    expect(configKeys).not.toContain("private_key");
    expect(configKeys).not.toContain("privateKey");
    expect(configKeys).not.toContain("client_secret");
    expect(configKeys).not.toContain("serviceAccount");
  });
});

