import { AIGuidedProvider, useAIGuided } from './state/AIGuidedContext'
import CanvasShell from './canvas/CanvasShell'
import EmptyStart from './canvas/EmptyStart'
import ChatPanel from './chat/ChatPanel'
import ChatFloatingButton from './chat/ChatFloatingButton'
import { useChatScript } from './chat/useChatScript'

function AIGuidedLayout() {
  const { chatOpen, hasStarted, setHasStarted, setActiveTab } = useAIGuided()
  const { sendUserQuickReply } = useChatScript()

  const handleStart = () => {
    setHasStarted(true)
    setActiveTab('connectors')
    // Chat kicks off the two clarifying questions before opening the form.
    sendUserQuickReply("Let's create a connector", 'offer-create-connector')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="flex-1 min-w-0 overflow-hidden">
        {hasStarted ? <CanvasShell /> : <EmptyStart onStart={handleStart} />}
      </div>
      {chatOpen && <ChatPanel />}
      {!chatOpen && <ChatFloatingButton />}
    </div>
  )
}

export default function AIGuidedApp() {
  return (
    <AIGuidedProvider>
      <AIGuidedLayout />
    </AIGuidedProvider>
  )
}
