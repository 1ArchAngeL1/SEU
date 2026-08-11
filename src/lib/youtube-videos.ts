/**
 * Videos from the SEU Development YouTube channel, shown in the news-page gallery.
 *
 * Snapshot taken 2026-08-11 from https://www.youtube.com/@seudevelopment9577
 * (7 videos). This is a static list — to add/replace a video, use the 11-char id
 * from its watch URL (`youtube.com/watch?v=<id>`). Order here is the display order.
 */
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@seudevelopment9577';

export interface ChannelVideo {
  /** 11-char YouTube video id (the `v` param of the watch URL). */
  id: string;
  /** Video title, as published on YouTube. */
  title: string;
}

export const CHANNEL_VIDEOS: ChannelVideo[] = [
  { id: '6dCWXfB7nvc', title: 'სეუ ვარკეთილი — SEU VARKETILI' },
  {
    id: 'r_miScU4lF8',
    title: '"მწვანე ეზოს" საცხოვრებელი კომპლექსის ეზო მუსია ქებურიამ მოხატა',
  },
  {
    id: 'zR_OOfwmCls',
    title: 'SEU Development-ის ახალი საცხოვრებელი პროექტი საბურთლოზე',
  },
  { id: '8fxVDNgDRxc', title: 'Real Estate Project Awards 2018' },
  {
    id: 'PSph7mIYx7s',
    title: 'SEU Development-ის პირველი საცხოვრებელი კომპლექსი',
  },
  { id: 'klxgREcaczw', title: 'სეუ დეველოპმენტის ახალი პროექტი' },
  { id: 'igLFt-ICY2k', title: 'ზურაბ მექვაბიშვილის ინტერვიუ' },
];
