"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  type Node,
  type Edge,
  type NodeProps,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getAccountsByOrgId, getAccountById } from "@/lib/mock-data/accounts";
import type { Org } from "@/types/crm";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const NODE_WIDTH = 220;
const NODE_HEIGHT_ORG = 56;
const NODE_HEIGHT_ACCOUNT = 52;
const NODE_HEIGHT_CONTACT = 48;
const LEVEL_GAP = 120;
const ROW_GAP = 24;
const COL_GAP = 32;

type OrgChartNodeData = {
  label: string;
  sublabel?: string;
  href?: string;
  type: "org" | "account" | "contact";
  accountNumber?: string;
  role?: string;
  /** When viewing from an account, the main account is emphasized */
  isFocus?: boolean;
  /** Linked / other accounts when a focus account is set – shown subtly */
  isSubtle?: boolean;
};

function OrgNode({ data }: NodeProps<Node<OrgChartNodeData>>) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border-2 border-[#2C365D] bg-white px-3 py-2.5 shadow-sm dark:border-[#7c8cb8] dark:bg-gray-800"
      )}
      style={{ minWidth: NODE_WIDTH }}
    >
      <Handle id="target" type="target" position={Position.Top} className="!border-2 !border-[#2C365D] !bg-white dark:!border-[#7c8cb8] dark:!bg-gray-800" />
      <Handle id="source" type="source" position={Position.Bottom} className="!border-2 !border-[#2C365D] !bg-white dark:!border-[#7c8cb8] dark:!bg-gray-800" />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
        <Icon name="apartment" size={20} className="text-[#2C365D] dark:text-[#7c8cb8]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
          {data.label}
        </p>
        {data.sublabel && (
          <p className="truncate text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
            {data.sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

function AccountNode({ data }: NodeProps<Node<OrgChartNodeData>>) {
  const isFocus = data.isFocus;
  const isSubtle = data.isSubtle;
  const content = (
    <div
      className={cn(
        "relative flex items-center gap-2.5 rounded-lg border px-3 py-2 shadow-sm",
        isFocus &&
          "border-2 border-[#2C365D] bg-white shadow-md dark:border-[#7c8cb8] dark:bg-gray-800 dark:shadow-lg",
        isSubtle &&
          "border border-gray-200 bg-gray-50/80 dark:border-gray-600 dark:bg-gray-800/60",
        !isFocus && !isSubtle &&
          "border border-border bg-white dark:border-gray-600 dark:bg-gray-800"
      )}
      style={{ minWidth: NODE_WIDTH }}
    >
      <Handle
        id="target"
        type="target"
        position={Position.Top}
        className={cn(
          isFocus && "!border-2 !border-[#2C365D] !bg-white dark:!border-[#7c8cb8] dark:!bg-gray-800",
          isSubtle && "!border !border-gray-300 !bg-gray-100 dark:!border-gray-500 dark:!bg-gray-700",
          !isFocus && !isSubtle && "!border-2 !border-gray-400 !bg-white dark:!border-gray-500 dark:!bg-gray-800"
        )}
      />
      <Handle
        id="source"
        type="source"
        position={Position.Bottom}
        className={cn(
          isFocus && "!border-2 !border-[#2C365D] !bg-white dark:!border-[#7c8cb8] dark:!bg-gray-800",
          isSubtle && "!border !border-gray-300 !bg-gray-100 dark:!border-gray-500 dark:!bg-gray-700",
          !isFocus && !isSubtle && "!border-2 !border-gray-400 !bg-white dark:!border-gray-500 dark:!bg-gray-800"
        )}
      />
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          isFocus && "bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20",
          isSubtle && "bg-gray-100 dark:bg-gray-700",
          !isFocus && !isSubtle && "bg-gray-100 dark:bg-gray-700"
        )}
      >
        <Icon
          name="business"
          size={18}
          className={cn(
            isFocus && "text-[#2C365D] dark:text-[#7c8cb8]",
            (isSubtle || (!isFocus && !isSubtle)) && "text-gray-500 dark:text-gray-400"
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate",
            isFocus && "font-semibold text-gray-900 dark:text-gray-100",
            isSubtle && "font-normal text-gray-500 dark:text-gray-400",
            !isFocus && !isSubtle && "font-medium text-gray-900 dark:text-gray-100"
          )}
          style={{ fontSize: "var(--tally-font-size-sm)" }}
        >
          {data.label}
        </p>
        {data.accountNumber && (
          <p
            className={cn(
              "truncate",
              isSubtle ? "text-gray-400 dark:text-gray-500" : "text-muted-foreground"
            )}
            style={{ fontSize: "var(--tally-font-size-xs)" }}
          >
            {data.accountNumber}
          </p>
        )}
      </div>
    </div>
  );
  if (data.href) {
    return (
      <Link href={data.href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function ContactNode({ data }: NodeProps<Node<OrgChartNodeData>>) {
  const content = (
    <div
      className={cn(
        "relative flex items-center gap-2.5 rounded-lg border border-border bg-gray-50 px-3 py-1.5 shadow-sm dark:border-gray-600 dark:bg-gray-800/80"
      )}
      style={{ minWidth: NODE_WIDTH }}
    >
      <Handle id="target" type="target" position={Position.Top} className="!border-2 !border-gray-400 !bg-gray-100 dark:!border-gray-500 dark:!bg-gray-700" />
      <Handle id="source" type="source" position={Position.Bottom} className="!border-2 !border-gray-400 !bg-gray-100 dark:!border-gray-500 dark:!bg-gray-700" />
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
        <Icon name="person" size={14} className="text-gray-600 dark:text-gray-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-gray-900 dark:text-gray-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
          {data.label}
        </p>
        {data.role && (
          <p className="truncate text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
            {data.role}
          </p>
        )}
      </div>
    </div>
  );
  if (data.href) {
    return (
      <Link href={data.href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

const nodeTypes = {
  org: OrgNode,
  account: AccountNode,
  contact: ContactNode,
};

function getAccountsToShow(org: Org, focusAccountId: string | undefined): ReturnType<typeof getAccountsByOrgId> {
  const allAccounts = getAccountsByOrgId(org.id);
  if (!focusAccountId) return allAccounts;
  const focusAccount = allAccounts.find((a) => a.id === focusAccountId) ?? getAccountById(focusAccountId);
  if (!focusAccount || focusAccount.orgId !== org.id) return [];
  const linkedIds = new Set(focusAccount.linkedAccountIds ?? []);
  const accountsLinkingHere = allAccounts.filter((a) => a.linkedAccountIds?.includes(focusAccountId));
  const idsToShow = new Set([focusAccountId, ...linkedIds, ...accountsLinkingHere.map((a) => a.id)]);
  return allAccounts.filter((a) => idsToShow.has(a.id));
}

function buildOrgChartData(orgs: Org[], focusAccountId: string | undefined) {
  const nodes: Node<OrgChartNodeData>[] = [];
  const edges: Edge[] = [];
  const nodeIds = new Set<string>();
  const edgeKeys = new Set<string>();

  const addNode = (node: Node<OrgChartNodeData>) => {
    if (nodeIds.has(node.id)) return;
    nodeIds.add(node.id);
    nodes.push(node);
  };

  const addEdge = (edge: Edge) => {
    const key = `${edge.source}-${edge.target}-${edge.sourceHandle ?? ""}-${edge.targetHandle ?? ""}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({
      ...edge,
      sourceHandle: edge.sourceHandle ?? "source",
      targetHandle: edge.targetHandle ?? "target",
    });
  };

  const colWidth = NODE_WIDTH + COL_GAP;
  const accountRowY = LEVEL_GAP;

  for (const org of orgs) {
    const accounts = getAccountsToShow(org, focusAccountId);
    const orgId = `org-${org.id}`;
    const numAccounts = accounts.length;
    const centerX = numAccounts > 0 ? ((numAccounts - 1) * colWidth) / 2 : 0;

    addNode({
      id: orgId,
      type: "org",
      position: { x: centerX, y: 0 },
      data: { label: org.name, type: "org" },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    });

    const hasFocus = !!focusAccountId;
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const accId = `acc-${account.id}`;
      const accX = i * colWidth;
      const isFocus = hasFocus && account.id === focusAccountId;
      const isSubtle = hasFocus && account.id !== focusAccountId;

      addNode({
        id: accId,
        type: "account",
        position: { x: accX, y: accountRowY },
        data: {
          label: account.name,
          accountNumber: account.accountNumber,
          type: "account",
          href: `/crm/customer/accounts/${account.id}`,
          isFocus,
          isSubtle,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      } as Node<OrgChartNodeData>);
      addEdge({ id: `e-${orgId}-${accId}`, source: orgId, target: accId });

      if (account.linkedAccountIds?.length) {
        for (const linkedId of account.linkedAccountIds) {
          const targetAccId = `acc-${linkedId}`;
          if (accId < targetAccId) {
            addEdge({
              id: `link-${accId}-${targetAccId}`,
              source: accId,
              target: targetAccId,
              type: "smoothstep",
              style: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "6 4" },
              zIndex: -1,
            });
          }
        }
      }

      let contactY = accountRowY + NODE_HEIGHT_ACCOUNT + ROW_GAP;
      const seenContactIds = new Set<string>();
      for (const contact of account.contacts) {
        if (seenContactIds.has(contact.id)) continue;
        seenContactIds.add(contact.id);
        const conId = `con-${account.id}-${contact.id}`;
        addNode({
          id: conId,
          type: "contact",
          position: { x: accX, y: contactY },
          data: {
            label: contact.name,
            role: contact.role,
            type: "contact",
            href: `/crm/customer/contacts?contact=${contact.id}`,
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
        addEdge({ id: `e-${accId}-${conId}`, source: accId, target: conId });
        contactY += NODE_HEIGHT_CONTACT + ROW_GAP;
      }
    }
  }

  // Final safety: ensure only one edge per (source, target) so React Flow never draws duplicate lines
  const seen = new Set<string>();
  const uniqueEdges = edges.filter((e) => {
    const k = `${e.source}-${e.target}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { nodes, edges: uniqueEdges };
}

export default function OrgChartFlow({
  orgs,
  focusAccountId,
}: {
  orgs: Org[];
  focusAccountId?: string;
}) {
  const { nodes, edges } = useMemo(
    () => buildOrgChartData(orgs, focusAccountId),
    [orgs, focusAccountId]
  );

  if (nodes.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-gray-50 dark:bg-gray-800/50">
        <p className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-sm)" }}>
          {focusAccountId
            ? "No related accounts to display for this account."
            : "No organisations to display. Add an org to see the chart."}
        </p>
      </div>
    );
  }

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep" as const,
      style: { stroke: "#64748b", strokeWidth: 2 },
      zIndex: 0,
    }),
    []
  );

  return (
    <div className="h-[600px] w-full rounded-lg border border-border bg-gray-50/50 dark:bg-gray-800/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        className="rounded-lg"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="text-gray-200 dark:text-gray-700" />
        <Controls className="rounded-md border border-border bg-white shadow dark:border-gray-600 dark:bg-gray-800" />
      </ReactFlow>
    </div>
  );
}
