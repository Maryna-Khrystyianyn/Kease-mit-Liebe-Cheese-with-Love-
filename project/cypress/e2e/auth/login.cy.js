describe("Login flow", () => {
    beforeEach(() => {
      // Мокаємо перевірку авторизації
      cy.intercept("GET", "/api/me", {
        statusCode: 200,
        body: { user: null },
      }).as("me");
  
      cy.visit("/login");
      cy.wait("@me"); // чекаємо поки UI стане стабільним
    });
  
    it("Successful login with correct data", () => {
      cy.intercept("POST", "/api/login", {
        statusCode: 200,
        body: { message: "Login erfolgreich!" },
      }).as("login");
  
      cy.get('input[name="email"]').should("not.be.disabled").type("valid@example.com");
      cy.get('input[name="password"]').type("correctPassword123");
  
      cy.get('button[type="submit"]').click();
  
      cy.wait("@login");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
  
    it("Error with incorrect password", () => {
      cy.intercept("POST", "/api/login", {
        statusCode: 401,
        body: { message: "Falsches Passwort" },
      }).as("login");
  
      cy.get('input[name="email"]').should("not.be.disabled").type("valid@example.com");
      cy.get('input[name="password"]').type("wrongPassword");
  
      cy.get('button[type="submit"]').click();
  
      cy.wait("@login");
      cy.contains("Falsches Passwort").should("be.visible");
    });
  
    it("Error with invalid email", () => {
      cy.intercept("POST", "/api/login", {
        statusCode: 404,
        body: { message: "Benutzer nicht gefunden" },
      }).as("login");
  
      cy.get('input[name="email"]').should("not.be.disabled").type("unknown@example.com");
      cy.get('input[name="password"]').type("anyPassword");
  
      cy.get('button[type="submit"]').click();
  
      cy.wait("@login");
      cy.contains("Benutzer nicht gefunden").should("be.visible");
    });
  });
  