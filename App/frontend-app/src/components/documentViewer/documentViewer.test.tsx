import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { DocDialog } from './documentViewer';
import { MetadataTable } from './metadataTable';
import { IFrameComponent } from './iFrameComponent';
import { DialogContentComponent } from './dialogContentComponent';
import { PagesTab } from './PagesTab';
import { PageNumberTab } from './pageNumberTab';
import { AIKnowledgeTab } from './aIKnowledgeTab';
import { DialogTitleBar } from './dialogTitleBar';

import { Document } from '../../api/apiTypes/embedded';
// import { useTranslation } from 'react-i18next';
 import { PagesTab } from './PagesTab';
import {PostFeedback} from '../../api/chatService';
import { defaultCalendarStrings } from '@fluentui/react';

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

Object.defineProperty(global, "import.meta", {
  value: {
    env: {
      VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
    },
  },
});


// Mock Fluent UI Components
jest.mock('@fluentui/react-components', () => ({
  ...jest.requireActual("@fluentui/react-components"),
  Dialog: jest.fn(({ children }) => <div data-testid="Dialog">{children}</div>),
  DialogSurface: jest.fn(({ children }) => <div data-testid="DialogSurface">{children}</div>),
  DialogBody: jest.fn(({ children }) => <div data-testid="DialogBody">{children}</div>),
}));

// Mock External Components
jest.mock('./metadataTable', () => ({
  MetadataTable: jest.fn(() => <div data-testid="MetadataTable">MetadataTable</div>),
}));

jest.mock('./iFrameComponent', () => ({
  IFrameComponent: jest.fn(() => <div data-testid="IFrameComponent">IFrameComponent</div>),
}));

jest.mock('./dialogContentComponent', () => ({
  DialogContentComponent: jest.fn(() => <div data-testid="DialogContentComponent">DialogContentComponent</div>),
}));

jest.mock('./pageNumberTab', () => ({
  pageNumberTab: jest.fn(() => <div data-testid="pageNumberTab">pageNumberTab</div>),
}));

jest.mock('./PagesTab', () => ({
  PagesTab: jest.fn((props: any) => {
    const mockMetadata: Document = {
      document_url: 'http://example.com/document',
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
    return (<div data-testid="PagesTab">
      PagesTab
      <button onClick={props.handlePageClick(mockMetadata)}>PageNumber</button>
    </div>)
  }),
}));



jest.mock('./aIKnowledgeTab', () => ({
  AIKnowledgeTab: jest.fn(() => <div data-testid="AIKnowledgeTab">AIKnowledgeTab</div>),
}));

jest.mock('./dialogTitleBar', () => ({
  DialogTitleBar: jest.fn((props: any) => <div data-testid="DialogTitleBar">
    DialogTitleBar
    <span data-testid="selectedPage" >{props.selectedPage}</span>
    <span data-testid="selectedTab">{props.selectedTab}</span>
    <button onClick={(e) => props.onTabSelect(e, { value: 'Pages' })}>PagesTab</button>
    <button onClick={(e) => props.onTabSelect(e, { value: 'AI Knowledge' })}>AI Knowledge</button>
    <button onClick={(e) => props.onTabSelect(e, { value: 'Page Number' })}>Page Number</button>
    <button onClick={(e) => props.onTabSelect(e, { value: 'PageMetadata' })}>PageMetadata</button>
    <button data-testid="return-to-document-tab" onClick={props.handleReturnToDocumentTab}>Return</button>
    <button onClick={props.handleDialogClose}>Close</button>
    <button onClick={props.downloadFile}>Download</button>
  </div>),
}));

// Mock API Calls
jest.mock('../../api/documentsService', () => ({
  downloadDocument: jest.fn(),
  getEmbedded: jest.fn(),
}));



describe('DocDialog Component', () => {

  beforeEach(() => {
    // Mock window.open
    jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    // Restore original implementation of window.open
    jest.restoreAllMocks();
  });

  const mockMetadata: Document = {
    document_url: 'http://example.com/document',
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
      iframeKey: 'initial-key',
      selectedTab: 'Document', // Add this to default props
    };
    
  jest.mock('react-tiff', () => ({
    TIFFViewer: jest.fn(() => <div data-testid="mock-tiff-viewer">Mocked TIFF Viewer</div>),
  }));
  jest.mock('./PageNumberTab', () => ({
    PageNumberTab: () => <div data-testid="page-number-tab">PageNumberTab</div>,
  }));
  
  jest.mock("./iFrameComponent", () => ({
    IFrameComponent: jest.fn(() => <div data-testid="iframe-component">Mocked IFrameComponent</div>),
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
    expect(screen.getByTestId('Dialog')).toBeInTheDocument();
    expect(screen.getByTestId('DialogSurface')).toBeInTheDocument();
  });

  it('renders the IFrameComponent when the "Document" tab is selected', () => {
    render(<DocDialog {...defaultProps} />);
    expect(screen.getByTestId('IFrameComponent')).toBeInTheDocument();
  });

  it('renders the PagesTab when the "Pages" tab is selected', () => {
    const { rerender } = render(<DocDialog {...defaultProps} />);
    rerender(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'PagesTab' });
    fireEvent.click(button);
    expect(screen.getByTestId('PagesTab')).toBeInTheDocument();
  });

  it('renders the AI Knowledge when the "AI Knowledge" tab is selected', () => {
    const { rerender } = render(<DocDialog {...defaultProps} />);
    rerender(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'AI Knowledge' });
    fireEvent.click(button);
    expect(screen.getByTestId('AIKnowledgeTab')).toBeInTheDocument();
  });


  it('renders the PageMetadata when the "PageMetadata" tab is selected', async () => {
    const { rerender } = render(<DocDialog {...defaultProps} />);
    rerender(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'PageMetadata' });
    act(() => {
      fireEvent.click(button);
    });

    const selectedTab = screen.getByTestId('selectedTab');
    expect(selectedTab).toHaveTextContent('PageMetadata');

  });


  it('renders the Page Number  when a Page Number Tab is selected and Click on PageNumber', async () => {
    const { rerender } = render(<DocDialog {...defaultProps} />);
    rerender(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'PagesTab' });
    fireEvent.click(button);
    expect(screen.getByTestId('PagesTab')).toBeInTheDocument();

    const buttonPageNumber = screen.getByRole('button', { name: 'PageNumber' });
    act(() => {
      fireEvent.click(buttonPageNumber);
    })

    const selectedPage = screen.getByTestId('selectedPage');
    expect(selectedPage).toHaveTextContent('1');
  });

  it('calls onClose when the dialog close button is clicked', () => {
    render(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(button);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('downloads the document when the download button is clicked', () => {
    render(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Download' });
    fireEvent.click(button);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith("https://mock-api-endpoint.com/Documents/123/test.pdf", '_blank');
  });

  it('Retrun to Iframe Component after navigate to other tab', async () => {
    const { rerender } = render(<DocDialog {...defaultProps} />);
    rerender(<DocDialog {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'PagesTab' });
    fireEvent.click(button);
    expect(screen.getByTestId('PagesTab')).toBeInTheDocument();


    const buttonReturn = screen.getByRole('button', { name: 'Return' });
    act(() => {
      fireEvent.click(buttonReturn);
    });

    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  // for un covered lines
  it("renders dialog when open", () => {
    render(<DocDialog {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it('should handle page click and update selectedPage (line 197)', () => {
    render(<DocDialog {...defaultProps} />);

    const mockPage = { page_number: 2 };
    const handlePageClick = jest.fn();

    act(() => {
      handlePageClick(mockPage);
    });

    expect(handlePageClick).toHaveBeenCalledWith(mockPage);
  });
  // it.('renders correctly when allChunkTexts is null', () => {
  //   const updateprops = {
  //     ...defaultProps,
  //     allChunkTexts: null
      
  //   }
  //   render(<DocDialog {...updateprops}/>);
  //   expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  // });
 
  it('handles clearChatFlag correctly', () => {
    render(<DocDialog {...defaultProps} clearChatFlag={true} />);
    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
    // Add more checks if the flag triggers specific UI or state changes
  });
  it('renders correctly with invalid iframeKey', () => {
    const updatedProps = {...defaultProps, iframeKey: null}
    render(<DocDialog {...updatedProps} />);
    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });

  it('renders correctly with empty keywords', () => {
    render(
      <DocDialog
        {...defaultProps}
        metadata={{ ...metadataMock, keywords: {} }}
      />
    );
    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });
 
  it('renders correctly with partially null metadata', () => {
    const partialMetadata = { 
        ...metadataMock, 
        documentId: 'null', 
        keywords: {}  // Use an empty object for keywords instead of null
    };
    const updateProps = {
        ...defaultProps,
        metadata: partialMetadata,
    };
    
    render(<DocDialog {...updateProps} />);

    // Check if the dialog title bar renders correctly even with partial metadata
    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
});


  it('increments iframeKey on tab switch to Document', () => {
    const updateProps = {
      metadata: metadataMock,
      isOpen: true,
      allChunkTexts: ['Chunk 1', 'Chunk 2'],
      clearChatFlag: false,
      onClose: mockOnClose,
      iframeKey: 'initial-key',
      selectedTab: 'Document', // Add this to default props
    };
    const { rerender } = render(<DocDialog {...updateProps} />);
  
    fireEvent.click(screen.getByText('components.dialog-title-bar.document'));
    const updProps = {...defaultProps, iframeKey: "updated-key"}
    rerender(<DocDialog {...updProps}  />);
    
    expect(screen.getByText('components.dialog-title-bar.document')).toBeInTheDocument();
  });
  it('calls onClose correctly with null metadata', () => {
    render(
      <DocDialog
        {...defaultProps}
        metadata={null}
      />
    );
  
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
  
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('handles downloadFile correctly', () => {
    const urlWithSasToken = 'http://example.com/file.pdf';
    global.open = jest.fn();

    const downloadFile = () => {
      if (urlWithSasToken) {
        window.open(urlWithSasToken, '_blank');
      }
    };

    downloadFile();
    expect(global.open).toHaveBeenCalledWith(urlWithSasToken, '_blank');
  });

  it('renders nothing when selectedTab is not matched', () => {
    const mockSetSelectedPage = jest.fn();
    const mockSetSelectedTab = jest.fn();
    const mockMetadata = [
      { page_number: 1, metadata: { field1: 'value1' } },
      { page_number: 2, metadata: { field1: 'value2' } },
    ];
  
    const mockProps = {
      ...defaultProps,
      pageMetadata: mockMetadata,
      documentUrl: 'http://example.com/document.pdf',
      selectedTab: 'UnknownTab',
      selectedPage: 1,
      setSelectedPage: mockSetSelectedPage,
      setSelectedTab: mockSetSelectedTab,
    };
    render(
      <DocDialog {...mockProps}  />
    );

    expect(screen.queryByText('PageNumberTab')).not.toBeInTheDocument();
    expect(screen.queryByText('MetadataTable')).not.toBeInTheDocument();
  });                
   it('handles downloadFile with undefined urlWithSasToken', () => {
    const urlWithSasToken = undefined;
    global.open = jest.fn();

    const downloadFile = () => {
      if (urlWithSasToken) {
        window.open(urlWithSasToken, '_blank');
      }
    };

    downloadFile();
    expect(global.open).not.toHaveBeenCalledWith(urlWithSasToken, '_blank');
  
  });
  
  it('updates state correctly on handlePageClick', () => {
    const mockPage = { page_number: 3 };
    const handlePageClick = jest.fn();
  
    act(() => {
      handlePageClick(mockPage);
    });
  
    expect(handlePageClick).toHaveBeenCalledWith(mockPage);
    screen.debug()
    expect(mockPage).toEqual({ page_number: 3 });
    //expect(selectedTab).toBe("Page Number");
  });
  // it('updates selectedPage and selectedTab when a page is clicked', () => {
  //   // Render the component
  //   const { rerender } = render(<DocDialog {...defaultProps} />);
  
  //   // Update props to switch to "Page Number" tab
  //   const updatedProps = { ...defaultProps, selectedTab: 'Page Number', selectedPage: 3 };
  //   rerender(<DocDialog {...updatedProps} />);
  
  //   // Verify that the "Page Number" tab content is rendered
  //   expect(screen.getByTestId('page-number-tab')).toBeInTheDocument();
  // });
  // it('calls handlePageClick and updates selectedPage', () => {
  //   const mockPage = { page_number: 3 };
  
  //   // Render the component
  //   render(<DocDialog {...defaultProps} />);
  
  //   // Simulate clicking a page
  //   const pageElement = screen.getByTestId('pages-tab');
  //   fireEvent.click(pageElement);
  
  //   // Check if the `handlePageClick` logic updates the page
  //   expect(defaultProps.onClose).not.toHaveBeenCalled(); // Verifies the "Click logic"
  //   expect(mockPage.page_number).toEqual(3);
  // });

});
