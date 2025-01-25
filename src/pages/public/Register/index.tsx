import { Layout } from "@/components/Layout";
import { Input } from "@/components/Input";
import * as S from "./styles";
import { useReducerForm } from "@/hooks/form/reducerForm";
import { Button } from "@/components/Button";
import { useSession } from "@/providers/SessionProvider";
import { useState, useEffect } from "react";
import { navigateAndReset } from "@/routes/utils";
import { useRegisterStore } from "@/stores/RegisterStore";
import LogoGlobe from "@/assets/svg/LogoGlobe";
import { View, Image } from "react-native";
import { getCep } from "@/api/cep";
import { Mask } from "@/utils/mask";
import * as courseApi from "@/api/course";
import { useTheme } from "styled-components/native";
import { handleApiError } from "@/api/ApiError";
import { FormStep1 } from "./Form/Step1";
import React from "react";
interface Course {
  id: number;
  uuid: string;
  title: string;
  price: number;
  subscription_type: string;
  logo: string;
}

interface FormData {
  name: string;
  email: string;
  document: string;
  zipCode: string;
  birthday: string;
  address: string;
  number: string;
  complement: string;
  phone: string;
  neighborhood: string;
  city: string;
}

export default function Register() {
  const {
    name: initialName,
    email: initialEmail,
    password,
  } = useRegisterStore();
  const theme = useTheme();
  const { register } = useSession();

  const { form, formSubmit, setFieldValue } = useReducerForm({
    name: { required: true, value: initialName },
    email: { required: true, value: initialEmail },
    document: { required: true },
    zipCode: { required: false },
    birthday: { required: false },
    address: { required: true },
    number: { required: true },
    complement: { required: false },
    phone: { required: true },
    neighborhood: { required: true },
    city: { required: true },
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await courseApi.getSelectData();
        setCourses(data?.response);
      } catch (error) {
        handleApiError(error, "Erro ao buscar cursos", true);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        name: form.name.value,
        email: form.email.value,
        password,
        document: form.document.value,
        birth_date: Mask.transformMaskBirthdayInUs(form.birthday.value),
        address: form.address.value,
        number: form.number.value,
        complement: form.complement.value,
        phone: form.phone.value,
        course_id: selectedCourse,
      };

      await register(payload);
      navigateAndReset("SignIn");
    } catch (error) {
      handleApiError(error, "Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  const renderCourseSelection = () => (
    <>
      <S.CourseContainer>
        {courses.map((course) => (
          <S.CourseCard
            key={course.id}
            onPress={() => setSelectedCourse(course.id)}
            style={
              selectedCourse === course.id && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              }
            }
          >
            <S.CourseImageContainer>
              <Image
                source={{ uri: course.logo }}
                style={{ width: "100%", height: 120, borderRadius: 8 }}
                resizeMode="cover"
              />
            </S.CourseImageContainer>
            <S.CourseContent>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <S.CourseTitle>{course.title}</S.CourseTitle>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.CoursePrice>
                  {Mask.formatCurrency(course.price)} por mês
                </S.CoursePrice>
              </View>
            </S.CourseContent>
          </S.CourseCard>
        ))}
      </S.CourseContainer>

      <Button
        onPress={formSubmit(handleSubmit)}
        variant="gradient"
        size="large"
        loading={loading}
        disabled={!selectedCourse}
      >
        Finalizar cadastro
      </Button>
    </>
  );

  return (
    <Layout
      useSafeArea
      useHeader
      icon={
        <View style={{ width: 50, height: 50 }}>
          <LogoGlobe
            style={{
              width: 116,
              height: 143,
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
        </View>
      }
    >
      <S.StepIndicator>
        <S.StepDot active={step === 1} />
        <S.StepDot active={step === 2} />
      </S.StepIndicator>

      {step === 1 ? (
        <FormStep1
          form={form}
          setFieldValue={setFieldValue}
          formSubmit={formSubmit}
          setStep={setStep}
          loading={loading}
        />
      ) : (
        renderCourseSelection()
      )}
    </Layout>
  );
}
