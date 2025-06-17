import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CustomAvatarProps {
  image?: string;
  name: string;
}

const CustomAvatar = ({ image, name }: CustomAvatarProps) => {
  const formatName = (name: string) => {
    const names = name.split('');
    if (names.length > 1) {
      return `${names[0]}`;
    }
    return 'A';
  };
  return (
    <Avatar>
      <AvatarImage src={image} />
      <AvatarFallback className="font-medium">{formatName(name)}</AvatarFallback>
    </Avatar>
  );
};
export default CustomAvatar;
