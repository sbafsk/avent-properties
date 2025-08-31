import { MainLayout } from "@/components/main-layout";
import { ListingsHeader } from "@/components/sections/listings-header";
import { ListingsWithFilters } from "@/components/listings-with-filters";

export default function ListingsPage() {
  return (
    <MainLayout>
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <ListingsHeader />
          <ListingsWithFilters />
        </div>
      </div>
    </MainLayout>
  );
}
