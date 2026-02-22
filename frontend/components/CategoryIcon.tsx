import BoltIcon from '@mui/icons-material/Bolt';
import WeekendIcon from '@mui/icons-material/Weekend';
import BackpackIcon from '@mui/icons-material/Backpack';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CoffeeIcon from '@mui/icons-material/Coffee';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Electronics: BoltIcon,
  Furniture: WeekendIcon,
  Accessories: BackpackIcon,
  Sportswear: FitnessCenterIcon,
  Kitchen: CoffeeIcon,
  Home: HomeIcon,
};

interface Props {
  category: string;
  className?: string;
}

export default function CategoryIconBadge({ category, className = 'w-6 h-6' }: Props) {
  const Icon = iconMap[category] ?? CategoryIcon;
  return <Icon className={className} />;
}
