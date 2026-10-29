import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import StoryPlayer from "@/components/StoryPlayer";
import { getStory, isFormat, stories } from "@/lib/stories";

export function generateStaticParams() {
  return stories.map((story) => ({ id: story.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const story = getStory(id);
  return { title: story ? story.titre : "Histoire" };
}

export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ format?: string }>;
}) {
  const { id } = await params;
  const { format } = await searchParams;
  const story = getStory(id);
  if (!story) notFound();

  return (
    <>
      <Crumbs current="Histoire" />
      <header>
        <p className="eyebrow">
          <Link href="/apprendre?onglet=serie">Toute la série</Link> · {story.duree}
        </p>
        <h1>{story.titre}</h1>
        <p className="lede">{story.accroche}</p>
      </header>
      <StoryPlayer story={story} requested={isFormat(format) ? format : null} />
    </>
  );
}
