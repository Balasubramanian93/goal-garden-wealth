
import MainLayout from "@/components/layout/MainLayout";

const Goals = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <p className="text-muted-foreground">
            This is where you'll create and track your financial goals. Please log in to access this feature.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Goals;
