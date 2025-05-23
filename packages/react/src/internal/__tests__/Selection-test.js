/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Selection } from '../Selection';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

describe('Selection', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      initialSelectedItems: [],
      render: jest.fn(() => <div />),
    };
  });

  describe('renders as expected - Component API', () => {
    it('should render', () => {
      const { container } = render(<Selection {...mockProps} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('behaves as expected', () => {
    it('should be able to add or remove an item from the callback props', async () => {
      let selectedItems = [];
      const onChange = (selectionState) =>
        (selectedItems = selectionState.selectedItems);
      render(
        <Selection
          {...mockProps}
          render={({ onItemChange }) => (
            <button type="button" onClick={() => onItemChange(1)} />
          )}
          onChange={onChange}
        />
      );
      expect(selectedItems.length).toBe(0);
      await userEvent.click(screen.getByRole('button'));
      expect(selectedItems.length).toBe(1);
      await userEvent.click(screen.getByRole('button'));
      expect(selectedItems.length).toBe(0);
    });

    it('should give a list of all selected items from the callback props', async () => {
      render(
        <Selection
          {...mockProps}
          render={({ selectedItems, onItemChange }) => (
            <div>
              <button type="button" onClick={() => onItemChange(1)} />
              <ul>
                {selectedItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        />
      );
      expect(screen.queryAllByRole('listitem').length).toBe(0);
      await userEvent.click(screen.getByRole('button'));
      expect(screen.queryAllByRole('listitem').length).toBe(1);
    });

    it('should be able to clear the selection from the callback props', async () => {
      let selectedItems = [];
      const onChange = (selectionState) =>
        (selectedItems = selectionState.selectedItems);
      render(
        <Selection
          {...mockProps}
          render={({ onItemChange, clearSelection }) => (
            <div>
              <button
                type="button"
                data-testid="add-item"
                onClick={() => onItemChange(1)}
              />
              <button
                type="button"
                data-testid="clear-selection"
                onClick={clearSelection}
              />
            </div>
          )}
          onChange={onChange}
        />
      );

      expect(selectedItems).toEqual([]);
      await userEvent.click(screen.getByTestId('add-item'));
      expect(selectedItems).toEqual([1]);
      await userEvent.click(screen.getByTestId('clear-selection'));
      expect(selectedItems).toEqual([]);
    });
  });

  it('should disallow selection when disabled', async () => {
    let selectedItems = [];
    const onChange = (selectionState) =>
      (selectedItems = selectionState.selectedItems);
    render(
      <Selection
        {...mockProps}
        render={({ onItemChange }) => (
          <button type="button" onClick={() => onItemChange(1)} />
        )}
        disabled
        onChange={onChange}
      />
    );
    expect(selectedItems.length).toBe(0);
    await userEvent.click(screen.getByRole('button'));
    expect(selectedItems.length).toBe(0);
  });
});
