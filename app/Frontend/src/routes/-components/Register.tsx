import { SignupForm } from "@/components/signup-form"

type SignUpPageProps = {
  onSwitch: () => void;
};

export function SignUpPage({ onSwitch }: SignUpPageProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 h-full">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/Register.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] dark:grayscale blur-[0px]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-slate-200">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-rose-600 text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <img src="/icon.png" alt="Icon" className="rounded-md"/>
            </div>  
            Mi Hírünk
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center bg-slate-100 rounded-4xl">
          <div className="w-full max-w-xs">
            <SignupForm onSwitch={onSwitch}/>
          </div>
        </div>
      </div>
    </div>
  )
}