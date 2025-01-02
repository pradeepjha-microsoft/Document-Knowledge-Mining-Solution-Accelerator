// import { useDropzone } from "react-dropzone";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadButton from "./uploadButton";
import { jest } from "@jest/globals";
import { useDropzone } from "react-dropzone";

const mockDropZoneFunctions = () => {
    const mockOpen = jest.fn();
    const mockGetRootProps = jest.fn().mockReturnValue({
        "data-testid": "dropzone-root",
        refKey: "dropzone-root-ref",
    });
    const mockGetInputProps = jest.fn().mockReturnValue({
        "data-testid": "dropzone-input",
        refKey: "dropzone-input-ref",
    });
    (useDropzone as jest.Mock).mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        open: mockOpen,
        acceptedFiles: [],
    });
};

// Mock the react-dropzone module
jest.mock("react-dropzone", () => ({
    // Mock the useDropzone hook
    useDropzone: jest.fn(),
}));

describe("Upload Button Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.skip("renders and displays the Upload Button correctly", async () => {
        mockDropZoneFunctions();

        render(<UploadButton />);

        const uploadDocumentsButton = await screen.findByRole("button", { name: /upload documents/i });
        expect(uploadDocumentsButton).toBeInTheDocument();
    });

    it.skip("On click close upload dialog should close", async () => {
        mockDropZoneFunctions();

        render(<UploadButton />);

        // Click event for upload button we are doing here
        const uploadDocumentsButton = await screen.findByRole("button", { name: /upload documents/i });
        fireEvent.click(uploadDocumentsButton);

        // In upload dialog
        const headingWithUploadDocumentsText = await screen.findByRole("heading", { name: /upload Documents/i });
        expect(headingWithUploadDocumentsText).toBeInTheDocument();

        const closeUploadDialogBtn = screen.getByTestId("closeUploadDialogBtn");
        fireEvent.click(closeUploadDialogBtn);

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: /browse files/i })).not.toBeInTheDocument();
        });
    });

    it.skip("On click of Upload Button Dialog should open", async () => {
        mockDropZoneFunctions();

        render(<UploadButton />);

        // Click event for upload button we are doing here
        const uploadDocumentsButton = await screen.findByRole("button", { name: /upload documents/i });
        fireEvent.click(uploadDocumentsButton);

        // In upload dialog
        const headingWithUploadDocumentsText = await screen.findByRole("heading", { name: /upload Documents/i });
        expect(headingWithUploadDocumentsText).toBeInTheDocument();

        const dragAndDropArea = await screen.findByText(/drag and drop files/i);
        expect(dragAndDropArea).toBeInTheDocument();

        const browseFiles = await screen.findByRole("button", { name: /browse files/i });
        expect(browseFiles).toBeInTheDocument();
    });

    it("Browser file button to be handled correctly", async () => {
        const mockOpen = jest.fn();
        const mockGetRootProps = jest.fn().mockReturnValue({
            "data-testid": "dropzone-root",
        });
        const mockGetInputProps = jest.fn().mockReturnValue({
            "data-testid": "dropzone-input",
        });
        const mockOnDrop = jest.fn();

        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            open: mockOpen,
            onDrop: mockOnDrop,
        });
        render(<UploadButton />);

        // Click event for upload button we are doing here
        const uploadDocumentsButton = await screen.findByRole("button", { name: /upload documents/i });
        fireEvent.click(uploadDocumentsButton);

        const browseFilesButton = await screen.findByRole("button", { name: /browse files/i });
        expect(browseFilesButton).toBeInTheDocument();
        fireEvent.click(browseFilesButton);
        expect(mockOpen).toHaveBeenCalled();

        const fileInput = screen.getByTestId("dropzone-input");
        console.log(fileInput);

        // Create a mock file to simulate file selection
        const file = new File(["file content"], "example.pdf", { type: "application/pdf" });

        // Trigger the change event on the input field to simulate file selection

        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        await waitFor(() => {
            console.log(mockOnDrop.mock.calls);
            expect(mockOnDrop).toHaveBeenCalledWith([file]); // Assert onDrop is called with the file
        });

        await waitFor(
            () => {
                screen.debug();
                // console.log("upload dialog end");
                // You can add any checks to ensure the file selection was handled properly.
                // expect(screen.getByText(/uploading/i)).toBeInTheDocument(); // Ensure the file is being uploaded
            },
            { timeout: 5000 }
        );
    }, 6000);

    // it.skip("should select a file via clicking and call onDrop method", async () => {
    //     const mockOpen = jest.fn();
    //     const mockGetRootProps = jest.fn().mockReturnValue({
    //         "data-testid": "dropzone-root",
    //     });
    //     const mockGetInputProps = jest.fn().mockReturnValue({
    //         "data-testid": "dropzone-input",
    //     });
    //     const mockOnDrop = jest.fn();

    //     (useDropzone as jest.Mock).mockReturnValue({
    //         getRootProps: mockGetRootProps,
    //         getInputProps: mockGetInputProps,
    //         open: mockOpen,
    //         onDrop: mockOnDrop,
    //     });

    //     render(<UploadButton />);

    //     // Trigger the dialog open by clicking the Upload button
    //     const uploadButton = screen.getByRole("button", { name: /upload documents/i });
    //     fireEvent.click(uploadButton);

    //     // Get the file input element and create a mock file
    //     const fileInput = screen.getByTestId("dropzone-input");
    //     const file = new File(["file content"], "example.pdf", { type: "application/pdf" });

    //     // Simulate file selection by changing the input value
    //     fireEvent.change(fileInput, {
    //         target: { files: [file] },
    //     });

    //     // Check that the file was added to the uploading files
    //     await waitFor(() => {
    //         expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    //         expect(screen.getByText("example.pdf")).toBeInTheDocument();
    //     });

    //     // Ensure that the onDrop method was called with the selected file
    //     // const onDrop = useDropzone().onDrop;
    //     expect(mockOnDrop).toHaveBeenCalledWith([file]);
    // });

    it.only("input should handle File Drop correctly and upload file", async () => {
        const mockOpen = jest.fn();
        const mockOnDrop = jest.fn();
        const mockGetRootProps = jest.fn().mockReturnValue({
            "data-testid": "dropzone-root",
            onKeyDown: jest.fn(),
            onFocus: jest.fn(),
            onBlur: jest.fn(),
            onClick: jest.fn(),
            onDragEnter: jest.fn(),
            onDragOver: jest.fn(),
            onDragLeave: jest.fn(),
            onDrop: mockOnDrop,
            role: "presentation", // or use the appropriate role as needed
            ref: jest.fn(), // this can be used for a ref callback or other purposes
        });
        const mockGetInputProps = jest.fn().mockReturnValue({
            "data-testid": "dropzone-input",
            onKeyDown: jest.fn(),
            onFocus: jest.fn(),
            onBlur: jest.fn(),
            onClick: jest.fn(),
            onDragEnter: jest.fn(),
            onDragOver: jest.fn(),
            onDragLeave: jest.fn(),
            onDrop: mockOnDrop,
            role: "presentation", // or use the appropriate role as needed
            ref: jest.fn(), // this can be used for a ref callback or other purposes
        });

        (useDropzone as jest.Mock).mockReturnValue({
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            open: mockOpen,
            onDrop: mockOnDrop,
        });

        render(<UploadButton />);

        // Trigger the dialog open by clicking the Upload button
        const uploadButton = screen.getByRole("button", { name: /upload documents/i });
        fireEvent.click(uploadButton);

        // Get the file input element and create a mock file
        // Get the file input element (though this is not used for a "drop")
        const dropzoneRoot = screen.getByTestId("dropzone-root");
        console.log("dropzoneRoot debug start");
        screen.debug(dropzoneRoot);
        console.log("dropzoneRoot debug end");
        // console.log("dropzoneRoot", dropzoneRoot);
        // Create a mock file
        const file = new File(["file content"], "example.pdf", { type: "application/pdf" });

        // Simulate file drop by manually calling onDrop with the file
        fireEvent.drop(dropzoneRoot, {
            dataTransfer: {
                files: [file],
            },
        });

        expect(mockOnDrop).toHaveBeenCalledWith([file]);

        // // Check that the file was added to the uploading files
        // await waitFor(() => {
        //     expect(screen.getByText(/uploading/i)).toBeInTheDocument();
        //     expect(screen.getByText("example.pdf")).toBeInTheDocument();
        // });

        // Ensure that the onDrop method was called with the selected file
        // const onDrop = useDropzone().onDrop;
    });
});
