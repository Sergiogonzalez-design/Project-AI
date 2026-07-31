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
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link
          href="/sobre-nosotros"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Volver a Sobre Nosotros
        </Link>

        <article className="mt-5 w-full overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          {post.image_url ? (
            <div className="flex w-full justify-center bg-slate-50">
              {/* Native size — no forced crop / aspect ratio */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image_url}
                alt={post.title}
                className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-48 w-full items-center justify-center bg-blue-50 py-16">
              <Newspaper className="h-12 w-12 text-blue-200" strokeWidth={1.5} />
            </div>
          )}

          <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <time className="text-xs font-medium text-blue-500">
              {new Date(post.published_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-none whitespace-pre-wrap text-base leading-relaxed text-slate-600 sm:text-lg">
              {post.body}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
