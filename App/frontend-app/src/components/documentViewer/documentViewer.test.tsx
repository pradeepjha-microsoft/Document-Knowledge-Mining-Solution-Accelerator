<<<<<<< HEAD
=======
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { DocDialog } from "./documentViewer";
// import { IFrameComponent } from "./iFrameComponent";
// import { DialogTitleBar } from "./dialogTitleBar";
// import { AIKnowledgeTab } from "./aIKnowledgeTab";
// import { PagesTab } from "./PagesTab";
// import { PageNumberTab } from "./pageNumberTab";
// import { MetadataTable } from "./metadataTable";
// import { useTranslation } from "react-i18next";

// // Mocking the useTranslation hook
// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key: string) => key,
//   }),
// }));

// describe('DocDialog Component', () => {
//   const mockOnClose = jest.fn();
//   const mockMetadata = {
//     documentId: "123",
//     fileName: "test-document.pdf",
//     document_url: "https://example.com/test-document.pdf",
//   };

//   const defaultProps = {
//     metadata: mockMetadata,
//     isOpen: true,
//     allChunkTexts: ["text1", "text2", "text3"],
//     clearChatFlag: false,
//     onClose: mockOnClose,
//   };

//   it('should render dialog when isOpen is true', () => {
//     render(<DocDialog {...defaultProps} />);
//     expect(screen.getByRole('dialog')).toBeInTheDocument();
//   });

//   it('should render IFrameComponent when "Document" tab is selected', async () => {
//     render(<DocDialog {...defaultProps} />);
//     // Assuming "Document" is the default tab selected
//     const iframe = screen.getByTitle('Doc visualizer');
//     expect(iframe).toBeInTheDocument();
//   });

//   it('should change to "Pages" tab when selected', async () => {
//     render(<DocDialog {...defaultProps} />);
    
//     const tabButton = screen.getByText('Pages'); // Make sure the tab text is correct
//     fireEvent.click(tabButton);

//     // Wait for the PagesTab component to render
//     await waitFor(() => screen.getByText('Pages'));
//     expect(screen.getByText('Pages')).toBeInTheDocument();
//     expect(screen.getByRole('tab', { name: /Pages/ })).toHaveClass('active');
//   });

//   it('should display AI Knowledge tab when selected', async () => {
//     render(<DocDialog {...defaultProps} />);
    
//     const tabButton = screen.getByText('AI Knowledge');
//     fireEvent.click(tabButton);

//     // Wait for the AI Knowledge tab to render
//     await waitFor(() => screen.getByText('AI Knowledge'));
//     expect(screen.getByText('AI Knowledge')).toBeInTheDocument();
//     expect(screen.getByTestId('ai-knowledge-tab')).toBeInTheDocument(); // Assuming AI Knowledge tab has a data-testid
//   });

//   it('should render PageNumberTab when "Page Number" tab is selected', async () => {
//     render(<DocDialog {...defaultProps} />);
    
//     const tabButton = screen.getByText('Page Number');
//     fireEvent.click(tabButton);

//     // Check if PageNumberTab is displayed
//     const pageNumberTab = screen.getByText('Page Number');
//     expect(pageNumberTab).toBeInTheDocument();
//     expect(screen.getByRole('tab', { name: /Page Number/ })).toHaveClass('active');
//   });

//   it('should call onClose when dialog is closed', () => {
//     render(<DocDialog {...defaultProps} />);
//     const closeButton = screen.getByRole('button', { name: /close/i });
//     fireEvent.click(closeButton);

//     expect(mockOnClose).toHaveBeenCalled();
//   });

//   it('should render DialogTitleBar with correct props', () => {
//     render(<DocDialog {...defaultProps} />);
//     expect(screen.getByText('Document')).toBeInTheDocument();
//     const titleBar = screen.getByRole('heading', { name: /Document/ });
//     expect(titleBar).toBeInTheDocument();
//   });

//   it('should render correct content for Metadata tab', () => {
//     render(<DocDialog {...defaultProps} />);
//     // Assuming the tab for Metadata is not implemented, but can be tested here
//     const metadataTab = screen.queryByText('Metadata');
//     expect(metadataTab).not.toBeInTheDocument(); // Check that "Metadata" tab is not displayed
//   });

//   it('should handle selected page correctly in PagesTab', () => {
//     const mockPageMetadata = [
//       { page_number: 1, tables: [] },
//       { page_number: 2, tables: [] },
//     ];

//     render(
//       <DocDialog
//         {...defaultProps}
//         pageMetadata={mockPageMetadata}
//       />
//     );

//     // Simulate selecting a page
//     fireEvent.click(screen.getByText('Page 1')); // Simulate clicking the page 1 button

//     expect(screen.getByText('Page Number')).toBeInTheDocument(); // Ensure the Page Number tab is selected
//   });
// });

>>>>>>> b23f229e67aa3d6fc54304c1356af1252f62d85b

import { render, screen, fireEvent, act } from "@testing-library/react";
import { DocDialog } from "./documentViewer";
import { Document } from "../../api/apiTypes/embedded";
import { useTranslation } from "react-i18next";

// Mocking necessary components and hooks
jest.mock("react-i18next", () => ({
    useTranslation: jest.fn(),
}));

jest.mock("./iFrameComponent", () => ({
    IFrameComponent: () => <div>IFrameComponent</div>,
}));

jest.mock("./dialogContentComponent", () => ({
    DialogContentComponent: () => <div>DialogContentComponent</div>,
}));

jest.mock("./PagesTab", () => ({
    PagesTab: () => <div>PagesTab</div>,
}));

jest.mock("./PageNumberTab", () => ({
    PageNumberTab: () => <div>PageNumberTab</div>,
}));

jest.mock("./MetadataTable", () => ({
    MetadataTable: () => <div>MetadataTable</div>,
}));

jest.mock("./dialogTitleBar", () => ({
    DialogTitleBar: () => <div>DialogTitleBar</div>,
}));

jest.mock("./aIKnowledgeTab", () => ({
    AIKnowledgeTab: () => <div>AIKnowledgeTab</div>,
}));

Object.defineProperty(global, "import.meta", {
    value: {
      env: {
        VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
      },
    },
  });
  
describe("DocDialog", () => {
    const mockOnClose = jest.fn();
    const metadata: Document = {
        documentId: "123",
        fileName: "test.pdf",
        document_url: "",
        page_number: 1,
        keywords: {
            field1: "value1",
            field2: "value2",
        },
        importedTime: "string",      // ISO timestamp for when the document was imported
        processingTime: "string",    // Time taken to process the document
        mimeType: "string",          // MIME type of the document (e.g., PDF, DOCX)
        summary: "string",           // Summary of the document's contents
        id: "string",                // Additional identifier
        __partitionkey: "string"
    };
    const allChunkTexts = ["chunk1", "chunk2"];
    const clearChatFlag = false;

    beforeEach(() => {
        (useTranslation as jest.Mock).mockReturnValue({ t: (key: string) => key });
    });

    it("renders the document tab correctly", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );
        
        // Check if IFrameComponent is rendered
        expect(screen.getByText("IFrameComponent")).toBeInTheDocument();

        // Check if DialogContentComponent is rendered
        expect(screen.getByText("DialogContentComponent")).toBeInTheDocument();
    });

    it("renders the pages tab correctly", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );
        
        // Simulate selecting the "Pages" tab
        fireEvent.click(screen.getByText("Pages"));

        // Check if PagesTab is rendered
        expect(screen.getByText("PagesTab")).toBeInTheDocument();
    });

    it("renders AI Knowledge tab correctly", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );

        // Simulate selecting the "AI Knowledge" tab
        fireEvent.click(screen.getByText("AI Knowledge"));

        // Check if AIKnowledgeTab is rendered
        expect(screen.getByText("AIKnowledgeTab")).toBeInTheDocument();
    });

    it("renders Page Number tab when a page is selected", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );

        // Simulate selecting a page
        fireEvent.click(screen.getByText("Pages"));
        fireEvent.click(screen.getByText("Page Number"));

        // Check if PageNumberTab is rendered
        expect(screen.getByText("PageNumberTab")).toBeInTheDocument();
    });

    it("downloads the document when the download button is clicked", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );

        // Mock window.open to track calls
        const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

        // Simulate download button click
        fireEvent.click(screen.getByText("Download"));

        // Ensure window.open was called with the correct URL
        expect(openSpy).toHaveBeenCalledWith(metadata.document_url, "_blank");

        openSpy.mockRestore();
    });

    it("calls onClose when the dialog is closed", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );

        // Simulate closing the dialog
        fireEvent.click(screen.getByText("Close"));

        // Ensure onClose is called
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("handles clearChatFlag state change", () => {
        render(
            <DocDialog
                metadata={metadata}
                isOpen={true}
                allChunkTexts={allChunkTexts}
                clearChatFlag={clearChatFlag}
                onClose={mockOnClose}
            />
        );

        // Initially, the clearChatFlag state should be false
        expect(screen.queryByText("AIKnowledgeTab")).not.toBeInTheDocument();

        // Simulate clearing the chat
        fireEvent.change(screen.getByText("Clear Chat"), { target: { value: true } });

        // Check if the AI Knowledge Tab is rendered after clearing chat
        expect(screen.getByText("AIKnowledgeTab")).toBeInTheDocument();
    });
});
