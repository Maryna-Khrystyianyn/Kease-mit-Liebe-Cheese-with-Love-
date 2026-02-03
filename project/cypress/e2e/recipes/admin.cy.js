describe("Recipes page — admin", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/me", {
      fixture: "me-admin.json",
    }).as("me")

    cy.intercept("GET", "**/api/recipes", {
      fixture: "recipes-mix.json",
    }).as("recipes")

    cy.visit("/recipe")
    cy.wait(["@me", "@recipes"])
  })

  it("admin sees draft recipes", () => {
    cy.contains("Geheimer Käse").should("exist")
    cy.contains("ENTWURF").should("exist")
  })
})