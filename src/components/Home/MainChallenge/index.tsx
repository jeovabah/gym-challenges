import { View, Text, TouchableOpacity, Image } from "react-native";

export const MainChallenge = () => {
  const challenge = {
    title: "Desafio Mensal",
    description: "Participe & Ganhe Brindes",
    image:
      "https://s3-alpha-sig.figma.com/img/f8e0/d0ea/0ac4b2faf403767d1539ea7a5d4e77d7?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X1p1MHZ53gMXFdMSZfocRdXYISYkz9IxfmlfoHc7URpUd7Ewe9qYeQidCJeN3VpnCUlGj5e1640oZTr5~R1S7po03L-0ImOJFFlNLAlAbGMJk01uaRl000YdCt5UEGYXTCbZuRTZCQ8VxnyYgatnjmDPZ7~W0nXNGdPdgCmPE4MvTn~Hbm4f0PR9BXuqzWD0Z-j~wr12s5e3dhWxdmSasz8AhxefHJv3oZIZ18EUgcwBq90g1cd89OjqZjBe~QqIV4Xte0wzCzEocHSUbJKenUganOZVaVG5G6dwidhSKyL~UTXMThToEsExzUXaL5t8DVdU3cZd4k1JH0A~Ra3jTw__",
  };
  return (
    <>
      {!challenge ? (
        <TouchableOpacity className="bg-secondary px-4 py-[30px]">
          <View className="bg-background p-4 rounded-2xl">
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-poppins-semibold text-xl">
                Veja os desafios do momento
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="bg-secondary px-4 py-[30px]">
          <View className="bg-background p-4 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-tertiary font-poppins-semibold text-3xl">
                  {challenge.title}
                </Text>
                <Text className="text-white font-poppins-regular text-sm text-center">
                  {challenge.description}
                </Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: challenge.image,
                  }}
                  className="rounded-[20px]"
                  width={130}
                  height={125}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};
