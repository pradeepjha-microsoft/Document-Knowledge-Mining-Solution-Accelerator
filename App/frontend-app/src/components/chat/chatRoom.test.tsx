import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ChatRoom } from "./chatRoom";
import { AppContext } from "../../AppContext";
//import { CopilotProvider, CopilotChat, UserMessage, CopilotMessage } from "@fluentai/react-copilot";

import { Completion, PostFeedback } from "../../api/chatService";
import React from "react";

jest.mock("../../api/chatService", () => ({
    Completion: jest.fn(),
    PostFeedback: jest.fn(),
}));
// Mock Copilot components
// jest.mock("@fluentai/react-copilot", () => ({
//   CopilotProvider: jest.fn(({ children }) => <div data-testid="copilot-provider">{children}</div>),
//   CopilotChat: jest.fn(({ children }) => <div data-testid="copilot-chat">{children}</div>),
//   UserMessage: jest.fn(({ children }) => <div data-testid="user-message">{children}</div>),
//   CopilotMessage: jest.fn(({ children }) => <div data-testid="copilot-message">{children}</div>),
// }));
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
            [
                "What is the capital of France?",
                { 
                    answer: "The capital of France is Paris.",
                    suggestingQuestions: ["What is its population?"]
                }
            ],
        ],
        
          setConversationAnswers: mockSetConversationAnswers,
          
      };
        render(
            <AppContext.Provider value={mockContextValue}>
                <ChatRoom {...updatedProps} />
            </AppContext.Provider>
        );

        // Check if UserMessage and CopilotMessage components are rendered
        expect(screen.getByTestId("options-panel")).toBeInTheDocument();
        expect(screen.getByTestId("copilot-provider")).toBeInTheDocument();
        expect(screen.getByTestId("copilot-message")).toBeInTheDocument();

        // Validate conversation text
        //expect(screen.getByText("What is the capital of France?")).toBeInTheDocument();
        //expect(screen.getByText("The capital of France is Paris.")).toBeInTheDocument();
    });

    /*
    it.skip("renders follow-up questions and triggers them on click", async () => {
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

    it.skip("handles empty conversation answers gracefully", () => {
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
    */
    it.only("submits user input and processes API response", async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const CompletionMock = require("../../api/chatService").Completion;
        CompletionMock.mockResolvedValueOnce({
            "chatSessionId": "2c2d390c-7c82-4736-b7dc-e1fcd17e4253",
            "answer": "The document titled \"Accessibility in Housing: Findings from the 2019 American Housing Survey\" provides a comprehensive analysis of the accessibility needs of U.S. households, especially those facing mobility-related challenges. It reveals that nearly 20% of U.S. households, or approximately 23.1 million, include someone with accessibility needs, which can include individuals with mobility-related disabilities, those using mobility-assistive devices, and those having difficulties accessing their homes or using critical spaces like kitchens and bathrooms (Accessibility in Housing Report, Page 1). \n\nA significant finding is that many of these households reside in homes lacking essential accessibility features. For instance, around 40% of households that would benefit from having a bedroom and full bathroom on the entry level do not currently have both features. Moreover, only 5% of owner households plan to add accessibility features in the next two years, indicating a considerable gap in accessible housing (Accessibility in Housing Report, Page 12). \n\nDemographic trends identified in the report show that households headed by women (21%) are more likely to include persons with accessibility needs compared to those headed by men (17%). Additionally, households with lower socioeconomic status, including those with annual incomes under $20,000 (33%) and those with household heads having only grade school education (31%), are more likely to include individuals with accessibility needs (Accessibility in Housing Report, Page 9). \n\nIn terms of specific accessibility features, the report notes that only 5% of homes have ramps, and 1% have chairlifts or platform lifts. Among households with accessibility needs, 14% reported having a ramp or lift of some type, while 58% have both a bedroom and a full bathroom on the entry level (Accessibility in Housing Report, Page 12). The presence of these features varies significantly by region, with households in micropolitan or nonmetropolitan areas being more likely to have ramps or lifts compared to those in large metropolitan areas (Accessibility in Housing Report, Page 13). \n\nThe adequacy of home layouts for those with mobility challenges is also discussed. More than half (56%) of households that include persons using mobility-assistive devices rated their home's layout as meeting their needs \"very well,\" while only 4% rated it as \"not at all well\" (Accessibility in Housing Report, Page 17). However, the overall lack of accessibility features in homes suggests that many individuals may still face significant barriers to independent living. \n\nIn conclusion, the findings from the 2019 American Housing Survey emphasize the critical need for improved accessibility in U.S. housing. The data reveal that while a considerable portion of households includes individuals with accessibility needs, many of these homes lack essential features that would facilitate independent living. The report highlights disparities in accessibility based on socioeconomic status, geography, and household demographics, underscoring the urgent need for policy interventions and improvements in housing accessibility (Accessibility in Housing Report, Page 1).",
            "documentIds": [
                "9a31d6b935c44bc9b769b886a6a1535f202412020656379941562"
            ],
            "suggestingQuestions": [
                "What specific accessibility features are most needed in U.S. homes?",
                "How do demographic factors influence the need for accessible housing?",
                "What policy interventions could improve housing accessibility for those with mobility challenges?"
            ],
            "keywords": [
                "accessibility",
                "housing",
                "mobility challenges"
            ]
        });
    
        render(
          <AppContext.Provider value={mockContextValue}>
            <ChatRoom {...defaultProps} />
          </AppContext.Provider>
        );
    
        const input = screen.getByLabelText("Chat input");
        fireEvent.change(input, { target: { value: "Summarize this doc" } });
        act(()=>{
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        })
        // await waitFor(() => {
        //   expect(CompletionMock).toHaveBeenCalledWith(
        //     expect.objectContaining({ Question: "Test Question"  })
        //   );
        // });
        await waitFor(() => {
          screen.debug()
        })
      });
      /*
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
*/
    
});
