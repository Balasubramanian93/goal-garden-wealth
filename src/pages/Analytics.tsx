
import MainLayout from "@/components/layout/MainLayout";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics & Insights</h1>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <p className="text-muted-foreground">
            This is where your portfolio analytics will be displayed. Please log in to view detailed insights.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
