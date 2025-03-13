import Home from "@/components/Home";

export const metadata = {
  title: 'Dụng cụ vệ sinh Sao Việt',
  description: 'Dụng cụ vệ sinh Sao Việt',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_DOMAIN,
  }
}

export default function Page() {
  return (
    <div>
      <Home />
    </div>
  );
}
