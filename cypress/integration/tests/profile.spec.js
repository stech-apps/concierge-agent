/// <reference types="Cypress" />

context('Profile Page', () => {
  beforeEach(()=> {
    cy.visit('http://localhost:8080/login.jsp');
    cy.get('#username').type('superadmin');
    cy.get('#password').type('ulan');
    cy.get('button[type="submit"]').click();
    cy.visit('http://localhost:8080/connectconcierge');
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
        assert(errors.length === 0, 'Failed to validate html in profile page : ' + JSON.stringify(errors));
      });
    });
  });
  
  function clearKnownIssues(messages) {
    var presentErrors = [];
    for (const msg of messages) {
      if(msg.type === 'error' &&  !msg.message.includes('_ngcontent-c')) {
        presentErrors = [...presentErrors, msg];
      }
    }
    return presentErrors;
  }
});
