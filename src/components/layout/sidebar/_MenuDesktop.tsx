"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

type SubMap = Record<string, Category[]>;

export default function MenuDesktop() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubMap>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = (await getXt("/xt/index?Xt-super=2200&Xt-root=2200")) as Category[];
        setCategories(data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };

    fetchCategories();
  }, []);

  const ensureSubcats = async (categoryId: string) => {
    if (subcategories[categoryId]) return;

    setLoadingId(categoryId);
    try {
      const data = (await getXt(`/xt/subcat?Xt-super=${categoryId}`)) as Category[];
      setSubcategories((prev) => ({ ...prev, [categoryId]: data }));
    } catch (e) {
      console.error("Error fetching subcategories:", e);
      setSubcategories((prev) => ({ ...prev, [categoryId]: [] }));
    } finally {
      setLoadingId(null);
    }
  };

  const goSubcat = (sub: Category) => {
    router.push(`/parentcategories/view/${sub.id}/${slugify(sub.kod)}`);
  };

  return (
    <Sidebar
      side="left"
      variant="inset"
      collapsible="none"
      className="w-full h-full border-0 bg-transparent shadow-none static"
    >
      <SidebarContent
        className="
          h-full
          bg-background
          text-foreground
          border-r border-border
          shadow-sm
        "
      >
        <SidebarGroup>
          <SidebarGroupLabel
            className="
              px-4 py-4
              border-b border-border
              text-foreground
            "
          >
            Kategorie
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {!categories.length ? (
                <div className="px-4 py-2 space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-none" />
                  ))}
                </div>
              ) : (
                categories.map((cat) => {
                  const isOpen = openId === cat.id;
                  const sub = subcategories[cat.id] || [];
                  const isLoading = loadingId === cat.id;

                  return (
                    <SidebarMenuItem key={cat.id}>
                      <Collapsible
                        open={isOpen}
                        onOpenChange={async (next) => {
                          setOpenId(next ? cat.id : null);
                          if (next) await ensureSubcats(cat.id);
                        }}
                        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="
                              w-full h-10 rounded-none px-4
                              hover:bg-accent
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-ring
                              focus-visible:ring-offset-2
                              focus-visible:ring-offset-background
                            "
                          >
                            <ChevronRight className="transition-transform opacity-70" />

                            {/* Ikona: jeśli masz token primary, użyj text-primary */}
                            <Folder className="opacity-80 text-primary" />

                            <span className="truncate text-[13px] text-primary group-hover:text-foreground transition-colors">
                              {cat.kod}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="pl-0">
                            {isLoading ? (
                              <div className="px-6 py-2 space-y-2">
                                <Skeleton className="h-8 w-full rounded-none" />
                                <Skeleton className="h-8 w-full rounded-none" />
                                <Skeleton className="h-8 w-full rounded-none" />
                              </div>
                            ) : sub.length ? (
                              <ScrollArea className="h-72">
                                <div className="py-1">
                                  {sub.map((s) => (
                                    <SidebarMenuItem key={s.id}>
                                      <SidebarMenuButton
                                        onClick={() => goSubcat(s)}
                                        className="
                                          w-full h-9 rounded-none px-10 justify-start
                                          hover:bg-accent
                                          text-primary
                                          hover:text-foreground
                                          focus-visible:outline-none
                                          focus-visible:ring-2
                                          focus-visible:ring-ring
                                          focus-visible:ring-offset-2
                                          focus-visible:ring-offset-background
                                        "
                                      >
                                        <span className="truncate text-[13px]">
                                          {s.kod}
                                        </span>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  ))}
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
