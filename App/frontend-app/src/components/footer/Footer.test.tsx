import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";  // Use lowercase 'footer' to match the file name
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

// Disable the ESLint rule temporarily for the `i18n` import to avoid warning
/* eslint-disable import/no-named-as-default-member */

// Set up a mock translation for the test
const mockTranslation = {
  components: {
    footer: {
      copyright: "{{year}} My Company",
    },
  },
};

// Initialize i18n with the mock translation resource
i18n.init({
  lng: "en",
  resources: {
    en: {
      translation: mockTranslation,
    },
  },
});

// Re-enable the ESLint rule after the import
/* eslint-enable import/no-named-as-default-member */

describe("Footer Component", () => {
  test("renders without crashing", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  test("displays the correct copyright message with the current year", () => {
    const currentYear = new Date().getFullYear();
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );

    const copyrightText = screen.getByText(
      `${currentYear} My Company`
    );
    expect(copyrightText).toBeInTheDocument();
  });

  test("uses translation function to display the year", () => {
    const currentYear = new Date().getFullYear();
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>
    );
    
    // Ensure the translation is correctly rendered with the current year
    expect(screen.getByText(`${currentYear} My Company`)).toBeInTheDocument();
  });
});
