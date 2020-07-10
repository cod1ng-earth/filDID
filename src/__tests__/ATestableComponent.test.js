import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ATestableComponent from '../components/ATestableComponent';

afterEach(() => { console.log('after each'); });

describe('<ATestableComponent />', () => {
  it('the name changes after click', () => {
    const aTestableComponent = shallow(
        <ATestableComponent newName="stefan" />,
    );
    expect(aTestableComponent.find('.name-display').text()).to.equal('Your name is donald');
    aTestableComponent.find('button').simulate('click');
    expect(aTestableComponent.find('.name-display').text()).to.equal('Your name is stefan');
  });
});
