import FormInput from "@/components/form/input";
import { LOGIN } from "@/constants/api-endpoints";
import { usePost } from "@/hooks/usePost";
import { setAccessToken, setRefreshToken } from "@/lib/set-token";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

type LoginFields = {
  username: string;
  password: boolean;
};

export default function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = usePost({
    onSuccess: (data) => {
      const access = data?.access;
      const refresh = data?.refresh;

      if (access) {
        setAccessToken(access);
        addToast({
          color: "success",
          title: "Kirish",
          description: "Tizimga muvvaqiyatli kirdingiz",
        });
      }
      if (refresh) {
        setRefreshToken(refresh);
      }
      navigate({ to: "/" });
    },
  });

  const form = useForm<LoginFields>();

  const onSubmit = (data: LoginFields) => {
    mutate(LOGIN, data);
  };

  return (
    <section className="flex justify-center items-center h-full  w-full ">
      <div className="flex justify-center  flex-col w-full border rounded-2xl  dark:shadow-slate-900 dark:border-zinc-800 px-4 py-12 ">
        <h1 className="text-3xl text-center mb-5">Tizimga kirish</h1>
        <form
          className="flex flex-col gap-3 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormInput
            isRequired
            label={"Login"}
            methods={form}
            name="username"
          />
          <FormInput
            isRequired
            label={"Parol"}
            methods={form}
            name="password"
            type="password"
          />
          <Button
            className="mt-3"
            color="primary"
            isLoading={isPending}
            type="submit"
          >
            Davom etish
          </Button>
        </form>
      </div>
    </section>
  );
}
