import { toggleComplete } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CompleteForm({ contentId, done }: { contentId: string; done: boolean }) {
  return (
    <form action={toggleComplete}>
      <input type="hidden" name="content_id" value={contentId} />
      <input type="hidden" name="done" value={done ? "1" : "0"} />
      <SubmitButton className={done ? "btn btn-quiet" : "btn"} pendingText="Saving…">
        {done ? "Mark as not done" : "Mark as done"}
      </SubmitButton>
    </form>
  );
}
