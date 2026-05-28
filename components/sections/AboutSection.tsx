import Image from "next/image";
import { siteConfig } from "@/lib/data";
import SubscribeForm from "@/components/newsletter/SubscribeForm";

export default function AboutSection() {
  const { author } = siteConfig;

  return (
    <section id="about" className="border-t border-border bg-surface py-16">
      <div className="magazine-container grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden">
          <Image
            src={author.image}
            alt={author.name}
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
        <div>
          <p className="section-subtitle">About</p>
          <h2 className="section-title mt-1">Meet {author.name}</h2>
          <p className="mt-1 font-medium text-primary">{author.role}</p>
          <p className="mt-6 text-muted leading-relaxed">{author.bio}</p>
          <div className="mt-8 max-w-md">
            <SubscribeForm variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
}
