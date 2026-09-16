import { MessageSquareQuote, Quote } from "lucide-react";
import { reviews } from "@/constants/storefront";

export function Feedback() {
  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-theme-primary">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Verified Experiences
          </span>
          <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-theme-text-primary">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-sm text-theme-text-subtle">
            Real experiences from our growing community of happy shoppers.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-theme-border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <Quote className="h-5 w-5 text-theme-primary/40" />

              <p className="mt-3 text-sm leading-relaxed text-theme-text-primary">
                {review.feedback}
              </p>

              <div className="mt-5 pt-4 border-t border-theme-border">
                <p className="font-bold text-theme-text-primary">{review.name.replace(/,$/, "")}</p>
                <p className="text-xs text-theme-text-subtle">{review.location.split(",")[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feedback;
