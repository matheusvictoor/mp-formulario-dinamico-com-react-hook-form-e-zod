import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";

export default function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm();
  const registerWithMask = useHookFormMask(register);

  async function handleZipcodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const zipcode = e.target.value;
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);

    if (res.ok) {
      const data = await res.json();
      setValue("address", data.street);
      setValue("city", data.city);
    }
  }

  async function onSubmit(data: FieldValues) {
    console.log(data);

    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();

    if (!res.ok) {
      for (const field in resData.errors) {
        setError(field, { type: "manual", message: resData.errors[field] });
      }
    } else {
      console.log(resData);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "Este campo precisa ser preenchido",
            maxLength: {
              value: 255,
              message: "Nome ultrapassa o limite de caracteres permitidos.",
            },
          })}
        />

        {errors.email && (
          <p className="text-xs text-red-400 mt-1">
            {errors.name?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          className=""
          type="email"
          id="email"
          {...register("email", {
            required: "Este campo precisa ser preenchido",
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: "Email inválido",
            },
          })}
        />

        {errors.email && (
          <p className="text-xs text-red-400 mt-1">
            {errors.emal?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Este campo precisa ser preenchido",
              minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 6 caracteres",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password?.message as string}
            </p>
          )}

          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  size={20}
                  className="text-slate-600 cursor-pointer"
                />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="confirm-password"
            {...register("password_confirmation", {
              required: "Este campo precisa ser preenchido",
              minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 6 caracteres",
              },
            })}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password_confirmation?.message as string}
            </p>
          )}

          <span className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  size={20}
                  className="text-slate-600 cursor-pointer"
                />
              )}
            </button>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask("phone", "(99) 99999-9999", {
            required: "Este campo precisa ser preenchido",
            pattern: {
              value: /^\(\d{2}\) \d{5}-\d{4}$/,
              message: "Número de telefone inválido",
            },
          })}
        />
        {errors.phone && (
          <p className="text-xs text-red-400 mt-1">
            {errors.phone?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask("cpf", "999.999.999-99", {
            required: "Este campo precisa ser preenchido",
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: "CPF inválido",
            },
          })}
        />
        {errors.cpf && (
          <p className="text-xs text-red-400 mt-1">
            {errors.cpf?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask("cep", "99999-999", {
            required: "Este campo precisa ser preenchido",
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: "CEP inválido",
            },
          })}
          onBlur={handleZipcodeBlur}
        />
        {errors.cep && (
          <p className="text-xs text-red-400 mt-1">
            {errors.cep?.message as string}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          {...register("address")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          disabled
          {...register("city")}
        />
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms", {
            required: "Este campo precisa ser preenchido",
          })}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        {errors.terms && (
          <p className="text-xs text-red-400 mt-1">
            {errors.terms?.message as string}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:stroke-gray-200 flex justify-center"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
}
