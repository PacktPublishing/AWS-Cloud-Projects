import RecipeContent from "../../components/RecipeContent/RecipeContent";

function AdminPage() {
  return (
    <div>
      <RecipeContent isAdmin={true} />
    </div>
  );
}

export default AdminPage;
