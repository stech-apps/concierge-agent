/// <reference types="Cypress" />


const config = require('../../config/config.json');
const validationHelper = require('../../helpers/validation-helper');

context('Profile Page', () => {
  beforeEach(()=> {
    cy.visit( config.orchestraEndpoint + '/login.jsp');
    cy.get('#username').type('superadmin');
    cy.get('#password').type('ulan');
    cy.get('button[type="submit"]').click();
    cy.visit(config.orchestraEndpoint + '/connectconcierge');
  });

  afterEach(()=> {
    cy.visit( config.orchestraEndpoint + '/logout.jsp');
  });

  it('Axe validations', () => {
    cy.contains('Skip next time', {timeout : 3000});
    cy
      .window().then((win) => {
        var window = win;
        window.eval(axe.source);
        return window.axe.run();
      }).then((res) => {
        assert(res.violations.length === 0 , validationHelper.formatWcagMessages(res));
      });  
  });
});
