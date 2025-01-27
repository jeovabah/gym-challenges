import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useReducer } from "react";
import { HeaderPage } from "@/components/HeaderPage";
import { Ionicons } from "@expo/vector-icons";
import { Mask } from "@/utils/mask";

export type Professional = {
  id: string;
  name: string;
  photoLink: string;
  phoneWpp: string;
};

export type ProfessionalGym = {
  id: string;
  gymId: string;
  profesionalId: string;
  profesional: Professional;
};

export type Shift = {
  id: string;
  gymId: string;
  day: string;
  shift: string;
  createdAt: string;
  updatedAt: string;
};

type Gym = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  valueMonth: number;
  description: string;
  phoneWpp: string;
  instagram: string;
  cupomActive: boolean;
  logo: string;
  website: string;
  anualStart: string;
  details1: string;
  details2: string;
  details3: string;
  details4: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  Profesionals: ProfessionalGym[];
  shifts: Shift[];
};

type State = {
  showDetails: boolean;
  showProfessionals: boolean;
  showSchedule: boolean;
};

type Action =
  | { type: "TOGGLE_DETAILS" }
  | { type: "TOGGLE_PROFESSIONALS" }
  | { type: "TOGGLE_SCHEDULE" };

const initialState: State = {
  showDetails: true,
  showProfessionals: false,
  showSchedule: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_DETAILS":
      return { ...state, showDetails: !state.showDetails };
    case "TOGGLE_PROFESSIONALS":
      return { ...state, showProfessionals: !state.showProfessionals };
    case "TOGGLE_SCHEDULE":
      return { ...state, showSchedule: !state.showSchedule };
    default:
      return state;
  }
}

export const GymDetails = ({ route }: any) => {
  const { gym: item } = route.params;
  const [state, dispatch] = useReducer(reducer, initialState);
  const gym: Gym = item;

  const handleOpenLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handleWhatsApp = (phone: string) => {
    const whatsappUrl = `whatsapp://send?phone=${phone}`;
    Linking.openURL(whatsappUrl);
  };

  return (
    <SafeAreaView className="flex-1 bg-background py-2">
      <ScrollView>
        <View className="px-4 my-4">
          <HeaderPage hasBack title={gym.name} />

          {gym.logo ? (
            <Image
              source={{ uri: gym.logo }}
              style={{ height: 200, borderRadius: 12 }}
              resizeMode="cover"
              className="mt-4"
            />
          ) : (
            <View className="mt-4 h-[200px] bg-zinc-800 rounded-xl items-center justify-center">
              <Text className="text-gray-400">Sem logo disponível</Text>
            </View>
          )}

          <TouchableOpacity
            className="mt-4 bg-zinc-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => dispatch({ type: "TOGGLE_DETAILS" })}
          >
            <Text className="text-white font-poppins-medium text-lg">
              Informações Gerais
            </Text>
            <Ionicons
              name={state.showDetails ? "chevron-up" : "chevron-down"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {state.showDetails && (
            <View className="bg-zinc-800 px-4 pb-4 rounded-b-lg">
              <Text className="text-gray-300 mb-2 text-lg">
                Descrição: {gym.description}
              </Text>
              <Text className="text-gray-300 mb-2 text-lg">
                Tempo de mercado: {gym.anualStart}
              </Text>
              <View className="mt-2">
                <Text className="text-purple-400 mb-1 text-lg">Destaques:</Text>
                <Text className="text-gray-300 text-base">
                  • {gym.details1}
                </Text>
                <Text className="text-gray-300 text-base">
                  • {gym.details2}
                </Text>
                <Text className="text-gray-300 text-base">
                  • {gym.details3}
                </Text>
                <Text className="text-gray-300 text-base">
                  • {gym.details4}
                </Text>
              </View>

              <Text className="text-gray-300 mt-4 mb-2 text-lg">
                Endereço: {gym.address}
              </Text>
              <Text className="text-gray-300 mb-4 text-lg">
                Mensalidade: {Mask.formatCurrency(gym.valueMonth || 0)}
              </Text>

              <View className="flex-row space-x-2 gap-4">
                <TouchableOpacity
                  className="bg-green-600 p-2 rounded-lg flex-1"
                  onPress={() => handleWhatsApp(gym.phoneWpp)}
                >
                  <Text className="text-white text-center">WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-purple-600 p-2 rounded-lg flex-1"
                  onPress={() => handleOpenLink(gym.instagram)}
                >
                  <Text className="text-white text-center">Instagram</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            className="mt-4 bg-zinc-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => dispatch({ type: "TOGGLE_PROFESSIONALS" })}
          >
            <Text className="text-white font-poppins-medium text-lg">
              Profissionais
            </Text>
            <Ionicons
              name={state.showProfessionals ? "chevron-up" : "chevron-down"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {state.showProfessionals && (
            <View className="bg-zinc-800 px-4 pb-4 rounded-b-lg">
              {gym.Profesionals.length > 0 ? (
                gym.Profesionals.map((prof) => (
                  <View
                    key={prof.id}
                    className="mb-4 bg-zinc-700 p-3 rounded-lg"
                  >
                    {prof.profesional.photoLink ? (
                      <Image
                        source={{ uri: prof.profesional.photoLink }}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                        className="mb-2 self-center"
                      />
                    ) : (
                      <View className="w-[100px] h-[100px] bg-zinc-600 rounded-full mb-2 self-center items-center justify-center">
                        <Text className="text-gray-400">Sem foto</Text>
                      </View>
                    )}
                    <Text className="text-white text-center font-poppins-medium">
                      {prof.profesional.name}
                    </Text>
                    <TouchableOpacity
                      className="mt-2 bg-green-600 p-2 rounded-lg"
                      onPress={() => handleWhatsApp(prof.profesional.phoneWpp)}
                    >
                      <Text className="text-white text-center">Contatar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4">
                  Nenhum profissional cadastrado
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            className="mt-4 bg-zinc-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => dispatch({ type: "TOGGLE_SCHEDULE" })}
          >
            <Text className="text-white font-poppins-medium text-lg">
              Horários
            </Text>
            <Ionicons
              name={state.showSchedule ? "chevron-up" : "chevron-down"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {state.showSchedule && (
            <View className="bg-zinc-800 px-4 pb-4 rounded-b-lg">
              {gym.shifts.length > 0 ? (
                gym.shifts.map((shift) => (
                  <View key={shift.id} className="mb-2">
                    <Text className="text-purple-400">{shift.day}</Text>
                    <Text className="text-gray-300">{shift.shift}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4">
                  Nenhum horário cadastrado
                </Text>
              )}
            </View>
          )}

          {gym.images && gym.images.length > 0 ? (
            <View className="mt-4">
              <Text className="text-white font-poppins-medium text-lg mb-2">
                Galeria
              </Text>
              {gym.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ height: 200, borderRadius: 12 }}
                  resizeMode="cover"
                  className="mb-2"
                />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
