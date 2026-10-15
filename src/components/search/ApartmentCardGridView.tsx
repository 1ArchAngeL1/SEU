'use client';

import { useEffect } from 'react';
import ApartmentCard from '@/components/search/ApartmentCard';
import FadeIn from '@/components/FadeIn';
import { LIST, type ItemList, trackViewItemList } from '@/lib/analytics/events';
import type { Unit } from '@/model/types/api';

export type ApartmentCardGridViewProps = {
  data: Unit[];
  /** Which list this grid is, for analytics. Defaults to the search results. */
  list?: ItemList;
};

export const ApartmentCardGridView = ({
  data,
  list = LIST.searchResults,
}: ApartmentCardGridViewProps) => {
  // One impression per set of apartments on show — a new filter or a new page
  // is a new list, a re-render of the same one is not.
  const ids = data.map((u) => u.id).join(',');
  useEffect(() => {
    trackViewItemList(data, list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, list.id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 p-5 lg:p-8 xl:p-16 max-w-[1920px] mx-auto">
      {data.map((unit, i) => (
        <FadeIn key={unit.id} delay={(i % 4) * 80} duration={500}>
          <ApartmentCard data={unit} list={list} index={i} />
        </FadeIn>
      ))}
    </div>
  );
};
