import User from './User'
export async function generateMetadata() {
  return {
    title: "Dụng cụ vệ sinh Sao Việt - Admin User",
    description: "Dụng cụ vệ sinh Sao Việt - Admin User",
  }
}

const Admin = () => {
  return (
    <User />
  );
};

export default Admin;
