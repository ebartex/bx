"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

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

  // ✅ manual root highlight (ignores URL)
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);

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

  // 2) Build lookup maps (root/sub/item -> location) for O(1) open + active
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

  // ✅ Active PATH ids (root/sub) derived from activeId
  const activePath = useMemo(() => {
    const aid = activeId ? String(activeId) : null;
    if (!aid) return { aid: null, activeRootId: null, activeSubId: null };

    // if active is root
    if (index.rootById.has(aid)) {
      return { aid, activeRootId: aid, activeSubId: null };
    }

    // if active is sub
    const rootForSub = index.subToRoot.get(aid);
    if (rootForSub) {
      return { aid, activeRootId: rootForSub, activeSubId: aid };
    }

    // if active is item
    const rootForItem = index.itemToRoot.get(aid) ?? null;
    const subForItem = index.itemToSub.get(aid) ?? null;
    return { aid, activeRootId: rootForItem, activeSubId: subForItem };
  }, [activeId, index]);

  // ✅ Optional: when entering from URL directly (refresh), set default selectedRootId once
  useEffect(() => {
    if (!selectedRootId && activePath.activeRootId) {
      setSelectedRootId(activePath.activeRootId);
    }
  }, [activePath.activeRootId, selectedRootId]);

  // 3) Auto-open based on activeId
  useEffect(() => {
    if (!activeId) return;
    if (!tree.length) return;

    const aid = String(activeId);

    if (index.rootById.has(aid)) {
      setOpenRootId(aid);
      setOpenSubId(null);
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

                  // ✅ ROOT highlight is manual only (ignore URL)
                  const isRootSelected = selectedRootId === rid;

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
                        {/* ✅ HOVER-ZONE: tło na całej wysokości otwartego drzewa */}
                        <div
                          className={[
                            "relative rounded-md transition-colors",
                            isRootOpen ? "hover:bg-sidebar-accent/20 " : "",
                          ].join(" ")}
                        >
                          {/* ROOT */}
                          <SidebarMenuButton
                            data-active={isRootSelected}
                            onClick={() => {
                              // ✅ always select clicked root (remove previous)
                              setSelectedRootId(rid);

                              // ✅ since root click changes context, clear sub
                              setOpenSubId(null);

                              setOpenRootId((prev) =>
                                prev === rid ? null : rid
                              );
                            }}
                            className={[
                              "relative z-10", // ✅ above hover-zone bg
                              "active:bg-sidebar-accent/40 cursor-pointer w-full h-10 px-4 rounded-md transition-colors flex items-center gap-2 hover:bg-sidebar-accent/40",
                              isRootSelected
                                ? "!bg-transparent hover:!bg-sidebar-accent/40 !font-semibold"
                                : "hover:bg-sidebar-accent/40 active:bg-sidebar-accent/40 ",
                            ].join(" ")}
                          >
                            <ChevronRight className="transition-transform duration-200 opacity-70 text-brand2" />
                            <span className="truncate text-[13px] text-primary group-hover:text-foreground transition-colors">
                              {root.kod}
                            </span>
                          </SidebarMenuButton>

                          <CollapsibleContent className="relative z-10">
                            <SidebarMenuSub className="p-0 m-0 border-0 !border-l-0">
                              {subs.length ? (
                                <ScrollArea className="h-72">
                                  <div className="py-1">
                                    {subs.map((sub) => {
                                      const sid = String(sub.id);
                                      const isSubOpen = openSubId === sid;

                                      // sub bold from URL path
                                      const isSubInActivePath =
                                        activePath.activeSubId === sid;

                                      const toggleSub = () =>
                                        setOpenSubId((prev) =>
                                          prev === sid ? null : sid
                                        );

                                      const items = sub.children ?? [];

                                      return (
                                        <SidebarMenuItem key={sid}>
                                          <Collapsible
                                            open={isSubOpen}
                                            onOpenChange={(next) => {
                                              setOpenSubId(next ? sid : null);
                                            }}
                                            className="group/collapsible"
                                          >
                                            {/* SUB */}
                                            <SidebarMenuButton
                                              onClick={() => {
                                                setOpenSubId(sid);
                                                goCategory(sub);
                                              }}
                                              className={[
                                                "cursor-pointer",
                                                "w-full h-9 px-4 justify-start",
                                                "rounded-md transition-colors",
                                                "flex items-center",
                                                "active:bg-sidebar-accent/40",
                                                isSubInActivePath
                                                  ? "hover:bg-sidebar-accent/40 text-sidebar-accent-foreground font-semibold"
                                                  : "hover:bg-sidebar-accent/40 text-primary hover:text-foreground",
                                                "focus-visible:outline-md focus-visible:ring-2 focus-visible:ring-ring",
                                                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                              ].join(" ")}
                                            >
                                              <div className="flex w-full items-center gap-2 pl-6">
                                                <span
                                                  role="button"
                                                  aria-label="Rozwiń"
                                                  className="flex items-center justify-center size-4 -ml-1 rounded-md"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleSub();
                                                  }}
                                                >
                                                  <ChevronRight
                                                    className={[
                                                      "transition-transform duration-200 opacity-70 text-brand2",
                                                      isSubOpen
                                                        ? "rotate-90"
                                                        : "",
                                                    ].join(" ")}
                                                  />
                                                </span>

                                                <span className="truncate text-[13px]">
                                                  {sub.kod}
                                                </span>
                                              </div>
                                            </SidebarMenuButton>

                                            <CollapsibleContent>
                                              <SidebarMenuSub className="p-0 m-0 border-0 !border-l-0">
                                                {items.length ? (
                                                  <div className="py-1">
                                                    {items.map((it) => {
                                                      const itId = String(it.id);

                                                      const isActiveItem =
                                                        activePath.aid === itId;

                                                      return (
                                                        <SidebarMenuItem key={itId}>
                                                          {/* ITEM */}
                                                          <SidebarMenuButton
                                                            onClick={() =>
                                                              goCategory(it)
                                                            }
                                                            className={[
                                                              "cursor-pointer",
                                                              "w-full h-9 px-4 justify-start",
                                                              "rounded-md transition-colors",
                                                              "hover:bg-sidebar-accent/40",
                                                              "active:bg-sidebar-accent/40",
                                                              "focus-visible:outline-md focus-visible:ring-2 focus-visible:ring-ring",
                                                              "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                                              isActiveItem
                                                                ? "bg-sidebar-accent hover:bg-sidebar-accent text-foreground font-semibold"
                                                                : "text-primary hover:text-foreground",
                                                            ].join(" ")}
                                                          >
                                                            <span className="truncate text-[13px] pl-10">
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
                        </div>
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
