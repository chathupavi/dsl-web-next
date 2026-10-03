import { getUsers, getAdminUsers, getServiceCategories } from "@/lib/admin-data";
import UsersClientView from "./UsersClientView";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [appUsers, adminUsers, categories] = await Promise.all([
    getUsers(),
    getAdminUsers(),
    getServiceCategories(),
  ]);

  return (
    <UsersClientView
      initialAppUsers={appUsers}
      initialAdminUsers={adminUsers}
      categories={categories}
    />
  );
}