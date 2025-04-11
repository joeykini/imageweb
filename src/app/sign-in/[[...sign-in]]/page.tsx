import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">登入您的賬戶</h2>
          <p className="mt-2 text-sm text-gray-600">
            或{" "}
            <a href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
              創建新賬戶
            </a>
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-500",
            },
          }}
        />
      </div>
    </div>
  );
} 