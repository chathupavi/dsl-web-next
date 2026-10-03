import { getServiceCategories } from "@/lib/admin-data";
import { revalidatePath } from "next/cache";
import ServicesClientView from "./services-client-view";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const categories = await getServiceCategories();

  async function handleAddService(categoryId, newService) {
    "use server";
    // Connect your Firestore write logic here
    revalidatePath("/admin/services");
  }

  async function handleEditService(categoryId, updatedService) {
    "use server";
    // Connect your Firestore update logic here
    revalidatePath("/admin/services");
  }

  return (
    <ServicesClientView
      initialCategories={categories || []}
      onAddService={handleAddService}
      onEditService={handleEditService}
    />
  );
}