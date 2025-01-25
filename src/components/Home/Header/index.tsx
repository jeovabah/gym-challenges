import { ELOS_IMAGE, ELOS, ELOS_NAME } from "@/constants/elo";
import { ProfileContainer } from "@/pages/private/Home/styles";
import { useSession } from "@/providers/SessionProvider";
import { View, Image, Text } from "react-native";

export const Header = () => {
  const { user } = useSession();
  return (
    <>
      <ProfileContainer>
        <Image
          className="w-[65px] h-[65px] rounded-full"
          source={
            user?.game?.elo_id
              ? ELOS_IMAGE[user?.game?.elo_id]
              : ELOS_IMAGE[ELOS.BRONZE]
          }
        />
        <View className="ml-4">
          <Text className="text-sm text-white font-poppins-bold">
            {ELOS_NAME[user?.game?.elo_id || ELOS.BRONZE]}
          </Text>
          <Text className="text-sm text-white font-poppins-regular">
            {user?.game?.points || 0} pontos
          </Text>
          <View className="w-[100px] h-1 bg-gray-200 rounded-full mt-1">
            <View
              className={`h-full bg-primary rounded-full`}
              style={{
                width: `${Math.min(user?.game?.points || 0, 100)}%`,
              }}
            />
          </View>
        </View>
      </ProfileContainer>
      <View className="ml-4 flex-1 items-end">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-poppins-regular text-white">
            Olá,
          </Text>
          <Text className="text-base  text-green-500 font-poppins-bold ">
            {user?.auth?.user_metadata?.name}
          </Text>
        </View>

        <Text className="text-sm text-right font-poppins-regular text-white">
          Cada gota de suor vai te levar para o topo!
        </Text>
      </View>
    </>
  );
};
