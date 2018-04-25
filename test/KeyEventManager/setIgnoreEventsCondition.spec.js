import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';

import HotKeys from '../../lib/HotKeys';
import FocusableElement from '../support/FocusableElement';
import KeyEventManager from '../../lib/lib/KeyEventManager';

describe('KeyEventManager:', () => {
  before(function () {
    this.keyMap = {
      'ENTER': 'enter',
      'TAB': 'tab',
    };
  });

  context('when setIgnoreEventsCondition() is NOT called', () => {

    [ 'input', 'select', 'textarea'].forEach((Tagname) => {
      it(`then events from <${Tagname} /> tags are ignored`, function() {
        this.handler = sinon.spy();

        const handlers = {
          'ENTER': this.handler,
        };

        this.wrapper = mount(
          <HotKeys keyMap={this.keyMap} handlers={handlers}>
            <Tagname className="childElement" />
          </HotKeys>
        );

        this.targetElement = new FocusableElement(this.wrapper, Tagname);
        this.targetElement.focus();

        this.targetElement.keyPress('Enter');

        expect(this.handler).to.not.have.been.called;
      });

    })
  });

  context('when setIgnoreEventsCondition() is called with a function', () => {

    it('then that function is used to decide whether to ignore events', function() {
      KeyEventManager.setIgnoreEventsCondition(({ target }) => {
        return target.tagName.toLowerCase() === 'input' && target.className === 'ignore';
      });

      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={handlers}>
          <input className="ignore" />
          <input className="other" />
        </HotKeys>
      );

      this.targetElement = new FocusableElement(this.wrapper, 'input.ignore');
      this.targetElement.focus();

      this.targetElement.keyDown('Enter');

      expect(this.handler).to.not.have.been.called;

      this.targetElement = new FocusableElement(this.wrapper, 'input.other');
      this.targetElement.focus();

      this.targetElement.keyDown('Enter');

      expect(this.handler).to.have.been.called;
    });

  });

  context('when resetIgnoreEventsCondition() is called', () => {

    it('then restores the default function used for ignoreEventsCondition', function() {
      KeyEventManager.setIgnoreEventsCondition(({ target }) => {
        return target.tagName.toLowerCase() === 'input' && target.className === 'ignore';
      });

      KeyEventManager.resetIgnoreEventsCondition();

      this.handler = sinon.spy();

      const handlers = {
        'ENTER': this.handler,
      };

      this.wrapper = mount(
        <HotKeys keyMap={this.keyMap} handlers={handlers}>
          <input className="other" />
        </HotKeys>
      );

      this.targetElement = new FocusableElement(this.wrapper, 'input.other');
      this.targetElement.focus();

      this.targetElement.keyDown('Enter');

      expect(this.handler).to.not.have.been.called;
    });

  });

});