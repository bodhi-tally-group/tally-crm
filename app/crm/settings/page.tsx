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

function RoleBadge({ role, label }: { role: string; label?: string }) {
  const config: Record<string, "default" | "info" | "warning"> = {
    admin: "default",
    "sales-rep": "info",
    "sales-manager": "info",
    "ops-supervisor": "warning",
  };
  const variant = config[role] ?? "default";
  return <Badge variant={variant}>{label ?? role}</Badge>;
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

function SectionHeader({
  title,
  description,
  action,
  borderless,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  borderless?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between p-density-lg", !borderless && "border-b border-border dark:border-gray-700")}>
      <div>
        <h3
          className="font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100"
          style={{ fontSize: "var(--tally-font-size-sm)" }}
        >
          {title}
        </h3>
        <p
          className="mt-density-xs text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-xs)" }}
        >
          {description}
        </p>
      </div>
      {action}
    </div>
  );
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
                className="h-10 w-[280px] rounded-density-md border border-border bg-white pl-9 pr-3 outline-none placeholder:text-muted-foreground focus:border-[#2C365D] focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                style={{ fontSize: "var(--tally-font-size-sm)" }}
              />
            </div>
            <Button size="sm" className="gap-1.5">
              <Icon name="person_add" size="var(--tally-icon-size-sm)" />
              Add User
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-[minmax(160px,240px)_1fr] gap-density-lg">
          {/* Settings nav */}
          <Card className="h-fit min-w-0 shrink-0 shadow-none">
            <div className="p-density-sm">
              {SETTINGS_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex w-full items-center gap-density-md rounded-density-md px-density-md py-density-md transition-colors",
                      isActive
                        ? "bg-[#2C365D]/10 font-semibold text-[#2C365D] dark:bg-[#7c8cb8]/10 dark:text-[#7c8cb8]"
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
          <div className="flex min-w-0 flex-col gap-density-lg">
            {/* Users */}
            {activeTab === "users" && (
              <Card className="shadow-none">
                <SectionHeader
                  title="User Management"
                  description="Manage CRM users and roles"
                  action={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Icon name="download" size="var(--tally-icon-size-sm)" />
                      Export
                    </Button>
                  }
                />
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          User
                        </TableHead>
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Role
                        </TableHead>
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Team
                        </TableHead>
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Status
                        </TableHead>
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Last Active
                        </TableHead>
                        <TableHead className="w-10 bg-gray-50 dark:bg-gray-800/50" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {USERS_DATA.map((user) => (
                        <TableRow key={user.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-density-md">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C365D] text-white dark:bg-[#7c8cb8]">
                                <span className="font-semibold" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                                  {user.initials}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.name}
                                </div>
                                <div className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} label={user.roleLabel} />
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {user.team}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center capitalize">
                              <StatusDot status={user.status as "active" | "inactive" | "pending"} />
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {user.lastActive}
                          </TableCell>
                          <TableCell className="w-10 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-7 w-7",
                                user.showDelete && "hover:bg-[#C40000]/10 hover:text-[#C40000]"
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
              </Card>
            )}

            {/* Roles */}
            {activeTab === "roles" && (
              <Card className="shadow-none">
                <SectionHeader
                  title="Role Management"
                  description="Define roles and access levels"
                  borderless
                  action={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Icon name="add" size="var(--tally-icon-size-sm)" />
                      Create Role
                    </Button>
                  }
                />
                <CardContent className="p-density-lg">
                  <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2">
                    {ROLES_DATA.map((role) => (
                      <div
                        key={role.name}
                        className="rounded-density-md border border-border p-density-lg transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                      >
                        <div className="mb-density-sm flex items-center justify-between">
                          <span
                            className="font-bold text-gray-900 dark:text-gray-100"
                            style={{ fontSize: "var(--tally-font-size-base)" }}
                          >
                            {role.name}
                          </span>
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
                        <div className="flex flex-wrap gap-density-xs">
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Permissions */}
            {activeTab === "permissions" && (
              <Card className="shadow-none">
                <SectionHeader
                  title="Permissions Matrix"
                  description="RBAC permissions by role"
                  action={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Icon name="download" size="var(--tally-icon-size-sm)" />
                      Export
                    </Button>
                  }
                />
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="bg-gray-50 font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Resource
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Administrator
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Manager
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Agent
                        </TableHead>
                        <TableHead className="bg-gray-50 text-center font-medium uppercase tracking-wider text-muted-foreground dark:bg-gray-800/50" style={{ fontSize: "var(--tally-font-size-xs)" }}>
                          Viewer
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PERMISSIONS_MATRIX.map((row) => (
                        <TableRow key={row.resource}>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            {row.resource}
                          </TableCell>
                          {(["admin", "manager", "agent", "viewer"] as const).map((col) => {
                            const icon = row[col];
                            const colorClass =
                              icon === "check"
                                ? "text-[#008000]"
                                : icon === "visibility"
                                  ? "text-[#0074C4]"
                                  : icon === "remove"
                                    ? "text-[#C53B00]"
                                    : "text-[#C40000]";
                            return (
                              <TableCell key={col} className="text-center">
                                <Icon name={icon} size="var(--tally-icon-size-sm)" className={colorClass} />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}

            {/* Placeholder tabs */}
            {activeTab !== "users" &&
              activeTab !== "roles" &&
              activeTab !== "permissions" && (
                <Card className="shadow-none">
                  <SectionHeader
                    title={SETTINGS_TABS.find((t) => t.key === activeTab)?.label ?? ""}
                    description="Configuration panel"
                  />
                  <CardContent className="p-density-xl">
                    <p className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                      This section will be wired to configuration APIs in Phase 2. For now, use the CRM API/DB spec to align the fields and validation rules.
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
