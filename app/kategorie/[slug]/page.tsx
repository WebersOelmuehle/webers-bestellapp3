export default function Page({ params }: { params: { slug: string } }) {
  return <main>Kategorie: {params.slug}</main>;
}

