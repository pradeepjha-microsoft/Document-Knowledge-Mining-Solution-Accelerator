import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SidecarCopilot } from './sidecar';
import { OptionsPanel } from '../chat/optionsPanel';
import { AppContext } from '../../AppContext';
import { Completion } from '../../api/chatService';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';

// Mocking the necessary components and API calls
jest.mock('@fluentai/react-copilot-chat', () => ({
    CopilotProvider: jest.fn(),
    CopilotChat: jest.fn(),
    UserMessage: jest.fn(),
    CopilotMessage: jest.fn(),
}));

jest.mock('../../api/chatService', () => ({
    Completion: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: any) => key, // Mock translation function
    }),
}));


jest.mock('../chat/optionsPanel', () => ({
  OptionsPanel: jest.fn(() => <div>Mocked OptionsPanel</div>),
}));


describe('SidecarCopilot', () => {
    let setConversationAnswersMock: jest.Mock<any, any, any>;

    beforeEach(() => {
        setConversationAnswersMock = jest.fn();
        (Completion as jest.Mock).mockReset();
    });

    it('renders the component correctly', () => {
        render(
            <AppContext.Consumer>
                {({ conversationAnswers, setConversationAnswers }) => (
                    <SidecarCopilot
                        searchResultDocuments={[]}
                        selectedDocuments={[]}
                        chatWithDocument={[]}
                    />
                )}
            </AppContext.Consumer>
        );

        // Check if input field and button are rendered
        expect(screen.getByPlaceholderText('Ask a question or request (ctrl + enter to submit)')).toBeInTheDocument();
        expect(screen.getByText('components.chat.new-topic')).toBeInTheDocument();
    });

    it('handles sending a message and receiving a response', async () => {
        const mockResponse = { answer: '<p>Mock response</p>' };
        (Completion as jest.Mock).mockResolvedValue(mockResponse);

        render(
            <AppContext.Consumer>
                {({ conversationAnswers, setConversationAnswers }) => (
                    <SidecarCopilot
                        searchResultDocuments={[]}
                        selectedDocuments={[]}
                        chatWithDocument={[]}
                    />
                )}
            </AppContext.Consumer>
        );

        const inputField = screen.getByPlaceholderText('Ask a question or request (ctrl + enter to submit)');
        const sendButton = screen.getByRole('button', { name: 'components.chat.new-topic' });

        // Simulate user input and sending the message
        fireEvent.change(inputField, { target: { value: 'What is AI?' } });
        fireEvent.click(sendButton);

        // Mock API call to Completion
        await waitFor(() => expect(Completion).toHaveBeenCalledTimes(1));

        // Verify the answer was rendered
        expect(screen.getByText('Mock response')).toBeInTheDocument();
    });

    it('clears chat when new topic button is clicked', () => {
        render(
            <AppContext.Consumer>
                {({ conversationAnswers, setConversationAnswers }) => (
                    <SidecarCopilot
                        searchResultDocuments={[]}
                        selectedDocuments={[]}
                        chatWithDocument={[]}
                    />
                )}
            </AppContext.Consumer>
        );

        const newTopicButton = screen.getByRole('button', { name: 'components.chat.new-topic' });
        fireEvent.click(newTopicButton);

        // Check that the conversationAnswers were cleared
        expect(setConversationAnswersMock).toHaveBeenCalledWith([]);
    });

    it('correctly handles model and source changes', () => {
        render(
            <AppContext.Consumer>
                {({ conversationAnswers, setConversationAnswers }) => (
                    <SidecarCopilot
                        searchResultDocuments={[]}
                        selectedDocuments={[]}
                        chatWithDocument={[]}
                    />
                )}
            </AppContext.Consumer>
        );

        // Change model and source
        fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'chat_40' } });
        fireEvent.click(screen.getByText('Selected Document'));

        // Check if the model and source state is updated
        expect(screen.getByLabelText('Model')).toBe('chat_40');
        expect(screen.getByText('Selected Document')).toBeInTheDocument();
    });

    it('disables input when loading', async () => {
        (Completion as jest.Mock).mockResolvedValue({ answer: 'Loading...' });

        render(
            <AppContext.Consumer>
                {({ conversationAnswers, setConversationAnswers }) => (
                    <SidecarCopilot
                        searchResultDocuments={[]}
                        selectedDocuments={[]}
                        chatWithDocument={[]}
                    />
                )}
            </AppContext.Consumer>
        );

        const inputField = screen.getByPlaceholderText('Ask a question or request (ctrl + enter to submit)');

        // Ensure input is disabled while loading
        fireEvent.change(inputField, { target: { value: 'What is AI?' } });
        expect(inputField).toBeDisabled();

        await waitFor(() => expect(Completion).toHaveBeenCalledTimes(1));

        // Check that input is enabled again
        expect(inputField).not.toBeDisabled();
    });
});
