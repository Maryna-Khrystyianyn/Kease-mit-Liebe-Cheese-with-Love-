describe("Protected routes", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/me", {
      statusCode: 200,
      body: { user: null },
    });
  });

  it("redirects to /login when no token", () => {
    cy.clearCookie("token");
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/login");
  });

 
});
