import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { SearchBox, SearchBoxHandle } from "./searchBox";
import { act } from "react-dom/test-utils";
import { Mic24Regular } from "@fluentui/react-icons";

jest.mock('use-debounce', () => ({
    useDebouncedCallback: (fn: (...args: any[]) => void) => {
      const debouncedFn = jest.fn(fn) as jest.Mock & { cancel: jest.Mock };
      debouncedFn.cancel = jest.fn(); // Mock the cancel method
      return debouncedFn;
    },
  }));
  
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
      t: (key: any) => key, // Mock translation function
      i18n: { changeLanguage: jest.fn() },
  }),
}));

jest.mock("../../api/storageService", () => ({
    UploadMultipleFiles: jest.fn(() => Promise.resolve(true)),
}));

describe("SearchBox", () => {
    const mockOnSearchChanged = jest.fn();
    const mockOnKeyDown = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the SearchBox with placeholder text", () => {
        render(
            <SearchBox 
                placeholder="Search here..." 
                onSearchChanged={mockOnSearchChanged} 
            />
        );
        expect(screen.getByPlaceholderText("Search here...")).toBeInTheDocument();
    });

    it("updates the value when typed into the input field", () => {
        render(
            <SearchBox 
                onSearchChanged={mockOnSearchChanged} 
            />
        );

        const input = screen.getByRole("searchbox");
        fireEvent.change(input, { target: { value: "test query" } });

        expect(input).toHaveValue("test query");
        expect(mockOnSearchChanged).toHaveBeenCalledWith("test query");
    });

    it("handles Enter key press and triggers onSearchChanged immediately", () => {
        render(
            <SearchBox 
                onSearchChanged={mockOnSearchChanged} 
                onKeyDown={mockOnKeyDown} 
            />
        );
        screen.debug();
        const input = screen.getByRole("searchbox");
        fireEvent.change(input, { target: { value: "test query" } });
        // expect(screen.getByLabelText("Type your search Keyword.")).toBeInTheDocument();
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        expect(mockOnSearchChanged).toHaveBeenCalledWith("test query");
        expect(mockOnKeyDown).toHaveBeenCalled();
    });

    it("resets the value when the reset method is called", () => {
        const ref = React.createRef<SearchBoxHandle>();

        render(
            <SearchBox 
                onSearchChanged={mockOnSearchChanged} 
                ref={ref} 
            />
        );

        act(() => {
            ref.current?.setValue("test value");
        });

        const input = screen.getByRole("searchbox");
        expect(input).toHaveValue("test value");

        act(() => {
            ref.current?.reset();
        });

        expect(input).toHaveValue("");
        expect(mockOnSearchChanged).toHaveBeenCalledWith("");
    });

    it("renders buttons inside the input contentAfter", () => {
        render(<SearchBox onSearchChanged={mockOnSearchChanged} />);
        // Assert buttons are rendered
        expect(screen.getByLabelText("Type your search Keyword.")).toBeInTheDocument();
        expect(screen.getByTestId("upload-div")).toBeInTheDocument();
    });
    

    it("should expose setValue and reset methods through ref", () => {
        const ref = React.createRef<SearchBoxHandle>();
        render(<SearchBox ref={ref} onSearchChanged={mockOnSearchChanged} />);
    
        act(() => {
            ref.current?.setValue("test value");
        });
        expect(mockOnSearchChanged).toHaveBeenCalledWith("test value");
    
        act(() => {
            ref.current?.reset();
        });
        expect(mockOnSearchChanged).toHaveBeenCalledWith("");
    });

    it("should enforce a character limit of 300 on input", () => {
        render(<SearchBox onSearchChanged={mockOnSearchChanged} />);
        const input = screen.getByRole("searchbox");
    
        // Valid input (within the limit)
        fireEvent.change(input, { target: { value: "a".repeat(300) } });
        expect(input).toHaveValue("a".repeat(300));
        expect(mockOnSearchChanged).toHaveBeenCalledWith("a".repeat(300));
    
        // Exceeding character limit
        fireEvent.change(input, { target: { value: "a".repeat(301) } });
        expect(input).toHaveValue("a".repeat(300));
        expect(mockOnSearchChanged).not.toHaveBeenCalledWith("a".repeat(301));
    });

    it("should forward ref to access component methods", () => {
        const ref = React.createRef<SearchBoxHandle>();
        render(<SearchBox ref={ref} onSearchChanged={mockOnSearchChanged} />);
    
        expect(ref.current).toBeDefined();
        expect(typeof ref.current?.setValue).toBe("function");
        expect(typeof ref.current?.reset).toBe("function");
    });
    
});
