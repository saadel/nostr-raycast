import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { finalizeEvent, verifyEvent } from 'nostr-tools/pure';
import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import WebSocket from 'ws';

useWebSocketImplementation(WebSocket)

type Values = {
  textarea: string;
};

export default function Command() {
  async function handleSubmit(values: Values) {
    try {
      const privateKey = "1763b8234a24b263fae7a9c586583a77041ea37642047581a979c2f3c30c014e";
      
      const pool = new SimplePool()

      const event = finalizeEvent({
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: values.textarea,
      }, privateKey);

      const isGood = verifyEvent(event)
      console.log({isGood, event})
      await pool.publish(['wss://relay.damus.io','wss://relay.nostr.band'], event)
      
      showToast({ title: "Note Published", message: "Your note has been published to Nostr!" });

    } catch (error) {
      console.error("Error publishing note:", error);
      showToast({ style: Toast.Style.Failure, title: "Failed to Publish", message: "An error occurred while publishing the note." });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Publish a note to Nostr:" />
      <Form.TextArea id="textarea" title="Note content" placeholder="Enter your note here" />
    </Form>
  );
}
