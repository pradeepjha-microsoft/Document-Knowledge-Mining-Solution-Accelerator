import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ChatRoom } from "./chatRoom";
import { AppContext } from "../../AppContext";
import { CopilotProvider, CopilotChat, UserMessage, CopilotMessage } from "@fluentai/react-copilot";

import { Completion, PostFeedback } from "../../api/chatService";
import React from "react";

jest.mock("../../api/chatService", () => ({
    Completion: jest.fn(),
    PostFeedback: jest.fn(),
}));
// Mock Copilot components
jest.mock("@fluentai/react-copilot", () => ({
  CopilotProvider: jest.fn(({ children }) => <div data-testid="copilot-provider">{children}</div>),
  CopilotChat: jest.fn(({ children }) => <div data-testid="copilot-chat">{children}</div>),
  UserMessage: jest.fn(({ children }) => <div data-testid="user-message">{children}</div>),
  CopilotMessage: jest.fn(({ children }) => <div data-testid="copilot-message">{children}</div>),
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
  setIsSticky: jest.fn(), 
};

describe("ChatRoom Component", () => {
    const defaultProps = {
        searchResultDocuments: [],
        disableOptionsPanel: false,
        selectedDocuments: [],
        chatWithDocument: [],
        clearChatFlag: false,
        setIsSticky: false,
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

    it("clears the chat when New Topic is clicked", async () => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );
    
        const newTopicButton = screen.getByTestId("new-topic-button"); // Adjust the text if localization is applied.
        fireEvent.mouseEnter(newTopicButton);

        // Click the "New Topic" button
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

      it("renders conversation answers correctly", () => {
        const mockSetConversationAnswers = jest.fn();

        const updatedProps = {
          ...defaultProps,
          
          conversationAnswers: [
              ["What is the capital of France?", { answer: "The capital of France is Paris.", suggestingQuestions: ["What is its population?"] }],
          ],
          setConversationAnswers: mockSetConversationAnswers,
          
      };
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...updatedProps} />
            </AppContext.Provider>
        );

        // Check if UserMessage and CopilotMessage components are rendered
        expect(screen.getByTestId("user-message")).toBeInTheDocument();
        expect(screen.getByTestId("copilot-message")).toBeInTheDocument();

        // Validate conversation text
        expect(screen.getByText("What is the capital of France?")).toBeInTheDocument();
        expect(screen.getByText("The capital of France is Paris.")).toBeInTheDocument();
    });

    it("renders follow-up questions and triggers them on click", async () => {
      const mockSetConversationAnswers = jest.fn();
      const updatedProps = {
        ...defaultProps,
        
        conversationAnswers: [
            ["What is the capital of France?", { answer: "The capital of France is Paris.", suggestingQuestions: ["What is its population?"] }],
        ],
        setConversationAnswers: mockSetConversationAnswers,
        
    };
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...updatedProps} />
            </AppContext.Provider>
        );

        // Check for the follow-up question
        const followUpButton = screen.getByText("What is its population?");
        expect(followUpButton).toBeInTheDocument();

        // Mock the API call when follow-up question is clicked
        const mockMakeApiRequest = jest.fn(() => Promise.resolve());
        jest.spyOn(ChatRoom.prototype, "makeApiRequest").mockImplementation(mockMakeApiRequest);

        // Simulate click on follow-up question
        await act(async () => {
            fireEvent.click(followUpButton);
        });

        // Validate the API call
        expect(mockMakeApiRequest).toHaveBeenCalledWith("What is its population?");
    });

    it("handles empty conversation answers gracefully", () => {
      const mockSetConversationAnswers = jest.fn();

        const updatedProps = {
          ...defaultProps,
          
          conversationAnswers: [
              ["What is the capital of France?", { answer: "The capital of France is Paris.", suggestingQuestions: ["What is its population?"] }],
          ],
          setConversationAnswers: mockSetConversationAnswers,
          
      };
        render(
            <AppContext.Provider value={{ ...mockContextValue, conversationAnswers: [] }}>
                <ChatRoom {...updatedProps} />
            </AppContext.Provider>
        );

        // Ensure no messages are rendered
        expect(screen.queryByTestId("user-message")).not.toBeInTheDocument();
        expect(screen.queryByTestId("copilot-message")).not.toBeInTheDocument();
    });
    it("submits user input and processes API response", async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
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
        screen.debug()

        });
      });
      it("renders suggested questions when provided", async () => {
        (Completion as jest.Mock).mockResolvedValueOnce({
          answer: "Test Answer",
          suggestingQuestions: ["Suggested Question 1", "Suggested Question 2"],
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
        const submitButton = screen.getByLabelText(/Send/i)     
        fireEvent.click(submitButton) 
        await waitFor(() => {
          expect(Completion).toHaveBeenCalled()
          expect(screen.getByText("Suggested Question 1")).toBeInTheDocument();
          expect(screen.getByText("Suggested Question 2")).toBeInTheDocument();
        });
      });
      
      it("renders attachments correctly within CopilotMessage", () => {
        render(
            <AppContext.Provider
                value={{
                    ...mockContextValue,
                    conversationAnswers: [
                        ["Prompt", { sources: [{ title: "Doc1" }, { title: "Doc2" }] } as any], // Use `as any` to bypass type checking
                    ],
                }}
            >
                <ChatRoom {...defaultProps} />
            </AppContext.Provider>
        );
    
        const attachments = screen.getAllByTestId("attachment-tag");
    
        expect(attachments).toHaveLength(2);
        expect(attachments[0]).toHaveTextContent("Doc1");
        expect(attachments[1]).toHaveTextContent("Doc2");
    });
    
    it("toggles feedback form visibility when AI tag is clicked", () => {
      render(
          <AppContext.Provider value={mockContextValue}>
              <ChatRoom {...defaultProps} />
          </AppContext.Provider>
      );
  
      const feedbackButton = screen.getByText("AI Generated Tag Incorrect");
  
      // Click to open the feedback form
      fireEvent.click(feedbackButton);
      expect(screen.getByTestId("feedback-form")).toBeInTheDocument();
  
      // Click again to close the feedback form
      fireEvent.click(feedbackButton);
      expect(screen.queryByTestId("feedback-form")).not.toBeInTheDocument();
  });
  it("renders suggested questions and handles follow-up clicks", () => {
    const mockFollowUp = jest.fn();

    render(
        <AppContext.Provider
            value={{
                ...mockContextValue,
                conversationAnswers: [
                    ["What is React?", {
                      suggestingQuestions: ["What is JSX?", "What is a hook?"],
                      answer: "",
                      documentIds: [],
                      keywords: []
                    }],
                ],
            }}
        >
            <ChatRoom {...defaultProps} />
        </AppContext.Provider>
    );

    const suggestedQuestions = screen.getAllByText(/What is/i);

    expect(suggestedQuestions).toHaveLength(2);
    fireEvent.click(suggestedQuestions[0]);
    expect(mockFollowUp).toHaveBeenCalledWith("What is JSX?");
});
it("sets sticky state based on scroll position", () => {
  render(
      <AppContext.Provider value={mockContextValue}>
          <ChatRoom {...defaultProps} />
      </AppContext.Provider>
  );

  const chatContainer = screen.getByLabelText("Chat input");
  const optionBottom = screen.getByTestId("options-bottom");

  // Mock the `getBoundingClientRect` for scroll behavior
  jest.spyOn(chatContainer, "getBoundingClientRect").mockReturnValueOnce({
    top: 100,
    bottom: 500,
    height: 400,
    width: 400,
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    toJSON: function () {
      throw new Error("Function not implemented.");
    }
  });
  jest.spyOn(optionBottom, "getBoundingClientRect").mockReturnValueOnce({
    top: 120,
    bottom: 150,
    height: 30,
    width: 400,
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    toJSON: function () {
      throw new Error("Function not implemented.");
    }
  });

  fireEvent.scroll(chatContainer, { target: { scrollTop: 150 } });

  // Assert sticky behavior
  expect(mockContextValue.setIsSticky).toHaveBeenCalledWith(false);

  // Simulate scrolling further down
  jest.spyOn(optionBottom, "getBoundingClientRect").mockReturnValueOnce({
    top: 50,
    bottom: 100,
    height: 30,
    width: 400,
    x: 0,
    y: 0,
    left: 0,
    right: 0,
    toJSON: function () {
      throw new Error("Function not implemented.");
    }
  });

  fireEvent.scroll(chatContainer, { target: { scrollTop: 250 } });

  expect(mockContextValue.setIsSticky).toHaveBeenCalledWith(true);
});
    
});
