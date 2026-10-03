import { getUsers, formatDate } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

const permissions = [
  ["userManagement", "Users"],
  ["workerView", "Worker view"],
  ["isOrderDeleted", "Delete order"],
  ["isMoreServicesAdded", "Add services"],
  ["isOrderReviewConfirmed", "Review"],
  ["isPhotosTakenSecondTime", "2nd photos"],
  ["isDeliveryConfirmed", "Delivery"],
];

export default async function UsersPage() {
  const users = await getUsers();

  const admins = users.filter(
    (user) => String(user.role || "").toLowerCase() === "admin"
  ).length;

  return (
    <>
      <div className="topbar">
        <div>
          <p className="eyebrow">Access Control</p>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            Staff roles and operational permissions.
          </p>
        </div>
      </div>

      <section className="grid-3">
        <article className="stat-card">
          <div className="stat-label">Total users</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-meta">Firestore user records</div>
        </article>

        <article className="stat-card green">
          <div className="stat-label">Admins</div>
          <div className="stat-value">{admins}</div>
          <div className="stat-meta">Users with Admin role</div>
        </article>

        <article className="stat-card cream">
          <div className="stat-label">Other users</div>
          <div className="stat-value">{Math.max(0, users.length - admins)}</div>
          <div className="stat-meta">Non-admin operational users</div>
        </article>
      </section>

      <section className="panel section-gap">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="strong">{user.name || "Unnamed user"}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                      {user.email || "No email"}
                    </div>
                  </td>
                  <td>
                    <span className="pill">{user.role || "User"}</span>
                  </td>
                  <td>
                    <div className="permission-grid">
                      {permissions.map(([key, label]) => (
                        <span
                          key={key}
                          className={`permission ${user[key] === true ? "on" : ""}`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{formatDate(user.createdAt, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
