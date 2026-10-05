import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const consumables = await prisma.consumable.findMany({
    select: { category: true },
    where: { category: { not: null } },
    distinct: ['category']
  });
  
  const consumableCategories = consumables.map(c => c.category).filter(Boolean) as string[];

  return (
    <>
      <Navbar consumableCategories={consumableCategories} />
      <main className="flex-1 flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
