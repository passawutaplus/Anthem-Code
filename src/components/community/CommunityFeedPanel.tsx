import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import { Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

import EmptyState from "@/components/ui/EmptyState";

import CommunityFeedTabs from "@/components/community/CommunityFeedTabs";

import CommunityCategoryChips from "@/components/community/CommunityCategoryChips";

import CommunityGridSkeleton from "@/components/community/CommunityGridSkeleton";

import CommunityPostGridCard from "@/components/feed/CommunityPostGridCard";

import DrillFeedPanel from "@/components/drill/DrillFeedPanel";

import { COMMUNITY_NEW_PATH } from "@/data/createActions";

import { useCommunityPosts } from "@/hooks/useCommunityPosts";

import { useCommunityFeedFilter } from "@/hooks/useCommunityFeedFilter";

import { useUserBlocks } from "@/hooks/useCommunityPostInteractions";

import { useActiveBoosts, buildBoostedIdSet, buildBoostTargetMaps } from "@/hooks/useBoost";

import { sortByBoostedIds } from "@/lib/boostFeedSort";

import { useAuth } from "@/hooks/useAuth";

import { useAuthDialog } from "@/stores/authDialogStore";

import { cn } from "@/lib/utils";



type Props = {

  search?: string;

};



const CommunityFeedPanel = ({ search = "" }: Props) => {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { filter, setFilter, queryFilter } = useCommunityFeedFilter();

  const { data: blockedSet } = useUserBlocks(user?.id);

  const blockedIds = useMemo(() => Array.from(blockedSet ?? []), [blockedSet]);



  const postsFilter = useMemo(

    () => ({

      ...queryFilter,

      viewerId: filter.feedSource === "following" ? user?.id : undefined,

      blockedIds,

    }),

    [queryFilter, filter.feedSource, user?.id, blockedIds],

  );



  const { data: posts = [], isLoading } = useCommunityPosts(postsFilter);

  const { data: activeBoosts = [] } = useActiveBoosts(80);
  const boostedPosts = useMemo(() => buildBoostedIdSet(activeBoosts).posts, [activeBoosts]);
  const boostPostMap = useMemo(() => buildBoostTargetMaps(activeBoosts).posts, [activeBoosts]);



  const visiblePosts = useMemo(() => {

    const q = search.trim().toLowerCase();

    const base = !q
      ? posts
      : posts.filter(

      (p) =>

        p.title.toLowerCase().includes(q) ||

        p.body.toLowerCase().includes(q) ||

        p.tags.some((t) => t.toLowerCase().includes(q)) ||

        (p.profile?.display_name ?? "").toLowerCase().includes(q),

    );

    return sortByBoostedIds(base, boostedPosts);

  }, [posts, search, boostedPosts]);



  const isDrillFeed = filter.feedSource === "drill";



  const openCreate = () => {

    if (!user) {

      useAuthDialog.getState().openSignup(COMMUNITY_NEW_PATH);

      return;

    }

    navigate(COMMUNITY_NEW_PATH);

  };



  const emptyDescription =

    filter.feedSource === "following" && !user

      ? "เข้าสู่ระบบเพื่อดูโพสต์จากคนที่คุณติดตาม"

      : filter.feedSource === "following"

        ? "ติดตามดีไซเนอร์เพื่อดูโพสต์ของพวกเขาที่นี่"

        : search.trim()

          ? `ไม่พบโพสต์สำหรับ "${search.trim()}"`

          : filter.category !== "All"

            ? `ยังไม่มีโพสต์ในหมวด ${filter.category}`

            : "มาเป็นคนแรกที่แชร์เรื่องราวกับชุมชนกันเถอะ";



  const postButton = (

    <Button

      size="sm"

      onClick={openCreate}

      className="rounded-full h-9 px-3 bg-gradient-brand text-white hover:opacity-90 border-0 gap-1"

    >

      <Plus className="w-4 h-4" />

      Post

    </Button>

  );



  return (

    <div className="space-y-3">

      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
          <CommunityFeedTabs
            feedSource={filter.feedSource}
            onChange={(feedSource) => setFilter({ ...filter, feedSource })}
          />
        </div>
        {!isDrillFeed && <div className="shrink-0">{postButton}</div>}
      </div>



      {isDrillFeed ? (
        <DrillFeedPanel />
      ) : (
        <>
      <CommunityCategoryChips

        selected={filter.category}

        onSelect={(category) => setFilter({ ...filter, category })}

      />



      {isLoading ? (

        <CommunityGridSkeleton />

      ) : visiblePosts.length === 0 ? (

        <EmptyState

          icon={SearchX}

          title="ยังไม่มีโพสต์ในฟีดนี้"

          description={emptyDescription}

          action={postButton}

        />

      ) : (

        <div className={cn("columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3")}>

          {visiblePosts.map((post) => (

            <div key={post.id} className="break-inside-avoid mb-2 sm:mb-3">

              <CommunityPostGridCard
                post={post}
                boosted={boostedPosts.has(post.id)}
                boostId={boostPostMap.get(post.id)}
              />

            </div>

          ))}

        </div>

      )}
        </>
      )}

    </div>

  );

};



export default CommunityFeedPanel;

