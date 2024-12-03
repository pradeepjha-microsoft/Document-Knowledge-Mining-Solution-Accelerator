import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatRoom } from "./chatRoom";
import { AppContext } from "../../AppContext";
import { Completion, PostFeedback } from "../../api/chatService";
import React from "react";

jest.mock("../../api/chatService", () => ({
    Completion: jest.fn(),
    PostFeedback: jest.fn(),
}));

const mockContextValue = {
  conversationAnswers: [],
  setConversationAnswers: jest.fn(),
  query: "mockQuery",
  setQuery: jest.fn(),
  filters: { category: ["exampleFilter"] },
  setFilters: jest.fn(),
};

describe("ChatRoom Component", () => {
    const defaultProps = {
        searchResultDocuments: [],
        disableOptionsPanel: false,
        selectedDocuments: [],
        chatWithDocument: [],
        clearChatFlag: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders ChatRoom component", () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        expect(screen.getByPlaceholderText("Chat input")).toBeInTheDocument();
        expect(screen.getByText("New Topic")).toBeInTheDocument();
    });

    it("calls makeApiRequest on submitting a message", async () => {
        (Completion as jest.Mock).mockResolvedValueOnce({
            answer: "Test Answer",
            suggestingQuestions: [],
            documentIds: [],
            keywords: [],
        });

        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        const input = screen.getByPlaceholderText("Chat input");
        fireEvent.change(input, { target: { value: "Test Question" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        await waitFor(() => {
            expect(Completion).toHaveBeenCalledWith(
                expect.objectContaining({
                    Question: "Test Question",
                })
            );
        });
    });

    it("clears the chat when New Topic is clicked", () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        const newTopicButton = screen.getByText("New Topic");
        fireEvent.click(newTopicButton);

        expect(mockContextValue.setConversationAnswers).toHaveBeenCalledWith([]);
    });

    it("handles API error gracefully", async () => {
      (Completion as jest.Mock).mockRejectedValueOnce(new Error("API error"));

        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        const input = screen.getByPlaceholderText("Chat input");
        fireEvent.change(input, { target: { value: "Test Question" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        await waitFor(() => {
            expect(mockContextValue.setConversationAnswers).toHaveBeenCalled();
        });
    });

    it("toggles Feedback Form visibility", () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        const feedbackButton = screen.getByText("AI Generated Tag Incorrect");
        fireEvent.click(feedbackButton);

        expect(screen.getByText("Feedback Form")).toBeInTheDocument();
    });
});
