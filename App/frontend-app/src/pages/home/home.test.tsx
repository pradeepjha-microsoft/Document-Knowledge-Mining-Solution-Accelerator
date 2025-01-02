import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./home";
import { AppContext } from "../../AppContext";

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

const mockSetSelectedOption = jest.fn();
const mockSetResetSearchBox = jest.fn();
const mockSetAreFiltersVisible = jest.fn();
const mockSetShowCopilot = jest.fn();

const mockSetCurrentPage = jest.fn();
const mockSetPersistedFilters = jest.fn();
const mockSetConversationAnswers = jest.fn();

const mockAppContext = {
    query: "",
    setQuery: jest.fn(),
    filters: {},
    setFilters: mockSetPersistedFilters,
    conversationAnswers: [],
    setConversationAnswers: mockSetConversationAnswers,
    isLoading: true,
    setSelectedOption: mockSetSelectedOption,
    setResetSearchBox: mockSetResetSearchBox,
    setAreFiltersVisible: mockSetAreFiltersVisible,
    setShowCopilot: mockSetShowCopilot,
};

describe("Home Component", () => {
    const fixedNow = new Date(2025, 0, 1);
    const RealDate = Date;

    beforeAll(() => {
        global.Date = jest.fn(() => fixedNow) as unknown as DateConstructor;
    });

    afterAll(() => {
        global.Date = RealDate;
    });

    it("renders the Home component with search box, filter button, and pagination", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        expect(screen.getByText(/components.header-bar.title/i)).toBeInTheDocument();
        expect(screen.getByText(/components.header-bar.sub-title/i)).toBeInTheDocument();
        expect(screen.getByText(/FilterButton/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
        expect(screen.getByText(/Pagination/i)).toBeInTheDocument();
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
        userEvent.type(searchBox, "new query");

        expect(mockAppContext.setQuery).toHaveBeenCalledWith("new query");
    });

    it("applies the selected filter when clicking the FilterButton", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const selectedKeywords = { category: ["tech"] };
        fireEvent.click(screen.getByText(/FilterButton/i));
        await waitFor(() => {
            expect(mockSetPersistedFilters).toHaveBeenCalledWith(selectedKeywords);
        });
    });

    it("filters documents based on the selected date filter", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/DateFilterDropdownMenu/i));
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

        fireEvent.click(screen.getByText(/Clear all/i));
        await waitFor(() => {
            expect(mockAppContext.setFilters).toHaveBeenCalledWith({});
            expect(mockAppContext.setQuery).toHaveBeenCalledWith("");
        });
    });

    it("selects and deselects documents", async () => {
        const mockDocument = { documentId: 1, sourceName: "Document 1" };

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
            setSelectedDocuments: mockSetSelectedDocuments,
            resetSearchBox: false,
            setResetSearchBox: jest.fn(),
            setAreFiltersVisible: jest.fn(),
            setShowCopilot: jest.fn(),
        };

        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const documentCard = screen.getByText("Document 1");

        fireEvent.click(documentCard);

        expect(mockSetSelectedDocuments).toHaveBeenCalledWith([mockDocument]);

        fireEvent.click(documentCard);

        expect(mockSetSelectedDocuments).toHaveBeenCalledWith([]);
    });

    it("paginates through the search results", async () => {
        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const paginationButton = screen.getByText(/Pagination/i);
        fireEvent.click(paginationButton);

        expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
    });

    it("returns the correct date range for Past 24 hours", () => {
        const fixedNow = new Date(2025, 0, 1, 12, 0, 0);

        const mockCalculateDateRange = jest.fn((option) => {
            const now = fixedNow;
            const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return { startDate, endDate: now };
        });

        const { startDate, endDate } = mockCalculateDateRange("Past 24 hours");

        const expectedStartDate = new Date(fixedNow.getTime() - 24 * 60 * 60 * 1000);

        expect(startDate).toEqual(expectedStartDate);
        expect(endDate).toEqual(fixedNow);
    });

    it("returns the correct date range for Past week", () => {
        const fixedNow = new Date(2025, 0, 1);

        const mockCalculateDateRange = jest.fn((option) => {
            const now = fixedNow;
            const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return { startDate, endDate: now };
        });

        const { startDate, endDate } = mockCalculateDateRange("Past week");

        const expectedStartDate = new Date(fixedNow.getTime() - 7 * 24 * 60 * 60 * 1000);

        expect(startDate).toEqual(expectedStartDate);
        expect(endDate).toEqual(fixedNow);
    });

    it("returns the correct date range for custom date range", () => {
        const mockCalculateDateRange = jest.fn((option, customStartDate, customEndDate) => {
            return { startDate: customStartDate, endDate: customEndDate };
        });

        const customStartDate = new Date(fixedNow.getTime() - 15 * 24 * 60 * 60 * 1000);
        const customEndDate = new Date(fixedNow.getTime() - 5 * 24 * 60 * 60 * 1000);

        const { startDate, endDate } = mockCalculateDateRange("Custom", customStartDate, customEndDate);

        expect(startDate).toEqual(customStartDate);
        expect(endDate).toEqual(customEndDate);
    });

    /////

    it("applies w-[165%] if window.innerWidth is greater than 2000", () => {
        global.innerWidth = 2500;

        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const homeComponent = screen.getByText("Width class is applied based on the window width"); // Assuming this is the text inside your div
        expect(homeComponent).toHaveClass("w-[165%]");
    });
    it("applies w-[125%] if window.innerWidth is 2000 or less", () => {
        global.innerWidth = 1500;

        render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        const homeComponent = screen.getByText("Width class is applied based on the window width"); // Assuming this is the text inside your div
        expect(homeComponent).toHaveClass("w-[125%]");
    });
    it("updates widthClass when window is resized", () => {
        global.innerWidth = 2500;

        const { rerender } = render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        let homeComponent = screen.getByText("Width class is applied based on the window width");
        expect(homeComponent).toHaveClass("w-[165%]");

        act(() => {
            global.innerWidth = 1500;
            window.dispatchEvent(new Event("resize"));
        });

        rerender(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        homeComponent = screen.getByText("Width class is applied based on the window width");
        expect(homeComponent).toHaveClass("w-[125%]");
    });
    it("removes the resize event listener when the component is unmounted", () => {
        const removeEventListenerMock = jest.spyOn(window, "removeEventListener");

        global.innerWidth = 2500;

        const { unmount } = render(
            <BrowserRouter>
                <AppContext.Provider value={mockAppContext}>
                    <Home />
                </AppContext.Provider>
            </BrowserRouter>
        );

        unmount();

        expect(removeEventListenerMock).toHaveBeenCalledWith("resize", expect.any(Function));

        removeEventListenerMock.mockRestore();
    });
});
