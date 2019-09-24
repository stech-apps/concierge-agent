/// <reference types="Cypress" />



const config = require('../../config/config.json')
const axe = require('axe-core');
const validationHelper = require('../../helpers/validation-helper');

context('Concierge Create Visit Page', () => {
  beforeEach(()=> {
    cy.visit( config.orchestraEndpoint + '/login.jsp');
    cy.get('#username').type('superadmin');
    cy.get('#password').type('ulan');
    cy.get('button[type="submit"]').click();
    cy.visit(config.orchestraEndpoint + '/connectconcierge');
    if(cy.get('.qm-profile-ok').length > 0) {
      cy.get('.qm-profile-ok').click();
    }
    cy.get('qm-home-menu  button').eq(3).click();
  });

  afterEach(()=> {
    cy.visit( config.orchestraEndpoint + '/logout.jsp');
  });

  it('Validations in create visit page', function() {
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
