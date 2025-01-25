import { Input } from "@/components/Input";
import * as S from "../styles";
import { Button } from "@/components/Button";
import { getCep } from "@/api/cep";
import { handleApiError } from "@/api/ApiError";
import React from "react";
export const FormStep1 = ({
  form,
  setFieldValue,
  formSubmit,
  setStep,
  loading,
}: any) => {
  const handleCepChange = async (value: string) => {
    setFieldValue("zipCode", value);

    if (value.length === 9) {
      try {
        const { data } = await getCep(value);
        if (!data) return;

        setFieldValue("address", data.logradouro);
        setFieldValue("neighborhood", data.bairro);
        setFieldValue("city", data.localidade);
      } catch (error) {
        handleApiError(error, "Erro ao buscar CEP");
      }
    }
  };

  return (
    <>
      <S.Title style={{ flex: 1, paddingRight: "20%" }}>
        Olá {form.name.value}, {"\n"}
        Vamos finalizar o seu {"\n"} cadastro!
      </S.Title>

      <S.InputRow>
        <S.HalfInputContainer>
          <Input
            placeholder="Nome e sobrenome"
            variant="default"
            variantStyle="white"
            required
            label="Nome Completo"
            value={form.name.value}
            onChangeText={(value) => setFieldValue("name", value)}
            error={form.name.error}
          />
        </S.HalfInputContainer>

        <S.HalfInputContainer>
          <Input
            placeholder="email@email.com.br"
            variant="default"
            keyboardType="email-address"
            label="E-mail"
            required
            autoCapitalize="none"
            variantStyle="white"
            value={form.email.value}
            onChangeText={(value) => setFieldValue("email", value)}
            error={form.email.error}
          />
        </S.HalfInputContainer>
      </S.InputRow>

      <S.InputRow>
        <S.HalfInputContainer>
          <Input
            placeholder="000.000.000-57"
            variant="cpf"
            label="CPF"
            variantStyle="white"
            required
            value={form.document.value}
            onChangeText={(value) => setFieldValue("document", value)}
            error={form.document.error}
          />
        </S.HalfInputContainer>

        <S.HalfInputContainer>
          <Input
            placeholder="00/00/0000"
            variant="birthday"
            label="Data de nascimento"
            variantStyle="white"
            value={form.birthday.value}
            onChangeText={(value) => setFieldValue("birthday", value)}
            error={form.birthday.error}
          />
        </S.HalfInputContainer>
      </S.InputRow>

      <S.InputRow>
        <S.HalfInputContainer>
          <Input
            placeholder="60100-100"
            label="CEP"
            variant="cep"
            required
            variantStyle="white"
            value={form.zipCode.value}
            onChangeText={handleCepChange}
            error={form.zipCode.error}
          />
        </S.HalfInputContainer>

        <S.HalfInputContainer>
          <Input
            placeholder="(85) 99999.9999"
            variant="phone"
            label="Telefone"
            variantStyle="white"
            required
            value={form.phone.value}
            onChangeText={(value) => setFieldValue("phone", value)}
            error={form.phone.error}
          />
        </S.HalfInputContainer>
      </S.InputRow>

      <S.FullInputContainer>
        <Input
          placeholder="Rua/Avenida"
          label="Endereço"
          variant="default"
          variantStyle="white"
          value={form.address.value}
          onChangeText={(value) => setFieldValue("address", value)}
          error={form.address.error}
        />
      </S.FullInputContainer>

      <S.FullInputContainer>
        <Input
          placeholder="Bairro"
          label="Bairro"
          variant="default"
          variantStyle="white"
          value={form.neighborhood.value}
          onChangeText={(value) => setFieldValue("neighborhood", value)}
          error={form.neighborhood.error}
        />
      </S.FullInputContainer>

      <S.FullInputContainer>
        <Input
          placeholder="Cidade"
          label="Cidade"
          variant="default"
          variantStyle="white"
          value={form.city.value}
          onChangeText={(value) => setFieldValue("city", value)}
          error={form.city.error}
        />
      </S.FullInputContainer>

      <S.AddressRow>
        <S.NumberInput>
          <Input
            placeholder="100"
            variant="default"
            keyboardType="numeric"
            required
            label="Número"
            variantStyle="white"
            value={form.number.value}
            onChangeText={(value) => setFieldValue("number", value)}
            error={form.number.error}
          />
        </S.NumberInput>

        <S.ComplementInput>
          <Input
            placeholder="Complemento"
            variant="default"
            label="Complemento"
            variantStyle="white"
            value={form.complement.value}
            onChangeText={(value) => setFieldValue("complement", value)}
            error={form.complement.error}
          />
        </S.ComplementInput>
      </S.AddressRow>

      <Button
        onPress={formSubmit((isValid: boolean) => {
          if (isValid) setStep(2);
        })}
        variant="gradient"
        size="large"
        loading={loading}
      >
        Próximo
      </Button>
    </>
  );
};
