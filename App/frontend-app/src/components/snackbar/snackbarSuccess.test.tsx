import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SnackbarSuccess } from "./snackbarSuccess";
import { closeSnackbar, CustomContentProps } from "notistack";

// Mock `notistack` to test `closeSnackbar` functionality
jest.mock("notistack", () => ({
    closeSnackbar: jest.fn(),
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Mock translation function
    }),
}));

describe("SnackbarSuccess", () => {
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
    };


    it("renders without crashing", () => {
        render(<SnackbarSuccess {...defaultProps} />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("displays the success message", () => {
        render(<SnackbarSuccess {...defaultProps} />);
        expect(screen.getByText("Test Success Message")).toBeInTheDocument();
    });

    it("calls closeSnackbar when the dismiss button is clicked", () => {
        render(<SnackbarSuccess {...defaultProps} />);
        const dismissButton = screen.getByLabelText("common.dismiss");
        fireEvent.click(dismissButton);

        expect(closeSnackbar).toHaveBeenCalledWith("test-snackbar-id");
    });

    it("applies the correct class names", () => {
        render(<SnackbarSuccess {...defaultProps} />);
        const alertElement = screen.getByRole("alert");
        expect(alertElement).toHaveClass("!bg-green-100");
        expect(alertElement).toHaveClass("!text-green-800");
    });
});
