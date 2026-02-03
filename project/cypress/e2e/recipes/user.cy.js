describe("Recipes page — user", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/me", {
        fixture: "me-user.json",
      }).as("me")
  
      cy.intercept("GET", "**/api/recipes", {
        fixture: "recipes-mix.json",
      }).as("recipes")
  
      cy.visit("/recipe")
      cy.wait(["@me", "@recipes"])
    })
  
    it("user does not see draft recipes", () => {
      cy.contains("Geheimer Käse").should("not.exist")
      cy.contains("ENTWURF").should("not.exist")
    })
  })