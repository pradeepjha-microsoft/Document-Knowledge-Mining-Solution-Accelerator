import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SidecarCopilot } from "./sidecar";
import { AppContext } from "../../AppContext";
import { Completion } from "../../api/chatService";
import { Button } from "@fluentui/react-components";
import { Textarea } from "@fluentai/textarea";
import { ChatApiResponse } from "../../api/apiTypes/chatTypes";

// Mock the necessary functions
jest.mock("@fluentai/textarea", () => ({
  Textarea: jest.fn(() => <textarea />),
}));
jest.mock("../../api/chatService", () => ({
  Completion: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn().mockReturnValue({ t: (key: any) => key }),
}));

describe("SidecarCopilot", () => {
  let mockSetConversationAnswers: jest.Mock;
  let mockSetQuery: jest.Mock;
  let mockSetFilters: jest.Mock;
  let mockConversationAnswers: any[];

  beforeEach(() => {
    // Mocking context and necessary hooks
    mockSetConversationAnswers = jest.fn();
    mockSetQuery = jest.fn();
    mockSetFilters = jest.fn();
    mockConversationAnswers = [
      ["How do I add a user?", { answer: "You can add a user by clicking 'Add User'", suggestingQuestions: [], documentIds: [], keywords: [] }],
    ];

    // Providing the required context values
    render(
      <AppContext.Provider
        value={{
          conversationAnswers: mockConversationAnswers,
          setConversationAnswers: mockSetConversationAnswers,
          query: "",
          setQuery: mockSetQuery,
          filters: {},
          setFilters: mockSetFilters,
        }}
      >
        <SidecarCopilot
          searchResultDocuments={[]}
          selectedDocuments={[]}
          chatWithDocument={[]}
        />
      </AppContext.Provider>
    );
  });

  it("renders without crashing", () => {
    expect(screen.getByPlaceholderText("Ask a question or request (ctrl + enter to submit)")).toBeInTheDocument();
  });

  it("clears the chat when 'New Topic' button is clicked", () => {
    const newTopicButton = screen.getByRole("button", { name: "components.chat.new-topic" });
    fireEvent.click(newTopicButton);

    expect(mockSetConversationAnswers).toHaveBeenCalledWith([]);
  });

  it("submits a question and makes an API request", async () => {
    const mockResponse: ChatApiResponse = {
      answer: "Here is the answer to your question.",
      suggestingQuestions: [],
      documentIds: [],
      keywords: [],
    };

    // Mock the API response
    (Completion as jest.Mock).mockResolvedValue(mockResponse);

    const textarea = screen.getByPlaceholderText("Ask a question or request (ctrl + enter to submit)");
    fireEvent.change(textarea, { target: { value: "What is React?" } });

    const submitButton = screen.getByRole("button", { name: "Send" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Completion).toHaveBeenCalledWith({
        Question: "What is React?",
        chatSessionId: "",
        DocumentIds: [],
      });

      // Verify conversation answers are updated
      expect(mockSetConversationAnswers).toHaveBeenCalledWith([
        ...mockConversationAnswers,
        ["What is React?", mockResponse, expect.any(Date), expect.any(Date)],
      ]);
    });
  });

  it("displays conversation messages correctly", () => {
    // Ensure the conversation messages render correctly
    expect(screen.getByText("How do I add a user?")).toBeInTheDocument();
    expect(screen.getByText("You can add a user by clicking 'Add User'")).toBeInTheDocument();
  });

  it("shows loading state when API request is in progress", async () => {
    // Mock the API request to simulate loading
    (Completion as jest.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    const textarea = screen.getByPlaceholderText("Ask a question or request (ctrl + enter to submit)");
    fireEvent.change(textarea, { target: { value: "What is Jest?" } });

    const submitButton = screen.getByRole("button", { name: "Send" });
    fireEvent.click(submitButton);

    expect(screen.getByText("Loading...")).toBeInTheDocument(); // You might need to adjust based on the actual loading indicator implementation

    await waitFor(() => {
      expect(Completion).toHaveBeenCalled();
    });
  });

  it("handles disabling sources correctly", () => {
    const sourceButton = screen.getByRole("button", { name: "Selected Document" });
    fireEvent.click(sourceButton);

    expect(screen.getByRole("button", { name: "Selected Document" })).toBeDisabled();
  });
});
