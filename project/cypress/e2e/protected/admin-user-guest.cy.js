describe("Admin page access control", () => {
    it("allows admin to access admin page", () => {
      cy.task("createToken", { user_status: "admin" }).then((token) => {
        cy.setCookie("token", token);
        cy.visit("/admin");
        cy.contains("Admin Panel").should("exist");
      });
    });
  
    it("blocks non-admin user", () => {
      cy.task("createToken", { user_status: "user" }).then((token) => {
        cy.setCookie("token", token);
        cy.visit("/admin");
        cy.url().should("include", "/forbidden");
      });
    });
  
    it("redirects unauthenticated user", () => {
      cy.clearCookies();
      cy.visit("/admin");
      cy.url().should("include", "/login");
    });
  });