import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatRoom } from "./chatRoom";
import { AppContext } from "../../AppContext";
import { Completion, PostFeedback } from "../../api/chatService";
import React from "react";

jest.mock("../../api/chatService", () => ({
    Completion: jest.fn(),
    PostFeedback: jest.fn(),
}));
jest.mock("../../components/chat/optionsPanel", () => ({
    OptionsPanel: (props: any) => <div data-testid="options-panel" {...props}></div>,
  }));
  jest.mock("../../components/chat/FeedbackForm", () => ({
    FeedbackForm: (props: any) => <div data-testid="feedback-form" {...props}></div>,
  }));
  
  jest.mock("../../components/documentViewer/documentViewer", () => ({
    DocumentViewer: () => <div>Mock Document Viewer</div>,
  }));
  
  jest.mock("../../components/sidecarCopilot/sidecar", () => ({
    SidecarCopilot: () => <div>Mock Sidecar Copilot</div>,
  }));
  
  Object.defineProperty(global, "import.meta", {
    value: {
      env: {
        VITE_API_ENDPOINT: "http://mock-api-endpoint.com",
      },
    },
  });
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
        expect(screen.getByLabelText("Chat input")).toBeInTheDocument();
        expect(screen.getByText("0 / 500")).toBeInTheDocument();
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

        const input = screen.getByLabelText("Chat input");
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
    
        const newTopicButton = screen.getByText("New Topic"); // Adjust the text if localization is applied.
        fireEvent.click(newTopicButton);
    
        // Check that it was called with a function
        expect(mockContextValue.setConversationAnswers).toHaveBeenCalled();
        expect(typeof mockContextValue.setConversationAnswers.mock.calls[0][0]).toBe("function");
    });
    

    it("handles API error gracefully", async () => {
      (Completion as jest.Mock).mockRejectedValueOnce(new Error("API error"));

        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );

        const input = screen.getByLabelText("Chat input");
        fireEvent.change(input, { target: { value: "Test Question" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

        await waitFor(() => {
            expect(mockContextValue.setConversationAnswers).toHaveBeenCalled();
        });
    });

    it.skip("toggles Feedback Form visibility", () => {
        render(
          <AppContext.Provider value={mockContextValue}>
            <ChatRoom {...defaultProps} />
          </AppContext.Provider>
        );
    
        // Simulate clicking the feedback button
        const feedbackButton = screen.getByText("AI Generated Tag Incorrect");
        fireEvent.click(feedbackButton);
    
        // Assert that the feedback form appears
        expect(screen.getByText("Feedback Form")).toBeInTheDocument();
      });
      it("submits user input and processes API response", async () => {
        const CompletionMock = require("../../api/chatService").Completion;
        CompletionMock.mockResolvedValueOnce({
          answer: "Test Answer",
          suggestingQuestions: ["Suggested Question 1", "Suggested Question 2"],
        });
    
        render(
          <AppContext.Provider value={mockContextValue}>
            <ChatRoom {...defaultProps} />
          </AppContext.Provider>
        );
    
        const input = screen.getByLabelText("Chat input");
        fireEvent.change(input, { target: { value: "Test Question" } });
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    
        await waitFor(() => {
          expect(CompletionMock).toHaveBeenCalledWith(
            expect.objectContaining({ Question: "Test Question" })
          );
        });
      });
      it("renders suggested questions when provided", () => {
        render(
          <AppContext.Provider value={mockContextValue}>
            <ChatRoom {...defaultProps} />
          </AppContext.Provider>
        );
    
        expect(screen.getByText("Follow-up question")).toBeInTheDocument();
      });
});
