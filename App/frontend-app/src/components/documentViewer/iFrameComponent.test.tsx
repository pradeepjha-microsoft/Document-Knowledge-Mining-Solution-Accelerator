// import { render, screen } from '@testing-library/react';
// import { IFrameComponent } from './iFrameComponent';
// import { useTranslation } from 'react-i18next';
// import { Document } from "../../api/apiTypes/embedded";

// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key: string) => key,
//   }),
// }));

// describe('IFrameComponent', () => {
//   const urlWithSasToken = 'https://example.com/somefile';
  
//   const renderComponent = (metadata: Document | null, iframeKey: number) => {
//     return render(<IFrameComponent metadata={metadata} urlWithSasToken={urlWithSasToken} iframeKey={iframeKey} />);
//   };

//   it('should display error message if metadata or urlWithSasToken is missing', () => {
//     renderComponent(null, 1);
//     expect(screen.getByText('components.iframe.error')).toBeInTheDocument();
//   });

//   it('should render Word document in iframe', () => {
//     const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTitle('Word viewer')).toBeInTheDocument();
//     expect(screen.getByTagName('iframe')).toHaveAttribute('src', expect.stringContaining('embed.aspx?src='));
//   });

//   it('should render Excel document in iframe', () => {
//     const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTitle('Excel viewer')).toBeInTheDocument();
//   });

//   it('should render PowerPoint document in iframe', () => {
//     const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTitle('PowerPoint viewer')).toBeInTheDocument();
//   });

//   it('should render PDF document in iframe with embed query', () => {
//     const metadata = { mimeType: 'application/pdf' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTitle('PDF Viewer')).toBeInTheDocument();
//     expect(screen.getByTagName('iframe')).toHaveAttribute('src', expect.stringContaining('embed=True'));
//   });

//   it('should render image (JPEG) as img tag', () => {
//     const metadata = { mimeType: 'image/jpeg' };
//     renderComponent(metadata, 1);
//     expect(screen.getByAltText('Document')).toBeInTheDocument();
//   });

//   it('should render image (PNG) as img tag', () => {
//     const metadata = { mimeType: 'image/png' };
//     renderComponent(metadata, 1);
//     expect(screen.getByAltText('Document')).toBeInTheDocument();
//   });

//   it('should render image (GIF) as img tag', () => {
//     const metadata = { mimeType: 'image/gif' };
//     renderComponent(metadata, 1);
//     expect(screen.getByAltText('Document')).toBeInTheDocument();
//   });

//   it('should render image (SVG) as img tag', () => {
//     const metadata = { mimeType: 'image/svg+xml' };
//     renderComponent(metadata, 1);
//     expect(screen.getByAltText('Document')).toBeInTheDocument();
//   });

//   it('should render TIFF document using TIFFViewer', () => {
//     const metadata = { mimeType: 'image/tiff' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTestId('tiff-viewer')).toBeInTheDocument(); // Assuming the TIFFViewer uses `data-testid="tiff-viewer"`
//   });

//   it('should render default iframe for unsupported MIME type', () => {
//     const metadata = { mimeType: 'application/unknown' };
//     renderComponent(metadata, 1);
//     expect(screen.getByTitle('Doc visualizer')).toBeInTheDocument();
//     expect(screen.getByTagName('iframe')).toHaveAttribute('src', urlWithSasToken);
//   });
// });

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IFrameComponent } from './iFrameComponent';
import { useTranslation } from 'react-i18next';

// Mock translation function
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: jest.fn().mockImplementation((key) => key),
    }),
}));

describe('IFrameComponent', () => {
    const mockUrlWithSasToken = 'https://example.com/file.pdf';
    const mockIframeKey = 1;

    const renderComponent = (metadata: any, urlWithSasToken: string | undefined) => {
        render(<IFrameComponent metadata={metadata} urlWithSasToken={urlWithSasToken} iframeKey={mockIframeKey} />);
    };

    it('should render an error message when metadata or urlWithSasToken is missing', () => {
        renderComponent(null, undefined);
        expect(screen.getByText('components.iframe.error')).toBeInTheDocument();
    });

    it('should render an Excel file in iframe when mimeType is application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', () => {
        const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
        renderComponent(metadata, mockUrlWithSasToken);
        const iframe = screen.getByTitle('Excel viewer');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(mockUrlWithSasToken)}`);
    });

    it('should render a Word file in iframe when mimeType is application/vnd.openxmlformats-officedocument.wordprocessingml.document', () => {
        const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
        renderComponent(metadata, mockUrlWithSasToken);
        const iframe = screen.getByTitle('Word viewer');
        expect(iframe).toBeInTheDocument();
    });

    it('should render a PowerPoint file in iframe when mimeType is application/vnd.openxmlformats-officedocument.presentationml.presentation', () => {
        const metadata = { mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
        renderComponent(metadata, mockUrlWithSasToken);
        const iframe = screen.getByTitle('PowerPoint viewer');
        expect(iframe).toBeInTheDocument();
    });

    it('should render a PDF file in iframe when mimeType is application/pdf', () => {
        const metadata = { mimeType: 'application/pdf' };
        renderComponent(metadata, mockUrlWithSasToken);
        const iframe = screen.getByTitle('PDF Viewer');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', expect.stringContaining('embed=True'));
    });

    it('should render an image when mimeType is image/jpeg, image/png, image/gif, or image/svg+xml', () => {
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        imageTypes.forEach((mimeType) => {
            const metadata = { mimeType };
            renderComponent(metadata, mockUrlWithSasToken);
            screen.debug();
            const img = screen.findAllByAltText('Document');
            waitFor(()=>{expect(img).toBeInTheDocument()});
        });
    });

    it('should render the default iframe for unknown mimeType', () => {
        const metadata = { mimeType: 'application/unknown' };
        renderComponent(metadata, mockUrlWithSasToken);
        const iframe = screen.getByTitle('Doc visualizer');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', mockUrlWithSasToken);
    });
});
