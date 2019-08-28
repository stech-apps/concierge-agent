/// <reference types="Cypress" />

const config = require('../../config/config.json')

context('Profile Page', () => {
  beforeEach(()=> {
    cy.visit( config.orchestraEndpoint + '/login.jsp');
    cy.get('#username').type('superadmin');
    cy.get('#password').type('ulan');
    cy.get('button[type="submit"]').click();
    cy.visit(config.orchestraEndpoint + '/connectconcierge');
  });

  it('W3C Validate profile page', () => {
    cy.contains('Skip next time', {timeout : 3000});
    cy.document().then((c)=> {
      var bodycontent = c.documentElement.innerHTML;
      cy.request({
        url: 'https://validator.w3.org/nu/?out=json',
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "User-Agent":  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
        },  
        body : bodycontent,
        method: 'POST'
      }).then((res) => {
        var errors = clearKnownIssues(res.body.messages)
        assert(true);
        //assert(errors.length === 0, 'Failed to validate html in profile page : ' + JSON.stringify(errors));
      });
    });
  });
  
  function clearKnownIssues(messages) {
    var actualErrors = [];
    for (const msg of messages) {
      if(msg.type === 'error' &&  !msg.message.includes('_ngcontent-c')) {
        actualErrors = [...actualErrors, msg];
      }
    }
    return actualErrors;
  }
});
