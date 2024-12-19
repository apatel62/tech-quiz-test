describe('React Tech Quiz', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    cy.visit('http://localhost:3001/');
  });

  it('should show the Start Quiz button initially', () => {
    cy.get('button').contains('Start Quiz').should('be.visible');
  });

  it('should start the quiz when the Start Quiz button is clicked', () => {
    cy.get('button').contains('Start Quiz').click();
  });

  it('should display current question and choices', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.fixture('questions').then((fixture) => {
      const currentQuestion = fixture[0];
      cy.get('div h2').should('contain.text',currentQuestion.question);
      currentQuestion.answers.forEach((/** @type {{ text: string; isCorrect: boolean}} */ answer, /** @type {number} */ index) => {
        cy.get('.alert.alert-secondary').eq(index) 
          .should('contain.text', answer.text); 
      });

    });
  });

  it('should display the quiz completed screen after the incorrect answer selected', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.fixture('questions').then((fixture) => {
      const totalQuestions = fixture.length;
      cy.get('button.btn.btn-primary').eq(0).click(); // Clicks the first button
      cy.get('h2').should('contain.text', 'Quiz Completed');  // Ensure quiz completion
      cy.get('.alert.alert-success').should('contain.text', `Your score: 0/${totalQuestions}`);
    });
  });

  it('should display the quiz completed screen after the correct answer selected', () => {
    cy.get('button').contains('Start Quiz').click();
    cy.wait(500);  //waits 500 ms for question & choices to load
    cy.fixture('questions').then((fixture) => {
      const totalQuestions = fixture.length;
      cy.get('button.btn.btn-primary').eq(1).click(); // Clicks the second button
      cy.get('h2').should('contain.text', 'Quiz Completed');  // Ensure quiz completion
      cy.get('.alert.alert-success').should('contain.text', `Your score: 1/${totalQuestions}`);
    });
  });

}); 