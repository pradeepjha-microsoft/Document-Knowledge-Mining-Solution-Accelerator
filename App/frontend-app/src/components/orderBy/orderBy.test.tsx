import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { userEvent }from '@testing-library/user-event';
import { OrderBy } from './orderBy';
import '@testing-library/jest-dom';
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('OrderBy component', () => {
  const onSortSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the select element with options', async () => {
    const { getByRole } = render(<OrderBy onSortSelected={onSortSelected} />);
    expect(getByRole('combobox')).toBeInTheDocument();
    expect(getByRole('combobox')).toHaveValue('components.order-by.sort-by');
  });

  it('calls onSortSelected when an option is selected', async () => {
    const { getByText } = render(<OrderBy onSortSelected={onSortSelected} />);
    const optionElement = getByText('components.order-by.title');
    await userEvent.click(optionElement);
    await waitFor(() => expect(onSortSelected).toHaveBeenCalledTimes(1));
    expect(onSortSelected).toHaveBeenCalledWith('title');
  });

  it('updates the select element value when an option is selected', async () => {
    const { getByRole, getByText } = render(<OrderBy onSortSelected={onSortSelected} />);
    const optionElement = getByText('components.order-by.title');
    await userEvent.click(optionElement);
    await waitFor(() => expect(getByRole('combobox')).toHaveValue('components.order-by.title'));
  });

  it('resets the select element value when the default option is selected', async () => {
    const { getByRole, getByText } = render(<OrderBy onSortSelected={onSortSelected} />);
    const optionElement = getByText('components.order-by.title');
    await userEvent.click(optionElement);
    const defaultOptionElement = getByText('components.order-by.sort-by');
    await userEvent.click(defaultOptionElement);
    await waitFor(() => expect(getByRole('combobox')).toHaveValue('components.order-by.sort-by'));
  });

  it('calls onSortSelected with an empty string when the default option is selected', async () => {
    const { getByText } = render(<OrderBy onSortSelected={onSortSelected} />);
    const optionElement = getByText('components.order-by.title');
    await userEvent.click(optionElement);
    const defaultOptionElement = getByText('components.order-by.sort-by');
    await userEvent.click(defaultOptionElement);
    await waitFor(() => expect(onSortSelected).toHaveBeenCalledTimes(2));
    expect(onSortSelected).toHaveBeenNthCalledWith(2, '');
  });
});
