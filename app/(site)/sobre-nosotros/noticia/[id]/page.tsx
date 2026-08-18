import { createClient } from "@/lib/supabase/server";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type NewsPost = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  image_url: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getPost(id: string): Promise<NewsPost | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news")
      .select("id, title, body, published_at, image_url")
      .eq("id", id)
      .maybeSingle();
    return (data as NewsPost | null) ?? null;
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="w-full bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/sobre-nosotros"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver a Sobre Nosotros
        </Link>

        <article className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[var(--shadow-elevated)]">
          {post.image_url ? (
            <div className="flex w-full justify-center bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image_url}
                alt={post.title}
                className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-48 w-full items-center justify-center bg-slate-100 py-16">
              <Newspaper className="h-12 w-12 text-slate-300" strokeWidth={1.5} />
            </div>
          )}

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <time className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              {new Date(post.published_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-slate-600 sm:text-lg">
              {post.body}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
