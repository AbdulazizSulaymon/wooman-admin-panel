import CircleButton from '@components/circle-button';
import React from 'react';

describe('<CircleButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CircleButton />);
  });
});
