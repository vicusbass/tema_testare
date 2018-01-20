// Suita de teste va verifica :
// - Moodle authentication (negative si positive tests)
// - validitatea linkurilor din cursul de testare

//SELECTORS
const USERNAME_INPUT = 'input#username'
const PASSWORD_INPUT = 'input#password'
const LOGIN_BUTTON = 'input#loginbtn'
const LOGIN_ERROR_FIELD = 'a#loginerrormessage'

describe('Moodle site - Testing course', function () {
    context('Load initial page', function () {
        beforeEach(function () {
            //open initial page
            cy.visit('http://bis.econ.ubbcluj.ro/moodle/?lang=ro')
            //validate page title
            cy.title().should('be', 'BIS E-Learning')
        })

        it('should switch language to English', function () {
            //change language to English

            //open language dropdown
            cy.get('a[title="Limba"]').click()
            //select English
            cy.contains('English').click()
            //url should be based on English locale
            cy.url().should('eq', 'http://bis.econ.ubbcluj.ro/moodle/?lang=en')
            //authentication labels should be in English
            cy.contains('You are not logged in.')
            //main <h2> tag should be in English
            cy.get('#frontpage-course-list > h2').should('have.text', 'Available courses')
        })

        it('should reject missing password', function () {
            //check: no user should be authenticated
            cy.contains('Nu sunteţi autentificat.')
            //go to Login page
            cy.contains('Autentificare').click()
            //type invalid username
            cy.get(USERNAME_INPUT).type("should not work")
            cy.get(LOGIN_BUTTON).click()
            //should be on the same page
            cy.url().should('eq', 'http://bis.econ.ubbcluj.ro/moodle/login/index.php')
            //error message is displayed
            cy.get(LOGIN_ERROR_FIELD).should('have.text', 'Autentificare invalidă, vă rugăm încercaţi din nou')
        })

        it('should reject invalid password', function () {
            //check: no user should be authenticated
            cy.contains('Nu sunteţi autentificat.')
            //go to Login page
            cy.contains('Autentificare').click()
            //type valid username and invalid password
            cy.get(USERNAME_INPUT).type("vasile.pop")
            cy.get(PASSWORD_INPUT).type("definetely NOT good")
            cy.get(LOGIN_BUTTON).click()
            //should be on the same page
            cy.url().should('eq', 'http://bis.econ.ubbcluj.ro/moodle/login/index.php')
            //error message is displayed
            cy.get(LOGIN_ERROR_FIELD).should('have.text', 'Autentificare invalidă, vă rugăm încercaţi din nou')
        })

        it('validate course links', function () {
            //go to Login page
            cy.contains('Autentificare').click()
            //type valid username and valid password
            cy.get(USERNAME_INPUT).type("vasile.pop")
            cy.get(PASSWORD_INPUT).type("vodafone")
            cy.get(LOGIN_BUTTON).click()
            //should be logged in
            cy.url().should('eq', 'http://bis.econ.ubbcluj.ro/moodle/my/')
            cy.get('span.usertext').should('have.text', 'Vasile Pop')
            cy.get('.page-header-headings > h1').should('have.text', 'Vasile Pop')
            //go to testing course
            cy.get('li.type_course a[title="TESTAREA PRODUSELOR SOFT 2017"]').click()
            //validate course page header
            cy.get('.page-header-headings > h1').should('have.text', 'TESTAREA PRODUSELOR SOFT 2017')
            //get all topics
            cy.get('ul.topics > li a')
                .each(($el) => {
                    //process each anchor in each topic
                    //get href for each anchor and check if the request will return 200
                    cy.request($el.attr('href')).its('status').should('eq', 200)
                })
        })
    })

})
