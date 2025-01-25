type ImageConfigProps = {
  id: number;
  configuration_image_id: number;
  image: string;
  created_at: string;
  updated_at: string;
};

type ConfigImageProps = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  is_active: number;
  tenant_id: number;
  configuration_image_files: ImageConfigProps[];
};

export const getConfigImage = (
  id: number,
  data: ConfigImageProps[]
): ConfigImageProps => {
  const [configImage] = data.filter((config) => config.id === id);
  return configImage;
};
