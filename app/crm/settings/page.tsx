"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Card/Card";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table/Table";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  { key: "users", label: "Users", icon: "group" },
  { key: "roles", label: "Roles", icon: "admin_panel_settings" },
  { key: "permissions", label: "Permissions", icon: "lock" },
  { key: "opportunityStages", label: "Opportunity Stages", icon: "layers" },
  { key: "caseTypes", label: "Case Types", icon: "sell" },
  { key: "slaPolicies", label: "SLA Policies", icon: "timer" },
  { key: "businessHours", label: "Business Hours", icon: "work_history" },
  { key: "templates", label: "Email Templates", icon: "drafts" },
  { key: "inboxes", label: "Inboxes", icon: "inbox" },
  { key: "audit", label: "Audit Log", icon: "history" },
  { key: "general", label: "General", icon: "tune" },
];

const USERS_DATA = [
  { id: "1", name: "Sarah Mitchell", email: "sarah.mitchell@tally.com", initials: "SM", role: "sales-manager", roleLabel: "Sales Manager", team: "Sales", status: "active", lastActive: "Today, 10:14 AM", showDelete: false },
  { id: "2", name: "John Davis", email: "john.davis@tally.com", initials: "JD", role: "sales-rep", roleLabel: "Sales Rep", team: "Sales", status: "active", lastActive: "Yesterday, 4:30 PM", showDelete: false },
  { id: "3", name: "Lisa Chen", email: "lisa.chen@tally.com", initials: "LC", role: "ops-supervisor", roleLabel: "Ops Supervisor", team: "Operations", status: "pending", lastActive: "Dec 8, 2024", showDelete: false },
  { id: "4", name: "Alex Morgan", email: "alex.morgan@tally.com", initials: "AM", role: "admin", roleLabel: "Administrator", team: "Admin", status: "inactive", lastActive: "Nov 30, 2024", showDelete: true },
];

const ROLES_DATA = [
  { name: "Administrator", count: 2, description: "Full system access, configuration, and audit privileges.", badges: [{ label: "All Access", active: true }, { label: "Audit", active: true }, { label: "RBAC", active: true }] },
  { name: "Sales Manager", count: 4, description: "Manage sales pipeline, approve contracts, oversee team performance.", badges: [{ label: "Opportunities", active: true }, { label: "Contracts", active: true }, { label: "Reports", active: false }] },
  { name: "Ops Supervisor", count: 3, description: "Manage case triage, SLA policies, and escalation workflows.", badges: [{ label: "Cases", active: true }, { label: "SLA", active: true }, { label: "Audit", active: false }] },
  { name: "Sales Rep", count: 12, description: "Manage assigned opportunities and activity logs.", badges: [{ label: "Opportunities", active: true }, { label: "Activities", active: false }, { label: "Documents", active: false }] },
];

const PERMISSIONS_MATRIX = [
  { resource: "Cases", admin: "check", manager: "check", agent: "check", viewer: "visibility" },
  { resource: "Opportunities", admin: "check", manager: "check", agent: "check", viewer: "visibility" },
  { resource: "Contracts", admin: "check", manager: "check", agent: "remove", viewer: "visibility" },
  { resource: "Admin", admin: "check", manager: "remove", agent: "close", viewer: "close" },
];

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, "default" | "info" | "warning"> = {
    admin: "default",
    "sales-rep": "info",
    "sales-manager": "info",
    "ops-supervisor": "warning",
  };
  const variant = config[role] ?? "default";
  return <Badge variant={variant}>{USERS_DATA.find((u) => u.role === role)?.roleLabel ?? role}</Badge>;
}

function StatusDot({ status }: { status: "active" | "inactive" | "pending" }) {
  const color =
    status === "active"
      ? "bg-[#008000]"
      : status === "inactive"
        ? "bg-[#C40000]"
        : "bg-[#C53B00]";
  return <span className={cn("mr-1.5 inline-block h-2 w-2 rounded-full", color)} />;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1600px] p-density-xl">
        {/* Page header */}
        <div className="mb-density-xl flex items-center justify-between">
          <div>
            <h1
              className="font-bold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: "var(--tally-font-size-3xl)",
                lineHeight: "var(--tally-line-height-tight)",
              }}
            >
              Settings &amp; User Access
            </h1>
            <p
              className="mt-density-xs text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              Configure users, roles, and CRM settings
            </p>
          </div>
          <div className="flex items-center gap-density-sm">
            <div className="relative">
              <Icon
                name="search"
                size="var(--tally-icon-size-md)"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-[280px] rounded-density-md border border-border bg-white py-2 pl-9 pr-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              />
            </div>
            <Button size="sm" className="gap-1.5">
              <Icon name="person_add" size="var(--tally-icon-size-sm)" className="mr-1" />
              Add User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-[220px_1fr]">
          {/* Settings nav */}
          <Card className="h-fit shadow-none">
            <div className="py-density-md">
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActiveTab(tab.key);
                    }}
                    className={cn(
                      "flex w-full items-center gap-density-sm border-l-[3px] border-transparent px-density-lg py-density-md transition-colors",
                      isActive
                        ? "border-l-[#2C365D] bg-[#2C365D]/5 font-semibold text-[#2C365D] dark:border-l-[#7c8cb8] dark:bg-[#7c8cb8]/10 dark:text-[#7c8cb8]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    )}
                    style={{ fontSize: "var(--tally-font-size-sm)" }}
                  >
                    <Icon name={tab.icon} size="var(--tally-icon-size-md)" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Content area */}
          <div className="flex flex-col gap-density-lg">
            {activeTab === "users" && (
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-gray-700">
                  <div>
                    <CardTitle
                      className="uppercase tracking-wider"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      User Management
                    </CardTitle>
                    <CardDescription
                      className="mt-density-xs"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Manage CRM users and roles
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Icon name="download" size="var(--tally-icon-size-sm)" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-b-density-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            User
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Role
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Team
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Status
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Last Active
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {USERS_DATA.map((user) => (
                          <TableRow key={user.id} className="group">
                            <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                              <div className="flex items-center gap-density-md">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C365D] text-white dark:bg-[#7c8cb8]">
                                  <span
                                    className="font-semibold"
                                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                                  >
                                    {user.initials}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.name}
                                  </div>
                                  <div
                                    className="text-muted-foreground"
                                    style={{ fontSize: "var(--tally-font-size-xs)" }}
                                  >
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                              <RoleBadge role={user.role} label={user.roleLabel} />
                            </TableCell>
                            <TableCell
                              className="text-gray-900 dark:text-gray-100"
                              style={{ fontSize: "var(--tally-font-size-sm)" }}
                            >
                              {user.team}
                            </TableCell>
                            <TableCell style={{ fontSize: "var(--tally-font-size-sm)" }}>
                              <span className="inline-flex items-center">
                                <StatusDot status={user.status} />
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell
                              className="text-gray-900 dark:text-gray-100"
                              style={{ fontSize: "var(--tally-font-size-sm)" }}
                            >
                              {user.lastActive}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-7 w-7",
                                  user.showDelete &&
                                    "hover:bg-[#C40000]/10 hover:text-[#C40000]"
                                )}
                              >
                                <Icon
                                  name={user.showDelete ? "delete" : "more_vert"}
                                  size="var(--tally-icon-size-sm)"
                                />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "roles" && (
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-gray-700">
                  <div>
                    <CardTitle
                      className="uppercase tracking-wider"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      Role Management
                    </CardTitle>
                    <CardDescription
                      className="mt-density-xs"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Define roles and access levels
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Icon name="add" size="var(--tally-icon-size-sm)" />
                    Create Role
                  </Button>
                </CardHeader>
                <CardContent className="p-density-xl">
                  <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                    {ROLES_DATA.map((role) => (
                      <Card
                        key={role.name}
                        className="border-2 border-transparent shadow-none transition-colors hover:border-border dark:hover:border-gray-700"
                      >
                        <CardContent className="p-density-xl">
                          <div className="mb-density-md flex items-center justify-between">
                            <div
                              className="font-bold text-gray-900 dark:text-gray-100"
                              style={{ fontSize: "var(--tally-font-size-base)" }}
                            >
                              {role.name}
                            </div>
                            <Badge variant="outline" className="text-muted-foreground">
                              {role.count} users
                            </Badge>
                          </div>
                          <p
                            className="mb-density-md leading-relaxed text-muted-foreground"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            {role.description}
                          </p>
                          <div className="flex flex-wrap gap-density-sm">
                            {role.badges.map((b) => (
                              <Badge
                                key={b.label}
                                variant={b.active ? "success" : "outline"}
                                className={!b.active ? "text-muted-foreground" : ""}
                              >
                                {b.label}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "permissions" && (
              <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-gray-700">
                  <div>
                    <CardTitle
                      className="uppercase tracking-wider"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      Permissions Matrix
                    </CardTitle>
                    <CardDescription
                      className="mt-density-xs"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      RBAC permissions by role
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Icon name="download" size="var(--tally-icon-size-sm)" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-b-density-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Resource
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Administrator
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Manager
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Agent
                          </TableHead>
                          <TableHead
                            className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50"
                            style={{ fontSize: "var(--tally-font-size-xs)" }}
                          >
                            Viewer
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PERMISSIONS_MATRIX.map((row) => (
                          <TableRow key={row.resource} className="group">
                            <TableCell
                              className="font-medium text-gray-900 dark:text-gray-100"
                              style={{ fontSize: "var(--tally-font-size-sm)" }}
                            >
                              {row.resource}
                            </TableCell>
                            <TableCell className="text-center">
                              <Icon
                                name={row.admin}
                                size="var(--tally-icon-size-sm)"
                                className={
                                  row.admin === "check"
                                    ? "text-[#008000]"
                                    : "text-[#C40000]"
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Icon
                                name={row.manager}
                                size="var(--tally-icon-size-sm)"
                                className={
                                  row.manager === "check"
                                    ? "text-[#008000]"
                                    : row.manager === "remove"
                                      ? "text-[#C53B00]"
                                      : "text-[#C40000]"
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Icon
                                name={row.agent}
                                size="var(--tally-icon-size-sm)"
                                className={
                                  row.agent === "check"
                                    ? "text-[#008000]"
                                    : row.agent === "remove"
                                      ? "text-[#C53B00]"
                                      : "text-[#C40000]"
                                }
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Icon
                                name={row.viewer}
                                size="var(--tally-icon-size-sm)"
                                className="text-[#C40000]"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab !== "users" &&
              activeTab !== "roles" &&
              activeTab !== "permissions" && (
                <Card className="shadow-none">
                  <CardHeader className="border-b border-border dark:border-gray-700">
                    <CardTitle
                      className="uppercase tracking-wider"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      {SETTINGS_TABS.find((t) => t.key === activeTab)?.label}
                    </CardTitle>
                    <CardDescription
                      className="mt-density-xs"
                      style={{ fontSize: "var(--tally-font-size-xs)" }}
                    >
                      Configuration panel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-density-xl">
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "var(--tally-font-size-sm)" }}
                    >
                      This section will be wired to configuration APIs in Phase
                      2. For now, use the CRM API/DB spec to align the fields
                      and validation rules.
                    </p>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
