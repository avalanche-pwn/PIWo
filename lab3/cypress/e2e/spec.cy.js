describe('template spec', () => {
  it('Can filter', () => {
    cy.visit('localhost:5173')
    cy.get("input[name='title']").type("Wiedźmin")
    cy.get("div[name='books'] div[class='card-body']").should('have.length', 1)
    cy.get("div[name='books'] div[class='card-body']>h5").should('have.text', "Wiedźmin")
  })
  it('Can add book', () => {
    cy.visit('localhost:5173')
    cy.contains("a[class='nav-link']", 'Nowa książka').click()
    cy.get("input[name='title']").type("Cypress")
    cy.get("input[name='author']").type("bot")
    cy.get("input[name='year']").type("1999")
    cy.get("input[name='price']").type("2000")
    cy.get("button[type='submit']").click()

    cy.contains("div[name='books'] div[class='card-body']>h5", "Cypress").parent().within(() => {
      cy.contains("p[class='card-text']", "Autor: bot").should("exist")
      cy.contains("p[class='card-text']", "Rok wydania: 1999").should("exist")
    })
  })
  it('Can remove book', () => {
    cy.visit('localhost:5173')
    cy.contains("div[name='books'] div[class='card-body']>h5", "Wiedźmin").parent().within(() => {
      cy.contains("button", "Usuń").click()
    })
    cy.contains("div[name='books'] div[class='card-body']>h5", "Wiedźmin").should("not.exist")
  })
})
