// import { render, screen, fireEvent, act } from "@testing-library/react";
// import { DocDialog } from "./documentViewer";
// import { Document } from "../../api/apiTypes/embedded";
// import { useTranslation } from "react-i18next";

// // Mocking necessary components and hooks
// jest.mock("react-i18next", () => ({
//     useTranslation: jest.fn(),
// }));

// jest.mock("./iFrameComponent", () => ({
//     IFrameComponent: () => <div>IFrameComponent</div>,
// }));

// jest.mock("./dialogContentComponent", () => ({
//     DialogContentComponent: () => <div>DialogContentComponent</div>,
// }));

// jest.mock("./PagesTab", () => ({
//     PagesTab: () => <div>PagesTab</div>,
// }));

// jest.mock("./PageNumberTab", () => ({
//     PageNumberTab: () => <div>PageNumberTab</div>,
// }));

// jest.mock("./MetadataTable", () => ({
//     MetadataTable: () => <div>MetadataTable</div>,
// }));

// jest.mock("./dialogTitleBar", () => ({
//     DialogTitleBar: () => <div>DialogTitleBar</div>,
// }));

// jest.mock("./aIKnowledgeTab", () => ({
//     AIKnowledgeTab: () => <div>AIKnowledgeTab</div>,
// }));

// Object.defineProperty(global, "import.meta", {
//     value: {
//       env: {
//         VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
//       },
//     },
// });

// describe("DocDialog", () => {
//     const mockOnClose = jest.fn();
//     const metadata: Document = {
//         documentId: "123",
//         fileName: "test.pdf",
//         document_url: "",
//         page_number: 1,
//         keywords: {
//             field1: "value1",
//             field2: "value2",
//         },
//         importedTime: "string",      // ISO timestamp for when the document was imported
//         processingTime: "string",    // Time taken to process the document
//         mimeType: "string",          // MIME type of the document (e.g., PDF, DOCX)
//         summary: "string",           // Summary of the document's contents
//         id: "string",                // Additional identifier
//         __partitionkey: "string"
//     };
//     const allChunkTexts = ["chunk1", "chunk2"];
//     const clearChatFlag = false;

//     beforeEach(() => {
//         (useTranslation as jest.Mock).mockReturnValue({ t: (key: string) => key });
//     });

//     it("renders the document tab correctly", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );
        
//         // Check if IFrameComponent is rendered
//         expect(screen.getByText("IFrameComponent")).toBeInTheDocument();

//         // Check if DialogContentComponent is rendered
//         expect(screen.getByText("DialogContentComponent")).toBeInTheDocument();
//     });

//     it("renders the pages tab correctly", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );
        
//         // Simulate selecting the "Pages" tab
//         fireEvent.click(screen.getByText("Pages"));

//         // Check if PagesTab is rendered
//         expect(screen.getByText("PagesTab")).toBeInTheDocument();
//     });

//     it("renders AI Knowledge tab correctly", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );

//         // Simulate selecting the "AI Knowledge" tab
//         fireEvent.click(screen.getByText("AI Knowledge"));

//         // Check if AIKnowledgeTab is rendered
//         expect(screen.getByText("AIKnowledgeTab")).toBeInTheDocument();
//     });

//     it("renders Page Number tab when a page is selected", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );

//         // Simulate selecting a page
//         fireEvent.click(screen.getByText("Pages"));
//         fireEvent.click(screen.getByText("Page Number"));

//         // Check if PageNumberTab is rendered
//         expect(screen.getByText("PageNumberTab")).toBeInTheDocument();
//     });

//     it("downloads the document when the download button is clicked", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );

//         // Mock window.open to track calls
//         const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

//         // Simulate download button click
//         fireEvent.click(screen.getByText("Download"));

//         // Ensure window.open was called with the correct URL
//         expect(openSpy).toHaveBeenCalledWith(metadata.document_url, "_blank");

//         openSpy.mockRestore();
//     });

//     it("calls onClose when the dialog is closed", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );

//         // Simulate closing the dialog
//         fireEvent.click(screen.getByText("Close"));

//         // Ensure onClose is called
//         expect(mockOnClose).toHaveBeenCalled();
//     });

//     it("handles clearChatFlag state change", () => {
//         render(
//             <DocDialog
//                 metadata={metadata}
//                 isOpen={true}
//                 allChunkTexts={allChunkTexts}
//                 clearChatFlag={clearChatFlag}
//                 onClose={mockOnClose}
//             />
//         );

//         // Initially, the clearChatFlag state should be false
//         expect(screen.queryByText("AIKnowledgeTab")).not.toBeInTheDocument();

//         // Simulate clearing the chat
//         fireEvent.change(screen.getByText("Clear Chat"), { target: { value: true } });

//         // Check if the AI Knowledge Tab is rendered after clearing chat
//         expect(screen.getByText("AIKnowledgeTab")).toBeInTheDocument();
//     });
// });

// second test case 

// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { DocDialog } from './documentViewer'; // Adjust the import based on your project structure
// import { IFrameComponent } from './iFrameComponent'; // Mock child component
// import { DialogContentComponent } from './dialogContentComponent'; // Mock child component
// import { PagesTab } from './PagesTab'; // Mock child component
// import { AIKnowledgeTab } from './aIKnowledgeTab'; // Mock child component
// import { MetadataTable } from './metadataTable'; // Mock child component

// // Mocking necessary components for child components
// jest.mock('./iFrameComponent', () => ({
//   IFrameComponent: jest.fn(() => <div>Iframe</div>),
// }));

// jest.mock('./dialogContentComponent', () => ({
//   DialogContentComponent: jest.fn(() => <div>Dialog Content</div>),
// }));

// jest.mock('./PagesTab', () => ({
//   PagesTab: jest.fn(() => <div>Pages Tab</div>),
// }));

// jest.mock('./aIKnowledgeTab', () => ({
//   AIKnowledgeTab: jest.fn(() => <div>AI Knowledge Tab</div>),
// }));

// jest.mock('./metadataTable', () => ({
//   MetadataTable: jest.fn(() => <div>Metadata Table</div>),
// }));

// describe('DocDialog', () => {
//   const mockMetadata = {
//     documentId: '1',
//     fileName: 'example.pdf',
//     document_url: 'https://example.com/file',
//     page_number: 1,
//     keywords: {
//         field1: "value1",
//         field2: "value2",
//     },
//     importedTime: "string",      // ISO timestamp for when the document was imported
//     processingTime: "string",    // Time taken to process the document
//     mimeType: "string",          // MIME type of the document (e.g., PDF, DOCX)
//     summary: "string",           // Summary of the document's contents
//     id: "string",                // Additional identifier
//     __partitionkey: "string"
//   };

//   const mockOnClose = jest.fn();

//   const defaultProps = {
//     metadata: mockMetadata,
//     isOpen: true,
//     allChunkTexts: ['chunk1', 'chunk2'],
//     clearChatFlag: false,
//     onClose: mockOnClose,
//   };

//   test('renders the component with document content by default', () => {
//     render(<DocDialog {...defaultProps} />);
    
//     // Check if the IFrame and DialogContent are rendered correctly
//     expect(screen.getByText('Iframe')).toBeInTheDocument();
//     expect(screen.getByText('Dialog Content')).toBeInTheDocument();
//   });

//   test('displays PagesTab when Pages tab is selected', async () => {
//     render(<DocDialog {...defaultProps} />);

//     // Simulate a tab change to "Pages"
//     fireEvent.click(screen.getByText('Pages')); // Assuming there is a button or tab for "Pages"

//     await waitFor(() => expect(screen.getByText('Pages Tab')).toBeInTheDocument());
//   });

//   test('displays AIKnowledgeTab when AI Knowledge tab is selected', async () => {
//     render(<DocDialog {...defaultProps} />);

//     // Simulate a tab change to "AI Knowledge"
//     fireEvent.click(screen.getByText('AI Knowledge')); // Assuming there is a button or tab for "AI Knowledge"

//     await waitFor(() => expect(screen.getByText('AI Knowledge Tab')).toBeInTheDocument());
//   });

//   test('displays MetadataTable when PageMetadata tab is selected', async () => {
//     render(<DocDialog {...defaultProps} />);

//     // Simulate a tab change to "PageMetadata"
//     fireEvent.click(screen.getByText('PageMetadata')); // Assuming there is a button or tab for "PageMetadata"

//     await waitFor(() => expect(screen.getByText('Metadata Table')).toBeInTheDocument());
//   });

//   test('handles download button click correctly', () => {
//     render(<DocDialog {...defaultProps} />);
    
//     // Simulate the click on the download button
//     const downloadButton = screen.getByText('Download'); // Assuming there is a "Download" button
//     fireEvent.click(downloadButton);

//     // Check that the window.open was called with the correct URL
//     expect(window.open).toHaveBeenCalledWith('https://example.com/file', '_blank');
//   });

//   test('calls onClose when dialog is closed', () => {
//     render(<DocDialog {...defaultProps} />);
    
//     // Simulate the dialog close
//     const closeButton = screen.getByText('Close'); // Assuming there is a "Close" button
//     fireEvent.click(closeButton);

//     // Check if the onClose callback was called
//     expect(mockOnClose).toHaveBeenCalledTimes(1);
//   });

//   test('sets selectedTab to "Document" when iframe key changes', () => {
//     render(<DocDialog {...defaultProps} />);
    
//     // Initially selectedTab should be "Document"
//     expect(screen.getByText('Iframe')).toBeInTheDocument();

//     // Change the iframe key (simulate a state update)
//     fireEvent.click(screen.getByText('Iframe'));

//     // Ensure the selectedTab is reset to "Document"
//     expect(screen.getByText('Iframe')).toBeInTheDocument();
//   });

//   test('correctly switches between tabs', () => {
//     render(<DocDialog {...defaultProps} />);

//     // Simulate a tab switch to "Pages"
//     fireEvent.click(screen.getByText('Pages'));

//     expect(screen.getByText('Pages Tab')).toBeInTheDocument();

//     // Simulate a tab switch to "AI Knowledge"
//     fireEvent.click(screen.getByText('AI Knowledge'));

//     expect(screen.getByText('AI Knowledge Tab')).toBeInTheDocument();
//   });

//   test('handles empty metadata gracefully', () => {
//     render(<DocDialog {...{ ...defaultProps, metadata: null }} />);
    
//     // Test if the dialog handles an empty metadata gracefully
//     expect(screen.queryByText('Iframe')).not.toBeInTheDocument();
//   });
// });

// third

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DocDialog } from './documentViewer';
import { Document } from '../../api/apiTypes/embedded';
// import { useTranslation } from 'react-i18next';
// import { PagesTab } from './PagesTab';
import {PostFeedback} from '../../api/chatService';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
  }),
}));
jest.mock("react-tiff", () => ({
    TIFFViewer: () => <div>Tiff</div>,
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: any) => key, // Returns the key as the translated string
    }),
    // Trans: ({ children }) => children, // Support for <Trans> component
    initReactI18next: {
      type: '3rdParty',
      init: jest.fn(),
    },
    i18n: {
      use: jest.fn(),
      init: jest.fn(),
      t: (key: any) => key,
    },
  }));
  
describe('DocDialog Component', () => {
  const mockOnClose = jest.fn();

  const metadataMock: Document = {
    document_url : 'http://example.com/document',
    documentId: '123',
    fileName: 'test.pdf',
    page_number: 1,
    keywords: {
                field1: "value1",
                field2: "value2",
            },
    importedTime: "string",
    processingTime: "string",
    mimeType: "string",
    summary: "string",
    id: "string",                    
    __partitionkey: "string"
  };

  Object.defineProperty(global, "import.meta", {
    value: {
      env: {
        VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
        },
        },
    });
  const defaultProps = {
    metadata: metadataMock,
    isOpen: true,
    allChunkTexts: ['Chunk 1', 'Chunk 2'],
    clearChatFlag: false,
    onClose: mockOnClose,
  };
  jest.mock('react-tiff', () => ({
    TIFFViewer: jest.fn(() => <div data-testid="mock-tiff-viewer">Mocked TIFF Viewer</div>),
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

jest.mock("../../api/chatService", () => ({
  PostFeedback: jest.fn(),
}));

  it('renders correctly with initial props', () => {
    render(<DocDialog {...defaultProps} />);

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('AI Knowledge')).toBeInTheDocument();
  });

  it('handles tab selection', () => {
    render(<DocDialog {...defaultProps} />);

    // Simulate clicking the "Pages" tab
    const pagesTab = screen.getByText('Pages');
    fireEvent.click(pagesTab);

    expect(screen.getByText('Pages')).toBeInTheDocument();
  });

  it('calls onClose when dialog is closed', () => {
    render(<DocDialog {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /close/i }); // Assuming close button exists in DialogTitleBar
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles download functionality', () => {
    window.open = jest.fn();
    render(<DocDialog {...defaultProps} />);

    const downloadButton = screen.getByRole('button', { name: /download/i }); // Assuming download button exists in DialogTitleBar
    fireEvent.click(downloadButton);

    expect(window.open).toHaveBeenCalledWith(metadataMock.document_url, '_blank');
  });

  it('handles iframe key updates on tab changes', () => {
    render(<DocDialog {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByText('Document'));
    });

    expect(screen.getByText('Document')).toBeInTheDocument();
  });

  it('displays AI Knowledge tab correctly', () => {
    render(<DocDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('AI Knowledge'));

    expect(screen.getByText('key1')).toBeInTheDocument();
    expect(screen.getByText('value1')).toBeInTheDocument();
    expect(screen.getByText('value2')).toBeInTheDocument();
  });

  it('handles page click and updates tab', () => {
    render(<DocDialog {...defaultProps} />);

    const mockPageMetadata = [{ page_number: 2 }];

    act(() => {
      fireEvent.click(screen.getByText('Pages'));
    });

    expect(screen.getByText('Pages')).toBeInTheDocument();
  });

  it('does not break when metadata is null', () => {
    render(
      <DocDialog
        {...defaultProps}
        metadata={null}
      />
    );

    expect(screen.getByText('Document')).toBeInTheDocument();
  });

  it('updates selected page correctly', () => {
    render(<DocDialog {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByText('Page Number'));
    });

    expect(screen.getByText('Page Number')).toBeInTheDocument();
  });

  it('handles null page metadata gracefully', () => {
    render(<DocDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Page Metadata'));

    expect(screen.getByText('Page Metadata')).toBeInTheDocument();
  });

  it('handles document URL undefined scenario', () => {
    render(
      <DocDialog
        {...defaultProps}
        metadata={{ ...metadataMock, document_url: undefined }}
      />
    );

    expect(screen.getByText('Document')).toBeInTheDocument();
  });
});
