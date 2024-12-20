import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./home";
import { AppContext } from "../../AppContext";

// Mock import.meta
Object.defineProperty(global, "import.meta", {
    value: {
        env: {
            VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
        },
    },
});

// Mocking components
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: any) => key,
    }),
}));

jest.mock("../../api/chatService", () => ({
    Completion: jest.fn(),
    PostFeedback: jest.fn(),
}));

jest.mock("../../api/documentsService", () => ({
    searchDocuments: jest.fn(),
}));

jest.mock("react-tiff", () => ({
    TIFFViewer: () => <div>Tiff</div>,
}));

jest.mock("../../components/sidecarCopilot/sidecar", () => ({
    SidecarCopilot: () => <div>SidecarCopilot</div>,
}));

jest.mock("../../components/header/header", () => ({
    Header: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../../components/chat/chatRoom", () => ({
    ChatRoom: ({ clearChatFlag }: any) => <div>{clearChatFlag ? "Chat Cleared" : "Chat Room"}</div>,
}));

jest.mock("../../components/filter/showHideFilterButton", () => ({
    FilterButton: () => <div>FilterButton</div>,
}));

jest.mock("../../components/searchBox/searchBox", () => ({
    SearchBox: ({ placeholder }: any) => <input placeholder={placeholder} />,
}));

jest.mock("../../components/datePicker/dateFilterDropdownMenu", () => ({
    DateFilterDropdownMenu: () => <div>DateFilterDropdownMenu</div>,
}));

jest.mock("../../components/pagination/pagination", () => ({
    Pagination: () => <div>Pagination</div>,
}));

jest.mock("../../components/uploadButton/uploadButton2", () => ({
    UploadFilesButton: () => <div>UploadFilesButton</div>,
}));
const mockSetCurrentPage = jest.fn();
const mockSetPersistedFilters = jest.fn();
const mockSetConversationAnswers = jest.fn();

describe("Home Component", () => {
    it("renders the Home component with search box and filter button", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Check for header and filter button
        expect(screen.getByText(/components.header-bar.title/i)).toBeInTheDocument();
        expect(screen.getByText(/components.header-bar.sub-title/i)).toBeInTheDocument();
        expect(screen.getByText(/FilterButton/i)).toBeInTheDocument();

        // Check for the Search box
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

        // Test clicking the filter button and updating persisted filters
        const selectedKeywords = { category: ["tech"] };
        fireEvent.click(screen.getByText(/FilterButton/i));
        await waitFor(() => {
            expect(mockSetPersistedFilters).toHaveBeenCalledWith(selectedKeywords);
        });
    });

    it("updates query when typing in the search box", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const searchBox = screen.getByPlaceholderText("Search...");

        // Simulate typing into the search box
        userEvent.type(searchBox, "new query");

        expect(mockAppContext.setQuery).toHaveBeenCalledWith("new query");
    });

    it("filters documents based on the selected date filter", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Click on the DateFilterDropdownMenu
        fireEvent.click(screen.getByText(/DateFilterDropdownMenu/i));

        // Assuming the onFilterChange method gets called with a specific filter
        const selectedDateFilter = "last 7 days";
        await waitFor(() => {
            expect(mockAppContext.setFilters).toHaveBeenCalledWith({ dateFilter: selectedDateFilter });
        });
    });

    it("clears all filters when clicking the 'Clear all' button", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Simulate clicking the 'Clear all' button
        fireEvent.click(screen.getByText(/Clear all/i));

        // Verify that the appropriate reset functions are called
        await waitFor(() => {
            expect(mockAppContext.setFilters).toHaveBeenCalledWith({});
            expect(mockAppContext.setQuery).toHaveBeenCalledWith("");
        });
    });

    const mockAppContext = {
        query: "",
        setQuery: jest.fn(),
        filters: {},
        setFilters: mockSetPersistedFilters,
        conversationAnswers: [],
        setConversationAnswers: mockSetConversationAnswers,
        isLoading: true, // You can now include isLoading here
    };

    render(
        <BrowserRouter>
            <AppContext.Provider value={mockAppContext}>
                <Home />
            </AppContext.Provider>
        </BrowserRouter>
    );

    it("selects and deselects documents", async () => {
        const mockDocument = { documentId: 1, sourceName: "Document 1" };

        // Set up the mock for setSelectedDocuments
        const mockSetSelectedDocuments = jest.fn();

        const mockAppContext = {
            query: "",
            setQuery: jest.fn(),
            filters: {},
            setFilters: jest.fn(),
            conversationAnswers: [],
            setConversationAnswers: jest.fn(),
            isLoading: false,
            setCurrentPage: jest.fn(),
            setSelectedDocuments: mockSetSelectedDocuments, // Make sure setSelectedDocuments is here
        };

        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Get the document card by its text
        const documentCard = screen.getByText("Document 1");

        // Initially, the document is not selected, so clicking it should select it
        fireEvent.click(documentCard);
        expect(mockSetSelectedDocuments).toHaveBeenCalledWith([mockDocument]);

        // Clicking again should deselect it
        fireEvent.click(documentCard);
        expect(mockSetSelectedDocuments).toHaveBeenCalledWith([]); // Expecting empty array to deselect
    });

    it("paginates through the search results", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Ensure that the pagination component is rendered
        const paginationButton = screen.getByText(/Pagination/i); // Replace with a specific selector if necessary

        // Simulate a click on the pagination element (assuming it's a button or page number)
        fireEvent.click(paginationButton);

        // Check if setCurrentPage was called with the correct page number (e.g., 2)
        expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
    });
});

// test("handles filter change", () => {
//     render(
//         <Router>
//             <Home />
//         </Router>
//     );

//     const filterButton = screen.getByText(/filter/i);
//     userEvent.click(filterButton);

//     const filterOption = screen.getByText(/some filter option/i);
//     userEvent.click(filterOption);

//     expect(screen.getByText(/filtered documents/i)).toBeInTheDocument();
// });

// test("clear all button resets filters and search", () => {
//     render(
//         <Router>
//             <Home />
//         </Router>
//     );

//     const searchInput = screen.getByPlaceholderText(/search/i);
//     userEvent.type(searchInput, "Document 1");

//     const filterButton = screen.getByText(/filter/i);
//     userEvent.click(filterButton);
//     const filterOption = screen.getByText(/some filter option/i);
//     userEvent.click(filterOption);

//     const clearAllButton = screen.getByText(/clear all/i);
//     userEvent.click(clearAllButton);

//     expect(screen.getByText(/no filters applied/i)).toBeInTheDocument();
// });

//     test("handles pagination correctly", () => {
//         render(
//             <Router>
//                 <Home />
//             </Router>
//         );

//         const paginationNextButton = screen.getByText(/next/i);

//         userEvent.click(paginationNextButton);

//         expect(screen.getByText(/document 6/i)).toBeInTheDocument();
//     });

//     test("chat room scrolls to the bottom on document selection", async () => {
//         render(
//             <Router>
//                 <Home />
//             </Router>
//         );

//         const document = screen.getByText(/document title/i);

//         const chatContainer = screen.getByTestId("chat-container");

//         userEvent.click(document);

//         await waitFor(() => {
//             expect(chatContainer.scrollTop).toBeGreaterThan(0);
//         });
//     });
// });
