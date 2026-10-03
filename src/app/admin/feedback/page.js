import { getFeedback } from "@/lib/admin-data";
import FeedbackClientView from "./feedback-client-view";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const feedback = await getFeedback();

  return <FeedbackClientView initialFeedback={feedback || []} />;
}