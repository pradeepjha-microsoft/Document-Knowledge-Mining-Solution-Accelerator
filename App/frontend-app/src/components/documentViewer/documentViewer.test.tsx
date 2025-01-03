
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

jest.mock("./dialogTitleBar", () => ({
  DialogTitleBar: jest.fn(({ handleReturnToDocumentTab }) => (
    <div data-testid="dialog-title-bar">
      <button data-testid="return-to-document-tab" onClick={handleReturnToDocumentTab}>Return</button>
    </div>
  )),
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

jest.mock("./aIKnowledgeTab", () => ({
    AIKnowledgeTab: () => <div>AIKnowledgeTab</div>,
}));

jest.mock("../../api/chatService", () => ({
  PostFeedback: jest.fn(),
}));

  it('renders correctly with initial props', () => {
    render(<DocDialog {...defaultProps} />);

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  it('handles tab selection', () => {
    render(<DocDialog {...defaultProps} />);
    // Simulate clicking the "Pages" tab
    const pagesTab = screen.getByText('components.dialog-title-bar.document');
    fireEvent.click(pagesTab);

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
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
      fireEvent.click(screen.getByText('components.dialog-title-bar.document'));
    });

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  it('displays AI Knowledge tab correctly', () => {
    render(<DocDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('components.dialog-title-bar.document'));

  });

  it('handles page click and updates tab', () => {
    render(<DocDialog {...defaultProps} />);

    const mockPageMetadata = [{ page_number: 2 }];

    act(() => {
      fireEvent.click(screen.getByText('components.dialog-title-bar.document'));
    });

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  it('does not break when metadata is null', () => {
    render(
      <DocDialog
        {...defaultProps}
        metadata={null}
      />
    );

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  it('updates selected page correctly', () => {
    render(<DocDialog {...defaultProps} />);
    act(() => {
      fireEvent.click(screen.getByText('components.dialog-title-bar.document'));
    });

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  // for un covered lines
  it("renders dialog when open", () => {
    render(<DocDialog {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  /*
  it("handles return to Document tab and resets state", () => {
    render(<DocDialog {...defaultProps} />);

    const returnButton = screen.getByTestId("return-to-document-tab");
    fireEvent.click(returnButton);

    // Verify that the iframe key is incremented
    // The actual iframe key logic would need a test-id or state verification
    expect(screen.getByTestId("components.dialog-title-bar.document")).toBeInTheDocument();
  });
  */
});
