import UserDetail from './UserDetail'
export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin User",
    description: "Dụng cụ vệ sinh Sao Việt - Admin User",
  }
}

const Admin = () => {
  return (
    <UserDetail />
  );
};

export default Admin;
