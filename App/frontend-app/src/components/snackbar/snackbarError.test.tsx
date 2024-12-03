import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnackbarError } from './snackbarError';
import { closeSnackbar, CustomContentProps } from 'notistack';
import { DismissRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';

// Mock the closeSnackbar function
jest.mock('notistack', () => ({
  closeSnackbar: jest.fn(),
}));

// Mock the translation function
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key: any) => key }), // Return key as translation
}));

describe('SnackbarError', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it('renders with a message prop', () => {
    const defaultProps : CustomContentProps = {
        id: "test-id",
        message: "Success!",
        persist: false,
        style: {},
        anchorOrigin: { vertical: "top", horizontal: "right" }, // Valid values
        variant: "success",
        hideIconVariant: false,
        iconVariant: {
            success: "✔️",
            error: "❌",
            warning: "⚠️",
            info: "ℹ️",
        },
        
    }

    render(<SnackbarError msgItems={[]} {...defaultProps} />);

    expect(screen.getByText('An error occurred!')).toBeInTheDocument();
  });

  it('renders with msgItems array and formats it correctly', () => {
    const defaultProps : CustomContentProps = {
        id: "test-id",
        message: "Success!",
        persist: false,
        style: {},
        anchorOrigin: { vertical: "top", horizontal: "right" }, // Valid values
        variant: "success",
        hideIconVariant: false,
        iconVariant: {
            success: "✔️",
            error: "❌",
            warning: "⚠️",
            info: "ℹ️",
        },
        
    }

    render(<SnackbarError msgItems={[]} {...defaultProps} />);

    // Ensure each item is rendered with a line break between them
    expect(screen.getByText('Error occurred in step 1')).toBeInTheDocument();
    expect(screen.getByText('Error occurred in step 2')).toBeInTheDocument();
    //expect(screen.getByText('Error occurred in step 1')).nextSibling?.nodeName.toLowerCase().shouldBe('br');
  });

  it('calls closeSnackbar when dismiss icon is clicked', () => {
   
    const defaultProps : CustomContentProps = {
        id: "test-id",
        message: "Success!",
        persist: false,
        style: {},
        anchorOrigin: { vertical: "top", horizontal: "right" }, // Valid values
        variant: "success",
        hideIconVariant: false,
        iconVariant: {
            success: "✔️",
            error: "❌",
            warning: "⚠️",
            info: "ℹ️",
        },
        
    }

    render(<SnackbarError msgItems={[]} {...defaultProps} />);

    const dismissButton = screen.getByLabelText('common.dismiss'); // The aria-label is set to "common.dismiss"
    fireEvent.click(dismissButton);

    // Verify closeSnackbar is called
    expect(closeSnackbar).toHaveBeenCalledWith('test-id');
  });

  it('renders with no msgItems and shows the message', () => {
    const defaultProps : CustomContentProps = {
        id: "test-id",
        message: "Success!",
        persist: false,
        style: {},
        anchorOrigin: { vertical: "top", horizontal: "right" }, // Valid values
        variant: "success",
        hideIconVariant: false,
        iconVariant: {
            success: "✔️",
            error: "❌",
            warning: "⚠️",
            info: "ℹ️",
        },
        
    }

    render(<SnackbarError msgItems={[]} {...defaultProps} />);


    expect(screen.getByText('Default error message')).toBeInTheDocument();
  });
});
