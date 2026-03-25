import PageBanner from "@/components/common/banner";
import LoginForm from "@/components/modules/auth/loginForm";

export default async function LoginPage({
    searchParams,
  }: {
    searchParams: Promise<{ redirect?: string }>;
  }) {
  
    const params = await searchParams;
    const redirectURL = params?.redirect;
  
    return (
      <div>
        <PageBanner title="Login" />
        <LoginForm redirect={redirectURL} />
      </div>
    );
  }