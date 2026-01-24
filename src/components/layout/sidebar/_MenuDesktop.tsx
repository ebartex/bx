"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getXt } from "../../../../services/api/xt";
import { slugify } from "@/utils/slugify";
import { Category } from "../../../../types/category";

// Tree types (3 levels)
type ItemNode = Category;
type SubNode = Category & { children?: ItemNode[] };
type RootNode = Category & { children?: SubNode[] };

export default function MenuDesktop() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [tree, setTree] = useState<RootNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Open state
  const [openRootId, setOpenRootId] = useState<string | null>(null);
  const [openSubId, setOpenSubId] = useState<string | null>(null);

  // --- helpers ---
  const getActiveIdFromPath = (path: string): string | null => {
    const m = path.match(/^\/categories\/view\/([^/]+)/);
    return m?.[1] ?? null;
  };

  const activeId = useMemo(() => getActiveIdFromPath(pathname), [pathname]);

  // 1) Fetch whole tree once
  useEffect(() => {
    let cancelled = false;

    const fetchTree = async () => {
      setLoading(true);
      try {
        const data = (await getXt("/xt/tree?root=2200")) as RootNode[];
        if (!cancelled) setTree(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching category tree:", e);
        if (!cancelled) setTree([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTree();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Build lookup maps (root/sub/item -> location) for O(1) open
  const index = useMemo(() => {
    const rootById = new Map<string, RootNode>();
    const subToRoot = new Map<string, string>();
    const itemToSub = new Map<string, string>();
    const itemToRoot = new Map<string, string>();

    for (const r of tree) {
      const rid = String(r.id);
      rootById.set(rid, r);

      const subs = r.children ?? [];
      for (const s of subs) {
        const sid = String(s.id);
        subToRoot.set(sid, rid);

        const items = s.children ?? [];
        for (const it of items) {
          const itId = String(it.id);
          itemToSub.set(itId, sid);
          itemToRoot.set(itId, rid);
        }
      }
    }

    return { rootById, subToRoot, itemToSub, itemToRoot };
  }, [tree]);

  // 3) Auto-open based on activeId
  useEffect(() => {
    if (!activeId) return;
    if (!tree.length) return;

    const aid = String(activeId);

    if (index.rootById.has(aid)) {
      setOpenRootId(aid);
      return;
    }

    const rootForSub = index.subToRoot.get(aid);
    if (rootForSub) {
      setOpenRootId(rootForSub);
      setOpenSubId(aid);
      return;
    }

    const subForItem = index.itemToSub.get(aid);
    const rootForItem = index.itemToRoot.get(aid);

    if (rootForItem) setOpenRootId(rootForItem);
    if (subForItem) setOpenSubId(subForItem);
  }, [activeId, tree, index]);

  const goCategory = (cat: Category) => {
    router.push(`/categories/view/${cat.id}/${slugify(cat.kod)}`);
  };

  return (
    <Sidebar
      side="left"
      variant="inset"
      collapsible="none"
      className="w-full h-full border-0 bg-transparent shadow-none static"
    >
      <SidebarContent className="h-full bg-background text-foreground border-r border-border shadow-sm">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm px-4 py-4 text-foreground">
            Kategorie
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <div className="px-4 py-2 space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-none" />
                  ))}
                </div>
              ) : !tree.length ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Brak kategorii
                </div>
              ) : (
                tree.map((root) => {
                  const rid = String(root.id);
                  const isRootOpen = openRootId === rid;

                  const subs = root.children ?? [];

                  return (
                    <SidebarMenuItem key={rid}>
                      <Collapsible
                        open={isRootOpen}
                        onOpenChange={(next) => {
                          setOpenRootId(next ? rid : null);
                          if (!next) setOpenSubId(null);
                        }}
                        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="
                              cursor-pointer
                              w-full h-10 px-4
                              rounded-md
                              hover:bg-accent active:bg-accent
                              transition-colors
                            "
                          >
                            <ChevronRight className="transition-transform duration-200 opacity-70 text-brand2" />
                            <span className="truncate text-[13px] text-primary group-hover:text-foreground transition-colors">
                              {root.kod}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="pl-0">
                            {subs.length ? (
                              <ScrollArea
                                className="
                                  h-72
                                  [&_[data-radix-scroll-area-viewport]]:px-1
                                  [&_[data-radix-scroll-area-viewport]]:pr-3
                                "
                              >
                                <div className="py-1">
                                  {subs.map((sub) => {
                                    const sid = String(sub.id);
                                    const isSubOpen = openSubId === sid;
                                    const isSubActive = activeId === sid;

                                    const items = sub.children ?? [];

                                    return (
                                      <SidebarMenuItem key={sid}>
                                        <Collapsible
                                          open={isSubOpen}
                                          onOpenChange={(next) => {
                                            setOpenSubId(next ? sid : null);
                                          }}
                                          className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
                                        >
                                          <div
                                            className={[
                                              "flex w-full group/sub-row rounded-md transition-colors",
                                              "hover:bg-accent active:bg-accent",
                                              isSubActive ? "bg-accent" : "",
                                            ].join(" ")}
                                          >
                                            <CollapsibleTrigger asChild>
                                              <SidebarMenuButton
                                                className="
                                                  cursor-pointer
                                                  w-9 h-9 px-2
                                                  rounded-md
                                                  text-muted-foreground
                                                  bg-transparent
                                                  hover:bg-accent active:bg-accent
                                                  transition-colors
                                                "
                                                title="Rozwiń"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <ChevronRight className="transition-transform duration-200 opacity-70 text-brand2" />
                                              </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            <SidebarMenuButton
                                              onClick={() => goCategory(sub)}
                                              className={[
                                                "cursor-pointer",
                                                "flex-1 w-full h-9 px-2 justify-start",
                                                "rounded-md",
                                                "bg-transparent hover:bg-transparent active:bg-transparent",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                isSubActive
                                                  ? "text-foreground"
                                                  : "text-primary group-hover/sub-row:text-foreground",
                                              ].join(" ")}
                                            >
                                              <span className="truncate text-[13px]">
                                                {sub.kod}
                                              </span>
                                            </SidebarMenuButton>
                                          </div>

                                          <CollapsibleContent>
                                            <SidebarMenuSub className="pl-0">
                                              {items.length ? (
                                                <div className="py-1">
                                                  {items.map((it) => {
                                                    const itId = String(it.id);
                                                    const isActiveItem = activeId === itId;

                                                    return (
                                                      <SidebarMenuItem key={itId}>
                                                        <SidebarMenuButton
                                                          onClick={() => goCategory(it)}
                                                          className={[
                                                            "cursor-pointer",
                                                            "w-full h-9 px-10 justify-start",
                                                            "rounded-md transition-colors",
                                                            "hover:bg-accent active:bg-accent",
                                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                            isActiveItem
                                                              ? "bg-accent text-foreground"
                                                              : "text-primary hover:text-foreground",
                                                          ].join(" ")}
                                                        >
                                                          <span className="truncate text-[13px]">
                                                            {it.kod}
                                                          </span>
                                                        </SidebarMenuButton>
                                                      </SidebarMenuItem>
                                                    );
                                                  })}
                                                </div>
                                              ) : (
                                                <div className="px-14 py-2 text-xs text-muted-foreground">
                                                  Brak itemkategorii
                                                </div>
                                              )}
                                            </SidebarMenuSub>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </SidebarMenuItem>
                                    );
                                  })}
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="px-10 py-2 text-xs text-muted-foreground">
                                Brak podkategorii
                              </div>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
