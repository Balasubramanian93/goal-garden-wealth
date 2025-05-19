
import MainLayout from "@/components/layout/MainLayout";

const Portfolio = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Portfolio Overview</h1>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <p className="text-muted-foreground">
            This is where your portfolio tracking will be displayed. Please log in to view your investments.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Portfolio;
