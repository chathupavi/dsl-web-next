import { getExpenses } from "@/lib/admin-data";
import { revalidatePath } from "next/cache";
import ExpensesClientView from "./expenses-client-view";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  async function handleAddExpense(newExpense) {
    "use server";
    // TODO: Connect your Firestore expense insert here
    // e.g., await addExpenseToFirestore(newExpense);
    revalidatePath("/admin/expenses");
  }

  async function handleEditExpense(updatedExpense) {
    "use server";
    // TODO: Connect your Firestore expense update here
    // e.g., await updateExpenseInFirestore(updatedExpense);
    revalidatePath("/admin/expenses");
  }

  return (
    <ExpensesClientView
      initialExpenses={expenses || []}
      onAddExpense={handleAddExpense}
      onEditExpense={handleEditExpense}
    />
  );
}