import Home from "@/components/Home";

export const metadata = {
  title: 'Dụng cụ vệ sinh Sao Việt',
  description: 'Dụng cụ vệ sinh Sao Việt',
}

export default function Page() {
  return (
    <div>
      <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />
      <Home />
    </div>
  );
}
