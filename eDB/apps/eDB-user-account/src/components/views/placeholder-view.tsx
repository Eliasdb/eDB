export function PlaceholderView({ title }: { title: string }) {
  return (
    <section className="rounded-xl bg-muted/50 p-6 md:min-h-min text-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-muted-foreground">
        This view has not been implemented yet.
      </p>
    </section>
  );
}
