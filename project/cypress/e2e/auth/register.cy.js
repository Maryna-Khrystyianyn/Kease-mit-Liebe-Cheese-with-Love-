describe("Registration flow", () => {
  beforeEach(() => {
   
    cy.intercept("GET", "/api/me", {
      statusCode: 200,
      body: { user: null },
    }).as("me");

    cy.visit("/register");
    cy.wait("@me");
  });

  it("Successful registration", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 200,
      body: {
        message: "Benutzer erfolgreich erstellt!",
        user: { email: "new@example.com", username: "newuser" },
      },
    }).as("register");

    cy.get('input[name="nick_name"]').type("Nick");
    cy.get('input[name="username"]').type("newuser");
    cy.get('input[name="email"]').type("new@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="telefon"]').type("123456789");
    cy.get('input[name="user_address"]').type("Berlin");
    cy.get('textarea[name="mood"]').type("Happy");
    cy.get('textarea[name="info"]').type("Some info");
    cy.get('button[type="submit"]').click();
    cy.wait("@register");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("Error: email already exists", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 400,
      body: { message: "Benutzer mit dieser E-Mail existiert bereits" },
    }).as("register");

    cy.get('input[name="nick_name"]').type("Nick");
    cy.get('input[name="username"]').type("existinguser");
    cy.get('input[name="email"]').type("exists@example.com");
    cy.get('input[name="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.wait("@register");

    cy.contains("Benutzer mit dieser E-Mail existiert bereits").should(
      "be.visible"
    );
  });

  it("Error: missing email or password", () => {
    cy.get('input[name="nick_name"]').type("Nick");
    cy.get('input[name="username"]').type("user123");
    cy.get('button[type="submit"]').click();
    cy.get('input[name="email"]')
      .then(($el) => $el[0].checkValidity())
      .should("be.false");
  });
});
