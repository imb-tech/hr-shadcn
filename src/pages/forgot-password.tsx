import { FormField, useFormFields } from "@/hooks/use-fields";
import { Link } from "@tanstack/react-router";
import { Path, useForm } from "react-hook-form";

type ResetFields = {
  email: string;
};

export default function ForgotPassword() {
  const resetFields: (FormField & { name: Path<ResetFields> })[] = [
    {
      name: "email",
      type: "text",
      label: "Email",
      required: true,
      placeholder: "Enter a email",
    },
  ];
  const form = useForm<ResetFields>()
  const { Form } = useFormFields<ResetFields>(resetFields, form);

  const onSubmit = (data: any) => {
    console.log("Register Data:", data);
  };

  return (
    <section className="flex items-center justify-center h-full flex-col">
      <h1 className="text-3xl text- mb-3">Reset password</h1>
      <Form
        onSubmit={onSubmit}
        className="flex flex-col"
        wrapperClassName="max-w-[400px]"
        submitText="Send confirm link"
      />
      <div className="max-w-[400px] w-full flex justify-end mt-1">
        <Link className="text-primary text-sm text-right" to="/login">
          Sign In
        </Link>
      </div>
    </section>
  );
}
